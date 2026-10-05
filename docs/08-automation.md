# 08. Automation Catalog

Covers deliverable 16.

## Principles

| Principle | Design |
|---|---|
| Identity | Production automation runs under a **service principal** (application user) for plug-ins and Dataverse operations, and under a **service account or service principal-owned connection** for cloud flows. Never a personal account. Flows are owned by a service identity or a solution-aware owner group, and connection references are set per environment. Service-principal and service-account ownership for flows and connectors must be validated in the target cloud (**GCV**). |
| Choice of mechanism | **Synchronous plug-in** when the logic must be atomic, must not be bypassed by API or import, or must block a save (validation, immutability, separation of duties, numbering). **Cloud flow** when the logic is asynchronous, notifies people, schedules, or integrates with other services. |
| Idempotency | Every automation uses alternate keys or existence checks so a retry does not create duplicates (for example, review generation checks the Review Requirement alternate key). |
| Audit | Automations write Request History Entries (actor is the automation identity, `Actor Is Automation` = Yes). Dataverse auditing records the underlying change. |
| Failure handling | Flows use scopes with a failure branch that logs an error record, notifies the platform team mailbox, and leaves the record in a safe state. Plug-ins throw clear business errors for validation and log unexpected errors. |
| Monitoring | Flow run failures and plug-in trace errors are surfaced to the platform team (see NFR-19). |
| No secrets | No secret is stored in flow definitions or records. Secrets use environment variables of the secret type backed by an approved vault, where supported (**GCV**). |

## Summary

| # | Automation | Mechanism | Trigger |
|---|---|---|---|
| A01 | Request-number generation | Plug-in (pre-operation) | Create of Environment Request |
| A02 | Submission validation | Plug-in plus command-bar action | Submit |
| A03 | Intake derivation (recommendations) | Plug-in | Create and update of intake answers |
| A04 | Review-record generation | Cloud flow, or plug-in action | Intake confirmation |
| A05 | Approval routing | Plug-in action | Reviews complete, or Generate Reviews |
| A06 | Return-for-information notification | Cloud flow | Status becomes Returned for Information |
| A07 | Conditional-approval tracking | Cloud flow | Approval Decision created with conditions |
| A08 | Exception-expiration reminders | Scheduled cloud flow | Daily |
| A09 | Provisioning-task generation | Plug-in action | Request becomes Approved |
| A10 | Post-provisioning validation reminders | Scheduled cloud flow | Daily |
| A11 | Lifecycle-review scheduling | Scheduled cloud flow | Daily |
| A12 | Owner validation | Scheduled cloud flow | Per cadence |
| A13 | Inactive-environment review | Scheduled cloud flow | Per cadence. **GCV** for activity data |
| A14 | Finding reminders | Scheduled cloud flow | Daily |
| A15 | Retirement workflow | Cloud flow plus plug-in guard | Retirement Request created |
| A16 | Status synchronization | Plug-in | Review, task, or decision status changes |
| A17 | Escalation for overdue reviews | Scheduled cloud flow | Daily |
| A18 | Handoff notifications | Cloud flow | Validation complete |
| A19 | Governance reporting | Scheduled cloud flow or Power BI refresh | Scheduled. **GCV** |
| A20 | Separation-of-duties and integrity validation | Plug-in | Create and update of governed tables |

A20 is added because several validation rules in [06-rules.md](06-rules.md) need server-side enforcement.

## Detail

### A01 Request-number generation

| Property | Value |
|---|---|
| Trigger | Pre-operation create of Environment Request |
| Preconditions | Organization Configuration active. Number Sequence row for the prefix and year exists or can be created |
| Processing | Read format and prefix from Organization Configuration. Atomically increment `ppg_lastvalue` on the Number Sequence row (optimistic concurrency with retry). Compose the number from tokens. Set `ppg_requestnumber`. Never set status or organization name in the number |
| Tables affected | Environment Request, Number Sequence, Organization Configuration (read) |
| Failure handling | If the sequence cannot be incremented after the retry limit, fail the create with a clear message. No record is created without a number |
| Retry | Automatic limited retry on concurrency conflict inside the plug-in |
| Audit | Number Sequence changes audited. History entry on create |
| Identity | Plug-in runs as the application user for the sequence update, so no human needs write on Number Sequence |
| Risk if unavailable | No new requests can be created. Existing requests unaffected |
| Plug-in vs flow | **Plug-in required.** Must be synchronous, atomic, and tamper-resistant. A flow cannot guarantee uniqueness |

### A02 Submission validation

| Property | Value |
|---|---|
| Trigger | Command-bar Submit, and pre-operation on status change Draft to Submitted |
| Preconditions | Status is Draft or Returned for Information |
| Processing | Check the 10 intake items (BV-01 to BV-04). Return a readable list of failures. On success set status Submitted, set Submitted On, reassign to the intake queue team, write history |
| Tables affected | Environment Request, Stakeholder Assignment, Request History Entry |
| Failure handling | Block with a message that lists each missing item in plain language |
| Retry | User fixes and resubmits |
| Audit | History entry |
| Identity | User context for validation. Ownership reassignment by the application user |
| Risk if unavailable | Requests cannot be submitted |
| Plug-in vs flow | **Plug-in.** Validation must be synchronous and unbypassable |

### A03 Intake derivation

| Property | Value |
|---|---|
| Trigger | Create and update of data types, capabilities, workload type, impact answer |
| Preconditions | Intake Option mappings configured |
| Processing | Recompute recommended data classification, recommended application classification, recommended family, capability flags, pending flag, effective rank (RR-01 to RR-03, RR-10). Does not overwrite confirmed values |
| Tables affected | Environment Request, Intake Option (read), classification tables (read) |
| Failure handling | On missing mapping, set the pending flag and the conservative default rank, and add a warning to the intake queue |
| Retry | Recomputed on each change |
| Audit | Changes to recommended values are audited |
| Identity | Plug-in under the calling user, writes via the application user for system columns |
| Risk if unavailable | Intake analyst must classify manually. No data loss |
| Plug-in vs flow | **Plug-in** (keeps recommendations consistent in real time). N:N association changes are handled with an associate/disassociate plug-in message |

### A04 Review-record generation

| Property | Value |
|---|---|
| Trigger | Intake analyst runs Confirm Classification and Family (status moves to the first review status) |
| Preconditions | BV-11: classifications and family confirmed. Unknown answers resolved or accepted by intake |
| Processing | Evaluate Intake Option triggers and Approval Rules in priority order. Create Review Requirement rows (basis, reason). Create Governance Review rows for each required type with reviewer team and due date from Review Type. Generate Requested Environment stage records from the confirmed family if absent. Set request status reason by review priority |
| Tables affected | Review Requirement, Governance Review, Requested Environment, Environment Request, Request History Entry |
| Failure handling | The operation is transactional where possible (plug-in action). If run as a flow, a scope with compensation deletes partial records and reports |
| Retry | Idempotent via the Review Requirement alternate key |
| Audit | History entry listing reviews generated and the rules that fired |
| Identity | Application user |
| Risk if unavailable | Intake cannot proceed. Manual generation is possible through admin form |
| Plug-in vs flow | **Plug-in action (preferred)** for atomicity. A cloud flow is acceptable for MVP if built idempotently |

### A05 Approval routing

| Property | Value |
|---|---|
| Trigger | All required reviews Complete (status sync A16), or re-evaluation after a change |
| Preconditions | Required reviews complete |
| Processing | Evaluate escalation rules (T1 to T16). Set escalation flags and reasons. Determine decision authority team. Move status to Pending Approval. Notify the authority team and create an approval task view entry |
| Tables affected | Environment Request, Approval Rule (read), Request History Entry |
| Failure handling | If no rule matches an authority, route to the configured fallback authority (Platform Administrator team) and warn |
| Retry | Idempotent |
| Audit | History entry with the matched rules |
| Identity | Application user |
| Risk if unavailable | Requests stall at reviews complete. Manual routing possible |
| Plug-in vs flow | **Plug-in** for rule evaluation. Notification via flow (A06 style) |

### A06 Return-for-information notification

| Property | Value |
|---|---|
| Trigger | Status becomes Returned for Information |
| Preconditions | A return decision or intake return exists with a rationale and a specific question |
| Processing | Notify the requestor (email or Teams per Notification Rule) with the question and a link. Start a response-due reminder if configured by the organization |
| Tables affected | Request History Entry, Notification Rule (read) |
| Failure handling | Retry the send. On repeated failure, create a task for the intake analyst to contact the requestor |
| Retry | Flow retry policy with exponential backoff |
| Audit | History entry (notification sent) |
| Identity | Service account or shared mailbox via connection reference |
| Risk if unavailable | Requestor is not told. The request still shows in My Work |
| Plug-in vs flow | **Cloud flow** |

### A07 Conditional-approval tracking

| Property | Value |
|---|---|
| Trigger | Approval Decision created with Approve with Conditions |
| Preconditions | Conditions and review or expiration date present |
| Processing | Set Condition Status Open. Create reminders per Notification Rule before the date. On date passing without Met, set Expired, create a Finding, and notify the owner and authority. Block provisioning start if pre-provisioning conditions are marked as gating |
| Tables affected | Approval Decision, Finding, Request History Entry |
| Failure handling | Daily sweep catches missed items |
| Retry | Idempotent daily evaluation |
| Audit | History and finding records |
| Identity | Service identity |
| Risk if unavailable | Conditions may lapse unnoticed. Mitigated by the Conditional Approvals view |
| Plug-in vs flow | **Cloud flow** (scheduled). Gating check is a plug-in (A20) |

### A08 Exception-expiration reminders

| Property | Value |
|---|---|
| Trigger | Daily schedule |
| Preconditions | Approved exceptions with expiration dates |
| Processing | Notify the risk owner and authority at configured lead times. On expiry set Expired and raise a Finding if the underlying condition persists |
| Tables affected | Governance Exception, Finding, Request History Entry |
| Failure handling | Failure branch logs and alerts the platform team. Next run recovers |
| Retry | Daily |
| Audit | History entry |
| Identity | Service identity |
| Risk if unavailable | Expired exceptions persist silently. Expiring Exceptions view is the fallback |
| Plug-in vs flow | **Cloud flow** |

### A09 Provisioning-task generation

| Property | Value |
|---|---|
| Trigger | Request status becomes Approved or Approved with Conditions |
| Preconditions | Approval Decision exists, approver is not requestor, support plan present if production-class stage (BV-12), gating conditions satisfied |
| Processing | For each Requested Environment, instantiate Provisioning Tasks from templates matching family and type, including validation and handoff tasks, with sequence, execution mode, assignees, due dates, and Production gating. Apply the naming standard to the proposed environment name |
| Tables affected | Provisioning Task, Provisioning Task Template (read), Naming Standard (read), Requested Environment, Environment Request |
| Failure handling | Transactional creation or compensation. Report failures to the platform team |
| Retry | Idempotent by template and requested environment |
| Audit | History entry |
| Identity | Application user |
| Risk if unavailable | Provisioner creates tasks manually |
| Plug-in vs flow | **Plug-in action preferred.** Flow acceptable if idempotent |

### A10 Post-provisioning validation reminders

| Property | Value |
|---|---|
| Trigger | Daily schedule |
| Preconditions | Validation or handoff tasks open past due or approaching due |
| Processing | Remind assignee and provisioner team. Escalate to the Platform Administrator team after the organization-defined period |
| Tables affected | Provisioning Task, Request History Entry |
| Failure handling | Alert on failure |
| Retry | Daily |
| Audit | History entry |
| Identity | Service identity |
| Risk if unavailable | Validation drift. Validation and Handoff view is the fallback |
| Plug-in vs flow | **Cloud flow** |

### A11 Lifecycle-review scheduling

| Property | Value |
|---|---|
| Trigger | Daily schedule, and when a request completes |
| Preconditions | Active Provisioned Environment with a review cadence (environment family or Organization Configuration) |
| Processing | If Next Review Due falls within the lead window and no open Lifecycle Review exists, create one with Review Items from the template, assign the reviewer, and update Next Review Due after completion |
| Tables affected | Lifecycle Review, Lifecycle Review Item, Provisioned Environment |
| Failure handling | Log and alert. Idempotent daily run |
| Retry | Daily |
| Audit | History and review record |
| Identity | Service identity |
| Risk if unavailable | Reviews not scheduled. Environments Due for Review view is the fallback |
| Plug-in vs flow | **Cloud flow** |

### A12 Owner validation

| Property | Value |
|---|---|
| Trigger | Scheduled per cadence and on user deactivation |
| Preconditions | Active Stakeholder Assignments |
| Processing | Check the person is an enabled user (Entra-synced). Notify owners to confirm. Mark Last Validated On. If a user is disabled or an owner role is vacant, create a Finding of type Ownership and flag the environment as Ownerless |
| Tables affected | Stakeholder Assignment, Provisioned Environment, Finding |
| Failure handling | Alert on failure |
| Retry | Scheduled |
| Audit | History and finding |
| Identity | Service identity |
| Risk if unavailable | Orphaned environments go unnoticed. Ownerless view is a fallback |
| Plug-in vs flow | **Cloud flow** |

### A13 Inactive-environment review

| Property | Value |
|---|---|
| Trigger | Scheduled per cadence |
| Preconditions | Activity data is available. In MVP this is a manual input on Lifecycle Review Items |
| Processing | MVP: remind reviewers to assess activity manually. Later: import activity data from platform admin telemetry and flag inactive environments for retirement recommendation (**GCV**) |
| Tables affected | Lifecycle Review Item, Provisioned Environment |
| Failure handling | Alert |
| Retry | Scheduled |
| Audit | History |
| Identity | Service principal with admin API permission (later) |
| Risk if unavailable | Inactivity not detected automatically |
| Plug-in vs flow | **Cloud flow** |

### A14 Finding reminders

| Property | Value |
|---|---|
| Trigger | Daily schedule |
| Preconditions | Open findings with due dates |
| Processing | Remind owners before due. Escalate overdue findings by severity per the Notification Rule |
| Tables affected | Finding, Request History Entry |
| Failure handling | Alert |
| Retry | Daily |
| Audit | History |
| Identity | Service identity |
| Risk if unavailable | Findings age. Open Findings view is fallback |
| Plug-in vs flow | **Cloud flow** |

### A15 Retirement workflow

| Property | Value |
|---|---|
| Trigger | Retirement Request created |
| Preconditions | Provisioned Environment is Active or Retirement Recommended |
| Processing | Generate the checklist (12 items) from template. Request owner approvals (business, technical, data). Route security review if required. Track checklist. Guard completion (BV-23). On completion update the environment state and inventory and notify |
| Tables affected | Retirement Request, Retirement Checklist Item, Provisioned Environment, Request History Entry |
| Failure handling | Compensation. Alert |
| Retry | Idempotent |
| Audit | History and checklist evidence |
| Identity | Service identity |
| Risk if unavailable | Manual retirement. Controls still enforced by the guard plug-in |
| Plug-in vs flow | **Cloud flow** for orchestration. **Plug-in** for the completion guard |

### A16 Status synchronization

| Property | Value |
|---|---|
| Trigger | Post-operation on Governance Review, Provisioning Task, Approval Decision status changes |
| Preconditions | Related request exists |
| Processing | Recompute the request status reason from review and task states (priority rule in [03-process.md](03-process.md)). Does not change terminal statuses |
| Tables affected | Environment Request, Request History Entry |
| Failure handling | Reconciliation flow runs periodically to correct drift |
| Retry | Recompute is idempotent |
| Audit | History for each change |
| Identity | Application user |
| Risk if unavailable | Request status drifts. A reconciliation view lists mismatches |
| Plug-in vs flow | **Plug-in** for immediacy. Daily reconciliation flow as a safety net |

### A17 Escalation for overdue reviews

| Property | Value |
|---|---|
| Trigger | Daily schedule |
| Preconditions | Reviews past due date. Due offsets are organization-set |
| Processing | Notify reviewer, then the reviewer team lead, then Platform Administrator, per the Notification Rule. Flag Overdue |
| Tables affected | Governance Review, Request History Entry |
| Failure handling | Alert |
| Retry | Daily |
| Audit | History |
| Identity | Service identity |
| Risk if unavailable | Silent delay. Overdue Reviews view is the fallback |
| Plug-in vs flow | **Cloud flow** |

### A18 Handoff notifications

| Property | Value |
|---|---|
| Trigger | Validation tasks complete or request Completed |
| Preconditions | Owners assigned |
| Processing | Notify business and technical owners to accept handoff, with environment URL, support plan, and runbook links. Record acceptance as a task result |
| Tables affected | Provisioning Task, Request History Entry |
| Failure handling | Retry. Escalate to provisioner |
| Retry | Backoff |
| Audit | History |
| Identity | Service account or shared mailbox |
| Risk if unavailable | Handoff delayed. Task still visible |
| Plug-in vs flow | **Cloud flow** |

### A19 Governance reporting

| Property | Value |
|---|---|
| Trigger | Scheduled |
| Preconditions | Reporting views and KPI definitions exist |
| Processing | Produce the periodic governance summary (KPIs in [09-audit-reporting.md](09-audit-reporting.md)) and distribute to the governance board. Optionally refresh a Power BI dataset (**GCV**) |
| Tables affected | Read-only |
| Failure handling | Alert. Report can be generated manually |
| Retry | Next schedule |
| Audit | Delivery recorded in history of the Organization Configuration or a log table |
| Identity | Service identity |
| Risk if unavailable | Manual reporting |
| Plug-in vs flow | **Cloud flow** |

### A20 Separation-of-duties and integrity validation

| Property | Value |
|---|---|
| Trigger | Pre-operation on create or update of Approval Decision, Governance Review, Finding, Request, Review Requirement, Stakeholder Assignment, Provisioning Task |
| Preconditions | Not applicable |
| Processing | Enforce BV-14 to BV-35 that need server-side checks: approver is not requestor, reviewer separation, finding closure rules, immutability of request number and requestor after submit, Test-before-Production gate, completion guard, secret pattern check |
| Tables affected | Per rule |
| Failure handling | Block with a clear business error |
| Retry | Not applicable |
| Audit | Failures can be logged to trace |
| Identity | Runs in the caller's context to see the actual user. Reads helper data via the application user |
| Risk if unavailable | Governance rules could be bypassed. This is the highest-risk automation to keep available |
| Plug-in vs flow | **Plug-in required.** |

## Cross-cutting design

| Concern | Design |
|---|---|
| Solution packaging | Plug-ins and flows live in the Automation solution. Flows reference connections through connection references and use environment variables for URLs and mailbox addresses |
| Plug-in registration | Plug-in assembly registered under the application user. Steps documented in the repo. Isolation mode and sandbox limits validated in the target cloud (**GCV**) |
| Testing | Plug-in unit tests with a faked context. Flow tests with test data. Deployment smoke test runs a request through submit to review generation |
| Disabling | An environment variable can pause scheduled flows during maintenance. Plug-ins never rely on flags to bypass governance validation |
| Run-as | Flows owned by a service identity. Owner changes are an ALM step. Do not bind to a personal account |
