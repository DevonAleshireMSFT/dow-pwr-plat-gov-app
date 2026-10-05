# 11. Delivery: Risks, Scope, Stories, Backlog, and Traceability

Covers deliverables 22 to 27. Sections 25, 26, and 27 are generated from [tools/backlog.js](../tools/backlog.js) by `node tools/gen-backlog-md.js`. Do not edit the generated block by hand.

## 22. Risks, gaps, and design decisions

### Risks

| # | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | Plug-ins, flows, or service principals are unavailable or restricted in the target government cloud | High | Unknown | Validate G01 to G03 and G21 in the first spike. Fallback designs in [10-alm-govcloud.md](10-alm-govcloud.md) |
| R2 | Governance board delays approving Intake Option mappings, impact question wording, and approval rules (D13 to D15) | High | Medium | Ship example values as seed, mark them examples, and make them configuration so approval does not block build |
| R3 | Requestors answer "I don't know" often, which increases intake analyst workload | Medium | Medium | Track K21 and K22. Tune wording and mappings. Provide analyst guidance |
| R4 | Incorrect mappings from requestor answers produce wrong routing | High | Medium | Intake confirm step. Conservative default. Rule test fixtures per trigger |
| R5 | Over-configuration makes the app hard to set up | Medium | Medium | Provide a USMC and a minimal sample seed. Configuration validation. Implementation guide |
| R6 | Seed values leak into schema or logic, which breaks generalization | Medium | Low | Forbidden-literal scan in CI. Generalization test with a non-USMC seed |
| R7 | Request status ambiguity with parallel reviews | Medium | Medium | Priority rule for status. Reviews hold their own status. Status sync with reconciliation |
| R8 | Flows or connections are owned by personal accounts | High | Medium | Service identity requirement and deployment validation check |
| R9 | Sensitive text (secrets, mission detail) is entered in free-text fields | High | Medium | Form guidance, secret-pattern check, column security, requestor form limits detail |
| R10 | SharePoint integration unavailable or not approved for evidence | Medium | Medium | Link-only Supporting Document design. Decision D12 |
| R11 | Manual provisioning backlog and delay | Medium | Medium | Task templates, dashboards, reminders. Automate task by task after validation |
| R12 | Audit volume and retention not defined | Medium | Medium | Decision D7. Column-level audit scoping. Export procedure |
| R13 | Single app deployment serves several organizations and data separation is inadequate | High | Low to Medium | Decision D9 early. Business-unit scoping tested in role tests |
| R14 | Layered solution dependencies cause import-order failures | Low | Medium | Dependency order documented. Layers 1 and 2 may be merged for MVP |
| R15 | The app itself becomes an unmanaged Production system | Medium | Low | Treat it as a Production system with owner, support plan, and lifecycle review in its own inventory |

### Gaps

| # | Gap | Action |
|---|---|---|
| X1 | Authoritative environment inventory source is not decided (D11) | Decide before inventory build. MVP assumes the app is authoritative for governed records and manual entry for platform data |
| X2 | Review cadences and service-level targets are not defined (D3, D4) | Organization decides. Configuration fields have no schema defaults |
| X3 | Definition of high-risk connector is not defined (D5) | Security and DLP reviewers define. Seed examples are labeled |
| X4 | Records-retention periods are not defined (D7) | Records manager decides |

### Design decisions recorded

| # | Decision | Reference |
|---|---|---|
| DD1 | Configuration over hard-coding | ADR 0001 |
| DD2 | Layered managed solutions | ADR 0002 |
| DD3 | Manual-first provisioning with an automation-ready model | ADR 0003 |
| DD4 | Simple requestor intake, governance determines controls | ADR 0004 |
| DD5 | Request separate from Provisioned Environment | [04-data-model/README.md](04-data-model/README.md) |
| DD6 | Reviews hold their own state, request status shows the primary stage | [03-process.md](03-process.md) |
| DD7 | Append-only decisions and history | [04-data-model/review-approval.md](04-data-model/review-approval.md) |
| DD8 | Server-side plug-ins enforce integrity and separation of duties | [08-automation.md](08-automation.md) |
| DD9 | SharePoint link-based evidence | [09-audit-reporting.md](09-audit-reporting.md) |
| DD10 | Six supplemental tables (License Type, Review Type, Provisioning Task Template, Number Sequence, Lifecycle Review Item, Intake Option) | [04-data-model/README.md](04-data-model/README.md) |

## 23. MVP scope

The MVP delivers a working request-to-validated-environment path with manual provisioning, strong governance, and the simplified requestor experience.

| Included in MVP | Notes |
|---|---|
| Organization Configuration, reference tables, Intake Options, seed package | USMC example and a minimal alternate sample |
| 10-item requestor request, submission validation, return for information, withdraw, resubmission | Plain-language form |
| Immutable request number | Plug-in |
| Classification derivation and intake confirmation | Human confirmation required |
| Rules-driven review generation, review records, Program Core recommendation | |
| Connector register, requested connectors, external integrations | |
| Licensing requirement, capacity estimate, security requirement, authorization boundary, support plan | Support plan required before Production approval |
| Approval routing, decisions, conditional approval tracking, exceptions | |
| Provisioning tasks from templates (manual), validation checklist, handoff, completion guard | Test-before-Production gate |
| Provisioned Environment inventory and configuration records | |
| Findings and remediation | |
| 14 security roles, column security, separation of duties plug-in | |
| Request history, auditing | |
| Model-driven app, sitemap, forms, views, native dashboards | |
| Notifications (email baseline), overdue escalation, service-identity automation | |
| Government-cloud validation spike, layered solutions, CI, deployment validation | |

### Out of MVP

See section 24.

## 24. Later-phase enhancements

| # | Enhancement | Dependency |
|---|---|---|
| P1 | Periodic lifecycle review scheduling and review items | MVP inventory |
| P2 | Owner validation automation and inactive-environment review | G07 for activity data |
| P3 | Environment change requests with linked re-review | MVP request and review |
| P4 | Retirement workflow with checklist and guard | MVP inventory |
| P5 | API-based provisioning task automation | G07, G10, G21 |
| P6 | Inventory synchronization with tenant admin data | G07 |
| P7 | DLP policy and connector register synchronization | G10 |
| P8 | Power BI reporting, time-in-stage, and scheduled governance report | G15 |
| P9 | Native SharePoint document management integration | G06 |
| P10 | Teams notifications and adaptive cards | G05 |
| P11 | Configuration coherence validation | MVP configuration |
| P12 | Intake tuning dashboard (K21, K22) and suggested mapping changes | MVP data |
| P13 | Portal or canvas requestor front end for broader user reach | Decision on licensing and access |
| P14 | Multi-organization tenancy hardening | Decision D9 |

<!-- BEGIN GENERATED -->

## 25. User stories with acceptance criteria

### F-DATAMODEL: Core data model

**S-DM-01 Create publisher and Core Data Model solution**

As a solution developer, I want a publisher and the Core Data Model solution so that all tables live in one governed layer.

Acceptance criteria:

- Publisher with prefix ppg exists and is documented
- Solution ppg_core is unmanaged in dev and exported unpacked to solutions/ppg_core
- Solution passes solution checker with no critical issues

**S-DM-02 Build configuration and reference tables**

As a platform administrator, I want the configuration and reference tables so that organization-specific values are data, not code.

Acceptance criteria:

- Tables 4, 5, 7, 9, 10, 11, 14, 33 to 42 and 44 exist with the columns, types, and alternate keys in docs/04-data-model/config-reference.md
- Organization-owned ownership is set
- No organization name appears in any schema name or label

**S-DM-03 Build request-domain tables**

As a solution developer, I want the request-domain tables so that request data is normalized.

Acceptance criteria:

- Tables 1, 2, 6, 8, 12, 13, 15, 16, 17, 18, 25, 31, 32 exist per docs/04-data-model/request.md
- Lookups and N:N relationships match docs/04-data-model/relationships.md
- Requestor-provided and derived columns are separated as in the dictionary

**S-DM-04 Build review, approval, and exception tables**

As a solution developer, I want the review and approval tables so that each review keeps its own state.

Acceptance criteria:

- Tables 19 to 22 exist per docs/04-data-model/review-approval.md
- Status reason values match the dictionary

**S-DM-05 Build provisioning, inventory, and lifecycle tables**

As a solution developer, I want the inventory and lifecycle tables so that environments persist beyond requests.

Acceptance criteria:

- Tables 3, 23, 24, 26 to 30 and 43 exist per docs/04-data-model/provisioning-lifecycle.md
- Provisioned Environment links to the originating Request and Requested Environment

**S-DM-06 Enable auditing on governed tables**

As an auditor, I want auditing enabled so that governance changes are traceable.

Acceptance criteria:

- Table and column auditing are enabled as listed in docs/09-audit-reporting.md
- Audit data is visible to the Auditor role only

### F-ORGCONFIG: Organization Configuration and reference administration

**S-OC-01 Organization Configuration record and form**

As an implementation team member, I want to configure organization terminology, boundary, cadence, naming, number format, and notification settings so that the app fits my organization.

Acceptance criteria:

- All fields in the Organization Configuration dictionary are on the form
- Only one active record is allowed
- Changing terminology changes labels where configured without a solution update

**S-OC-02 Environment family and type administration**

As a platform administrator, I want to define families and types so that environment structure is configurable.

Acceptance criteria:

- Families and types can be added and deactivated
- A family cannot be saved active without at least one type
- Types support predecessor, production-class, optional, and default-included flags

**S-OC-03 Classification administration**

As a governance board member, I want configurable application and data classifications with ranks so that the most restrictive rule works for any organization.

Acceptance criteria:

- Classifications have a unique rank and code
- Data classification supports governed, sensitive, high-impact, and not-supported flags

**S-OC-04 Stakeholder role, review type, and license type administration**

As a platform administrator, I want to maintain roles, review types, and license types as reference data.

Acceptance criteria:

- Role codes drive logic, names are labels
- Review types carry default reviewer team and due offset with no schema default

### F-INTAKEOPT: Intake Option configuration

**S-IO-01 Intake Option table, form, and views**

As a platform administrator, I want to configure the plain-language answer options and their governance mappings so that requestors never see classification labels.

Acceptance criteria:

- Option groups Data Type, Capability, Workload Type, and Impact exist
- Mappings to classification, family, review type, and flags are editable
- Unknown options are flaggable

**S-IO-02 Intake Option mapping validation**

As a governance board member, I want invalid or incomplete mappings flagged so that routing cannot silently fail.

Acceptance criteria:

- A warning shows when an option group has no unknown option
- A warning shows when a data-type option lacks a minimum classification

### F-SEED: USMC example seed package

**S-SD-01 Seed package structure and upsert script**

As an implementation team member, I want a separable seed package using alternate keys so that I can import, replace, or skip the USMC examples.

Acceptance criteria:

- Seed lives in seed/ and is not part of any solution
- Re-running the import does not create duplicates
- A non-USMC sample seed imports cleanly

**S-SD-02 USMC seed values**

As a USMC implementer, I want the USMC defaults as starting configuration.

Acceptance criteria:

- Organization, boundary, platform team, governance board, and security reviewer terms are seeded as configuration values
- Families Platform, Shared Services, Command Hub, Program, Individual Developer, Default with their types are seeded
- Application and data classifications from the spec are seeded with ranks
- Seeded values are labeled as examples

**S-SD-03 Seed Intake Options, approval rules, and task templates**

As an implementer, I want example Intake Options, escalation rules T1 to T16, and provisioning task templates so that I can start from a working baseline.

Acceptance criteria:

- Example options and rules match docs/03a and docs/05
- Rules are marked as examples pending governance board approval

### F-ENVVARS: Environment variables and connection references

**S-EV-01 Define environment variables**

As a release manager, I want environment variables for deployment-specific values so that no endpoint is hard-coded.

Acceptance criteria:

- Variables listed in docs/10-alm-govcloud.md are defined
- No variable holds a secret value in the solution

### F-REQNUM: Immutable request identifier

**S-RN-01 Request number plug-in**

As a requestor, I want a unique request number on creation so that I can reference my request.

Acceptance criteria:

- Number format comes from Organization Configuration
- Number contains no status or organization name
- Concurrent creates never produce duplicates
- Number cannot be changed after creation

**S-RN-02 Number Sequence maintenance**

As a platform administrator, I want sequences per prefix and year so that numbering restarts as configured.

Acceptance criteria:

- A new year creates a new sequence row
- Only the automation identity can update the last value

### F-INTAKEFORM: Requestor 10-item request form

**S-IF-01 Requestor quick-create and main form**

As a requestor, I want a short form with plain-language questions so that I can request an environment without knowing governance terms.

Acceptance criteria:

- The form shows exactly the 10 intake items plus title
- Classification, licensing, security, and review fields are not visible
- Help text comes from Intake Option

**S-IF-02 Conversational data type and capability questions**

As a requestor, I want to answer what kind of information and capabilities I need, including I don't know, so that I am not blocked.

Acceptance criteria:

- Data type and capability multi-selects include unknown options
- Selecting an unknown option does not block submission

**S-IF-03 Conditional prompts**

As a requestor, I want follow-up questions only when relevant so that the form stays short.

Acceptance criteria:

- Systems summary appears when connects to another system is Yes or Not Sure
- End date is required when duration is Temporary
- Authorization-boundary question appears per rules and allows Unknown
- Data Owner appears when the data types prompt it

**S-IF-04 Workload type drives recommended family**

As a requestor, I want to say what kind of workload I have and see a recommended environment family so that I do not choose Dev, Test, or Production.

Acceptance criteria:

- Selecting a workload type prefills the recommended family
- I can accept, change, or leave it as Not sure
- No stage selection is shown to the requestor

**S-IF-05 Business and technical owner capture**

As a requestor, I want to name the business and technical owners so that accountability is recorded.

Acceptance criteria:

- Selections create Stakeholder Assignment records
- Both are required to submit
- A person can be a user or a contact

### F-SUBMIT: Submission and request lifecycle actions

**S-SB-01 Submission validation**

As a requestor, I want a clear list of what is missing when I submit so that I can fix it.

Acceptance criteria:

- Submit validates the 10 items and lists failures in plain language
- Unknown answers pass validation
- On success status is Submitted and ownership moves to the intake queue

**S-SB-02 Return for information and resubmit**

As a requestor, I want to see the specific question returned to me and answer it so that my request continues.

Acceptance criteria:

- A rationale and question are required to return a request
- I see the question in My Work and can reply and resubmit
- History records each return and resubmission

**S-SB-03 Withdraw and cancel**

As a requestor, I want to withdraw my request so that it stops processing.

Acceptance criteria:

- Withdraw requires a rationale and is allowed from Draft, Submitted, and Returned
- Cancel by an authorized role requires a rationale
- Terminal statuses block further edits

**S-SB-04 Resubmission after rejection**

As a requestor, I want to start a new request from a rejected one so that I keep context.

Acceptance criteria:

- A new request references the prior request
- The rejected request is not reopened

### F-STATUS: Status model and business process flow

**S-ST-01 Request status reasons**

As an intake analyst, I want the defined status reasons so that requests are consistently tracked.

Acceptance criteria:

- Status reasons match docs/03-process.md
- Terminal statuses are Inactive state

**S-ST-02 Business process flow**

As a user, I want a staged process bar so that I know where a request is.

Acceptance criteria:

- Ten stages exist per docs/03-process.md
- Stage 1 requires only the 10 intake items
- Return paths move to the defined earlier stage

**S-ST-03 Status synchronization**

As an intake analyst, I want request status to reflect review and task states so that I do not update it by hand.

Acceptance criteria:

- Open reviews set status by priority
- All reviews complete moves to Pending Approval
- Terminal statuses are never overwritten

### F-REQENV: Requested Environment and Application

**S-RE-01 Generate requested environment stage records**

As an intake analyst, I want stage records generated from the confirmed family so that a request can produce an environment set.

Acceptance criteria:

- Default-included types become Requested Environment rows
- Optional types require a justification
- One request can have zero, one, or many provisioned environments

**S-RE-02 Application or workload record**

As a technical owner, I want to create or match an application record so that environments tie to a persistent workload.

Acceptance criteria:

- An application can be reused across requests
- Program Core indicator fields are on the application and request

### F-HISTORY: Request history and comments

**S-HI-01 Append-only request history**

As an auditor, I want a business-readable append-only history so that I can reconstruct what happened.

Acceptance criteria:

- Status changes, decisions, returns, and automation actions create entries
- No role can update or delete entries
- Automation entries are marked as automation

**S-HI-02 Comments**

As a reviewer, I want to add comments so that discussion is retained.

Acceptance criteria:

- Comments create history entries
- Platform-only comments are hidden from the requestor

### F-CLASSDERIVE: Classification derivation and intake confirmation

**S-CD-01 Derive recommended classifications**

As an intake analyst, I want recommended data and application classifications from the requestor answers so that I can confirm rather than start from scratch.

Acceptance criteria:

- Recommended data classification is the highest minimum among selected data types
- Unknown answers set the pending flag
- Effective rank is the greater of the two ranks, with the conservative default when unconfirmed

**S-CD-02 Intake confirm step**

As an intake analyst, I want to confirm or change classification and family so that routing is based on a human decision.

Acceptance criteria:

- Confirming requires the classifications and family
- A change from the recommendation requires triage notes
- Changes are recorded in history

**S-CD-03 Not-supported data handling**

As a governance board member, I want not-supported data routed to a human decision so that nothing is auto-rejected.

Acceptance criteria:

- A warning and decision task are created
- The request cannot reach Pending Approval without a recorded human decision

### F-REVGEN: Rules-driven review generation

**S-RG-01 Review Requirement generation**

As an intake analyst, I want required reviews generated from rules and intake option triggers so that not every request gets every review.

Acceptance criteria:

- Review Requirements are created with basis and reason
- Generation is idempotent
- Generation is blocked until classifications and family are confirmed

**S-RG-02 Governance Review records**

As a reviewer, I want a review record with my own status, outcome, conditions, and completion date.

Acceptance criteria:

- Each required review type has a Governance Review row
- Review status is independent of request status
- Completed reviews require a completion date

**S-RG-03 Waive a review requirement**

As an authorized role, I want to waive a non-mandatory review with a rationale so that unnecessary work is avoided.

Acceptance criteria:

- Waiver requires a rationale
- Mandatory escalation reviews cannot be waived by intake

### F-PROGCORE: Program Core recommendation

**S-PC-01 Program Core indicators and recommendation**

As a technical owner, I want to answer the architectural indicators so that the app can suggest whether Program Core is warranted.

Acceptance criteria:

- Importance, mission criticality, and longevity are not indicators
- Recommendation values are Recommended, Not Recommended, or Insufficient Information
- Only shown for the Program family

**S-PC-02 Authorized reviewer decision**

As an authorized reviewer, I want to include or exclude Program Core with a rationale so that the final decision is human.

Acceptance criteria:

- Rationale is required when the decision differs from the recommendation
- Decision, user, and date are recorded

### F-REVUI: Review work queues and forms

**S-RU-01 Review queues by type**

As a reviewer, I want queues for my review type so that I can find my work.

Acceptance criteria:

- Views exist for Security, Licensing and Capacity, Connector and DLP, Governance
- My Reviews and Overdue Reviews views exist

### F-CONNREG: Connector register and DLP policy reference

**S-CR-01 Connector register**

As a Connector and DLP reviewer, I want a register of connectors with risk, status, and DLP grouping so that decisions are consistent.

Acceptance criteria:

- Register holds type, publisher, risk, high-risk flag, approval status, DLP grouping
- Approval status and risk changes are audited

**S-CR-02 DLP policy reference**

As a Connector and DLP reviewer, I want DLP policies recorded as reference so that environments and connectors link to them.

Acceptance criteria:

- Policies can apply to families through N:N
- The app does not claim to enforce DLP

### F-REQCONN: Requested connectors and external integrations

**S-RC-01 Requested Connector assessment**

As a Connector and DLP reviewer, I want request-specific connector records so that I can assess and decide each connector.

Acceptance criteria:

- Record captures the attributes in the spec
- Existing approval status is copied from the register
- Stages are linked through N:N
- Decision expiration is required for conditional decisions

**S-RC-02 External Integration records**

As a technical owner, I want to record each integration so that it is assessed.

Acceptance criteria:

- All 17 integration attributes are captured
- Integrations can depend on connectors through N:N
- No credentials are accepted in free text

**S-RC-03 Connector and integration escalation flags**

As a governance board member, I want high-risk, custom, external-facing, and cross-program items to escalate so that they are decided at the right level.

Acceptance criteria:

- Flags set escalation reasons on the request
- Rules T3 to T6 and T10 are evaluated

### F-LICCAP: Licensing and capacity assessment

**S-LC-01 Licensing Requirement and License Type**

As a Licensing and Capacity reviewer, I want licensing records with configurable license types so that I can assess entitlement and funding.

Acceptance criteria:

- Users by role, makers, application users, license type, entitlement, and funding owner are captured
- Outcome and decision notes are recorded
- The requestor is not asked for licensing detail

**S-LC-02 Capacity Estimate**

As a Licensing and Capacity reviewer, I want database, file, and log estimates per Dataverse environment so that I can plan capacity.

Acceptance criteria:

- An estimate is required for each Dataverse requested environment
- Capacity above the configured threshold raises escalation

### F-SECREQ: Security requirement and authorization boundary

**S-SR-01 Authorization Boundary records**

As a security reviewer, I want reusable authorization boundary records so that requests and environments link to the right boundary.

Acceptance criteria:

- Existing or New or Changed, status, owner, and POCs are captured
- Terminology labels follow Organization Configuration
- Unknown is allowed at intake

**S-SR-02 Security Requirement record**

As a security reviewer, I want a structured security requirement record so that I can document needs and outcome.

Acceptance criteria:

- All spec attributes are captured
- Sensitive columns use the Security Detail column profile
- No secret, password, certificate, key, or token is accepted in text columns

**S-SR-03 Security review requirement for sensitive data**

As a security authority, I want security review required for sensitive-data requests so that none bypasses review.

Acceptance criteria:

- Sensitive data classification generates a Security Review Requirement
- Authorization information is required before the security review completes for CUI and sensitive workloads

### F-SUPPORT: Support and Sustainment Plan

**S-SP-01 Structured support plan**

As a technical owner, I want a structured support plan so that support and recovery are defined.

Acceptance criteria:

- All 20 spec attributes are captured
- RTO and RPO are required when the classification requires them
- No secrets are stored

**S-SP-02 Support plan required before Production approval**

As a platform administrator, I want Production approval blocked without a support plan so that nothing runs unsupported.

Acceptance criteria:

- An approval decision for a production-class stage fails without a complete plan
- The plan is not required to submit

### F-DOCS: Supporting documents and SharePoint links

**S-DC-01 Supporting Document metadata and link**

As a reviewer, I want to attach evidence links with a document type so that evidence is findable.

Acceptance criteria:

- A document record holds type, URL, version, and regarding record
- Dataverse stores no file content
- At least one regarding lookup is required

**S-DC-02 SharePoint folder creation flow**

As a platform administrator, I want a folder created per request so that documents are organized.

Acceptance criteria:

- Folder is created from the request number
- Depends on validation of SharePoint integration (gov-cloud-validate)

### F-ROUTING: Approval routing rules

**S-AR-01 Approval Rule evaluation**

As a platform administrator, I want configurable approval rules so that routine requests go to delegated authority and escalated ones go higher.

Acceptance criteria:

- Rules evaluate in priority order
- Triggers T1 to T16 are supported and individually activatable
- A fallback authority is used if nothing matches

**S-AR-02 Escalation flags and reasons**

As a governance board member, I want to see why a request was escalated so that I can decide efficiently.

Acceptance criteria:

- Escalation reasons are shown on the request and snapshot on the decision

**S-AR-03 Approval rule test dialog**

As a platform administrator, I want to preview which rules match a sample request so that I can test rule changes.

Acceptance criteria:

- Dialog lists matched rules, reviews, and authority for a chosen request

### F-DECISION: Approval decisions

**S-AD-01 Record a decision**

As an approver, I want to record Approve, Approve with conditions, Reject, Return, Withdraw, or Cancel so that the outcome is recorded.

Acceptance criteria:

- Authority, approver, date, rationale, conditions, expiration, related review, exception, and evidence are captured
- Rationale is required for Reject, Return, Cancel, Withdraw
- Conditions and a review or expiration date are required for Approve with conditions
- The approver cannot be the requestor

**S-AD-02 Decision immutability**

As an auditor, I want decisions to be append-only so that history cannot be altered.

Acceptance criteria:

- Decisions cannot be edited or deleted after creation
- A new decision supersedes without overwriting

**S-AD-03 Conditional approval tracking**

As a platform administrator, I want conditions tracked with reminders so that conditions are met or expire visibly.

Acceptance criteria:

- Condition status Open, Met, Expired, Waived
- Reminders before the review date
- Expired conditions create a finding

### F-EXCEPTION: Governance exceptions

**S-EX-01 Exception record and workflow**

As a governance board member, I want time-bound exceptions with compensating controls so that deviations are controlled.

Acceptance criteria:

- Approved exceptions require an expiration date
- Exceptions can link to requests, environments, and connectors

**S-EX-02 Expiring exceptions view and reminders**

As a security reviewer, I want expiring exceptions surfaced so that they are renewed or closed.

Acceptance criteria:

- Expiring Exceptions view uses the configured window
- Reminders go to the risk owner and authority

### F-PROVTASK: Provisioning task generation and execution

**S-PT-01 Task templates**

As a platform administrator, I want provisioning task templates per family and type so that tasks are consistent.

Acceptance criteria:

- Templates include the activities listed in the spec
- Each template has execution mode and automation dependency flagged for validation

**S-PT-02 Generate tasks on approval**

As a provisioner, I want tasks generated when a request is approved so that I have a work list.

Acceptance criteria:

- One task per required activity per requested environment
- Generation is idempotent
- Naming standard is applied to the proposed name

**S-PT-03 Complete tasks with evidence**

As a provisioner, I want to complete tasks with evidence so that provisioning is traceable.

Acceptance criteria:

- Tasks requiring evidence cannot complete without a linked document
- Completion records user and time

**S-PT-04 Test before Production gate**

As a platform administrator, I want Production provisioning blocked until required Test validation is complete.

Acceptance criteria:

- Production tasks cannot start until Test validation tasks pass
- The block message names the missing validation

### F-VALID: Post-provisioning validation and handoff

**S-VL-01 Validation checklist tasks**

As a provisioner, I want the 18 validation checks as tasks so that I confirm the environment is correct.

Acceptance criteria:

- Checks generated from templates
- Result is Pass, Fail, Accepted with Exception, or Not Applicable

**S-VL-02 Owner handoff acceptance**

As a business owner and technical owner, I want to accept handoff so that responsibility is explicit.

Acceptance criteria:

- Both owners record acceptance
- Support and runbook locations must be recorded first

**S-VL-03 Completion guard**

As an auditor, I want a request completed only with environment records and validation evidence.

Acceptance criteria:

- Completion fails if no Provisioned Environment exists, validation evidence is missing, a validation task failed, or handoff is not accepted

### F-PROVENV: Environment inventory and configuration

**S-PE-01 Provisioned Environment record**

As a platform administrator, I want an inventory record for every environment so that I can govern it.

Acceptance criteria:

- Record holds ID, URL, family, type, region, boundary, classifications, owners
- Linked to the originating request and requested environment

**S-PE-02 Environment Configuration items**

As a provisioner, I want to record configuration items and their verification so that drift is visible.

Acceptance criteria:

- Items support the configuration types in the dictionary
- Values are names or identifiers only

**S-PE-03 Inventory views**

As a platform administrator, I want inventory views by family, organization, classification, review due, ownerless, and retirement recommended.

Acceptance criteria:

- Family views are generated from configuration, not hard-coded names

### F-ROLES: Security roles and column security

**S-RL-01 Create the 14 security roles**

As a security architect, I want least-privilege roles so that each persona has only what they need.

Acceptance criteria:

- Roles and privileges match docs/05-security.md
- No role has Delete on transactional governance tables
- Roles are assigned to teams mapped to Entra groups

**S-RL-02 Column security profiles**

As a security reviewer, I want sensitive columns protected so that only the right roles see them.

Acceptance criteria:

- Security Detail, Authorization Detail, Funding Detail, Stakeholder Contact, and Exception Justification profiles exist

**S-RL-03 Role test suite**

As a quality engineer, I want automated role tests so that privileges do not regress.

Acceptance criteria:

- Each role is tested for allowed and prohibited actions
- Requestor cannot see classification, security, or review internals

### F-SOD: Separation of duties enforcement

**S-SD-10 Integrity and separation-of-duties plug-in**

As an auditor, I want separation-of-duties rules enforced on the server so that API or flow access cannot bypass them.

Acceptance criteria:

- Requestor cannot approve or review own request
- Security reviewer cannot be the technical owner or provisioner of the same request
- Finding owner cannot be the closure approver
- Immutable fields cannot be altered
- Secret-pattern check blocks obvious secrets in text columns

### F-AUDIT: Audit and evidence configuration

**S-AU-01 Audit configuration and export procedure**

As an auditor, I want auditing configured and an export procedure documented so that evidence can be retained.

Acceptance criteria:

- Auditing is configured per docs/09-audit-reporting.md
- Export and retention procedure is documented, with gov-cloud validation items noted

### F-APP: App module and sitemap

**S-AP-01 App module and role-secured sitemap**

As a user, I want to see only the areas relevant to me so that navigation is simple.

Acceptance criteria:

- Seven areas exist per docs/07-app-design.md
- A requestor sees only My Work and New Request

**S-AP-02 Main forms for core tables**

As an internal user, I want well-organized forms so that I can work efficiently.

Acceptance criteria:

- Environment Request form has the tabs defined in docs/07-app-design.md
- Business rules show and hide fields by answer

**S-AP-03 Command bar actions**

As a user, I want guarded actions such as Submit, Record Decision, and Mark Completed so that processes are enforced.

Acceptance criteria:

- Actions are visible only to the relevant roles and statuses
- Guards show a readable failure list

**S-AP-04 Views and charts**

As a user, I want views and charts per queue so that I can see my work.

Acceptance criteria:

- Views listed in docs/07-app-design.md exist
- Charts exist for the MVP KPIs

### F-A11Y: Accessibility and usability

**S-AC-01 Accessibility verification**

As a user with assistive technology, I want the app to be keyboard and screen-reader usable.

Acceptance criteria:

- Requestor and reviewer forms pass a keyboard and screen-reader test
- Status and severity are not conveyed by color alone

### F-AUTONOTIFY: Notifications and reminders

**S-AN-01 Notification Rule engine**

As a platform administrator, I want configurable notification rules so that messages follow policy.

Acceptance criteria:

- Events, recipients, channel, and offsets come from Notification Rule
- Email works as the baseline channel

**S-AN-02 Return-for-information notification**

As a requestor, I want to be notified when a question is returned.

Acceptance criteria:

- Message includes the question and a link
- Failure creates an intake task

**S-AN-03 Overdue review escalation and reminders**

As a platform administrator, I want overdue reviews and tasks escalated so that nothing stalls.

Acceptance criteria:

- Escalation follows the Notification Rule levels
- Due offsets come from configuration

**S-AN-04 Handoff notifications**

As an owner, I want a handoff notification with the environment details.

Acceptance criteria:

- Message includes URL, support plan, and runbook links

### F-AUTOIDENT: Automation identity and monitoring

**S-AI-01 Service identity for plug-ins and flows**

As a security architect, I want automation to run under a service identity so that production is not bound to a person.

Acceptance criteria:

- Application user owns plug-in operations
- Flows use connection references bound to a service identity
- Deployment validation checks owners

**S-AI-02 Failure alerting**

As a platform administrator, I want failures alerted so that I can respond.

Acceptance criteria:

- Flow failure branches alert the platform address
- Plug-in errors are logged

### F-FINDINGS: Findings and remediation

**S-FN-01 Finding record and views**

As a security reviewer, I want findings with owner, severity, due date, plan, and closure so that remediation is tracked.

Acceptance criteria:

- All spec attributes are captured
- Closure requires a closed date and a closure approver who is not the owner
- Risk Accepted requires an approved exception

**S-FN-02 No compliance claim from absence of findings**

As an auditor, I want views that never label an environment compliant solely because it has no open findings.

Acceptance criteria:

- No compliance label is derived from open finding count
- Views show last review date and outcome

**S-FN-03 Finding reminders**

As a finding owner, I want reminders before due dates.

Acceptance criteria:

- Reminders and overdue escalation follow Notification Rule

### F-LIFECYCLE: Periodic lifecycle review

**S-LR-01 Lifecycle Review and Review Items**

As a platform administrator, I want recurring reviews that evaluate the 20 spec areas so that environments are periodically reassessed.

Acceptance criteria:

- Each cycle creates a new review and never overwrites the request
- Items are generated from a template

**S-LR-02 Lifecycle review scheduling**

As a platform administrator, I want reviews scheduled from the configured cadence.

Acceptance criteria:

- Cadence comes from the family override or Organization Configuration
- Scheduling is idempotent

**S-LR-03 Owner validation**

As a platform administrator, I want owner validity checked so that ownerless environments are found.

Acceptance criteria:

- Disabled users trigger an Ownership finding
- Ownerless view is updated

**S-LR-04 Inactive-environment review**

As a platform administrator, I want inactivity evaluated so that retirement can be recommended.

Acceptance criteria:

- MVP supports manual activity input
- Automated activity data is a gov-cloud-validate item

### F-CHANGE: Environment change requests

**S-CH-01 Environment Change Request**

As a technical owner, I want to request a change to an existing environment without altering the original intake decision.

Acceptance criteria:

- Change links to the Provisioned Environment
- A change to classification, boundary, or high-risk connector triggers re-review
- A linked review request is created when needed

### F-RETIRE: Controlled environment retirement

**S-RT-01 Retirement Request and checklist**

As a business owner, I want a controlled retirement process so that nothing is lost or left running.

Acceptance criteria:

- Checklist includes the 12 spec items
- Business, technical, and data owner approvals are captured

**S-RT-02 Retirement completion guard**

As an auditor, I want retirement blocked until retention and dependency tasks are resolved.

Acceptance criteria:

- Completion fails with unresolved required checklist items
- Environment state and inventory are updated on completion

### F-DASH: Operational dashboards

**S-DB-01 Intake, My Work, Reviews, Approvals dashboards**

As a user, I want dashboards for my role so that I see what needs attention.

Acceptance criteria:

- Dashboards listed in docs/07-app-design.md exist
- Charts respect security roles

**S-DB-02 Provisioning and Inventory dashboards**

As a platform administrator, I want inventory and provisioning dashboards.

Acceptance criteria:

- Environments by family, type, organization, and classification are charted
- Ownerless and due-for-review are listed

**S-DB-03 Governance dashboards**

As a security reviewer, I want findings, exceptions, and connector risk dashboards.

Acceptance criteria:

- Open findings by severity
- Expiring exceptions
- Connector requests by risk

### F-KPI: Advanced KPI reporting

**S-KP-01 Time-in-stage and trend reporting**

As a governance board member, I want time-in-stage and trends so that I can improve the process.

Acceptance criteria:

- K02, K15 to K22 are available
- Targets come from configuration and are not hard-coded

**S-KP-02 Scheduled governance report**

As a governance board member, I want a periodic governance report.

Acceptance criteria:

- Report is generated and distributed on a schedule
- Power BI use depends on gov-cloud validation

### F-GOVVAL: Government-cloud validation spike

**S-GV-01 Validate blocking dependencies G01 to G03 and G21**

As a solution architect, I want the blocking platform dependencies validated first so that the design is confirmed before build.

Acceptance criteria:

- Results for Dataverse, plug-ins, flows, and service principal are recorded in docs/10-alm-govcloud.md
- Any unavailable item has a decision recorded

**S-GV-02 Validate remaining dependencies G04 to G23**

As a solution architect, I want all flagged dependencies validated so that fallbacks are applied where needed.

Acceptance criteria:

- Each item has a status, date, and tester
- Gaps are added to the risk register

### F-ALM: Solution layering, source control, and pipeline

**S-AL-01 Scaffold layered solutions**

As a release manager, I want the nine solution layers scaffolded so that components go in the right place.

Acceptance criteria:

- Solutions exist with correct dependency order
- No circular dependency

**S-AL-02 CI pipeline**

As a release manager, I want CI to unpack, check, and build managed solutions.

Acceptance criteria:

- Solution checker runs
- Forbidden-literal scan runs
- Managed artifacts are built

**S-AL-03 Deployment and validation**

As a release manager, I want automated deployment to Test with a smoke test and a validation checklist.

Acceptance criteria:

- Deployment settings supply variables and connection references
- Smoke test covers submit to review generation
- Rollback steps are documented

### F-VALRULES: Validation rules implementation

**S-VR-01 Implement validation catalog BV-01 to BV-35**

As an auditor, I want the validation catalog implemented so that governance rules hold.

Acceptance criteria:

- Each BV rule has an automated test
- Server-side enforcement exists for integrity rules

### F-NFR: Nonfunctional verification

**S-NF-01 Performance and scale check**

As a platform administrator, I want views and forms to load within the organization-defined target.

Acceptance criteria:

- A test dataset is loaded
- Results are recorded against the configured target

**S-NF-02 Generalization test**

As an implementation team member, I want proof that the app works with a non-USMC configuration.

Acceptance criteria:

- A sample alternate seed runs the full smoke test
- No USMC value appears outside the seed

## 26. Implementation backlog

Epic, feature, and story hierarchy. Phase is MVP (milestone M2) or Phase 2 (milestone M3).

| Epic | Feature | Story | Phase |
|---|---|---|---|
| **E01 Foundation, Configuration, and Seed Data** | | | MVP |
| | **F-DATAMODEL Core data model** | | MVP |
| | | S-DM-01 Create publisher and Core Data Model solution | MVP |
| | | S-DM-02 Build configuration and reference tables | MVP |
| | | S-DM-03 Build request-domain tables | MVP |
| | | S-DM-04 Build review, approval, and exception tables | MVP |
| | | S-DM-05 Build provisioning, inventory, and lifecycle tables | MVP |
| | | S-DM-06 Enable auditing on governed tables | MVP |
| | **F-ORGCONFIG Organization Configuration and reference administration** | | MVP |
| | | S-OC-01 Organization Configuration record and form | MVP |
| | | S-OC-02 Environment family and type administration | MVP |
| | | S-OC-03 Classification administration | MVP |
| | | S-OC-04 Stakeholder role, review type, and license type administration | MVP |
| | **F-INTAKEOPT Intake Option configuration** | | MVP |
| | | S-IO-01 Intake Option table, form, and views | MVP |
| | | S-IO-02 Intake Option mapping validation | MVP |
| | **F-SEED USMC example seed package** | | MVP |
| | | S-SD-01 Seed package structure and upsert script | MVP |
| | | S-SD-02 USMC seed values | MVP |
| | | S-SD-03 Seed Intake Options, approval rules, and task templates | MVP |
| | **F-ENVVARS Environment variables and connection references** | | MVP |
| | | S-EV-01 Define environment variables | MVP |
| **E02 Requestor Intake and Request Management** | | | MVP |
| | **F-REQNUM Immutable request identifier** | | MVP |
| | | S-RN-01 Request number plug-in | MVP |
| | | S-RN-02 Number Sequence maintenance | MVP |
| | **F-INTAKEFORM Requestor 10-item request form** | | MVP |
| | | S-IF-01 Requestor quick-create and main form | MVP |
| | | S-IF-02 Conversational data type and capability questions | MVP |
| | | S-IF-03 Conditional prompts | MVP |
| | | S-IF-04 Workload type drives recommended family | MVP |
| | | S-IF-05 Business and technical owner capture | MVP |
| | **F-SUBMIT Submission and request lifecycle actions** | | MVP |
| | | S-SB-01 Submission validation | MVP |
| | | S-SB-02 Return for information and resubmit | MVP |
| | | S-SB-03 Withdraw and cancel | MVP |
| | | S-SB-04 Resubmission after rejection | MVP |
| | **F-STATUS Status model and business process flow** | | MVP |
| | | S-ST-01 Request status reasons | MVP |
| | | S-ST-02 Business process flow | MVP |
| | | S-ST-03 Status synchronization | MVP |
| | **F-REQENV Requested Environment and Application** | | MVP |
| | | S-RE-01 Generate requested environment stage records | MVP |
| | | S-RE-02 Application or workload record | MVP |
| | **F-HISTORY Request history and comments** | | MVP |
| | | S-HI-01 Append-only request history | MVP |
| | | S-HI-02 Comments | MVP |
| **E03 Classification, Routing, and Reviews** | | | MVP |
| | **F-CLASSDERIVE Classification derivation and intake confirmation** | | MVP |
| | | S-CD-01 Derive recommended classifications | MVP |
| | | S-CD-02 Intake confirm step | MVP |
| | | S-CD-03 Not-supported data handling | MVP |
| | **F-REVGEN Rules-driven review generation** | | MVP |
| | | S-RG-01 Review Requirement generation | MVP |
| | | S-RG-02 Governance Review records | MVP |
| | | S-RG-03 Waive a review requirement | MVP |
| | **F-PROGCORE Program Core recommendation** | | MVP |
| | | S-PC-01 Program Core indicators and recommendation | MVP |
| | | S-PC-02 Authorized reviewer decision | MVP |
| | **F-REVUI Review work queues and forms** | | MVP |
| | | S-RU-01 Review queues by type | MVP |
| **E04 Technical, Licensing, and Security Assessment** | | | MVP |
| | **F-CONNREG Connector register and DLP policy reference** | | MVP |
| | | S-CR-01 Connector register | MVP |
| | | S-CR-02 DLP policy reference | MVP |
| | **F-REQCONN Requested connectors and external integrations** | | MVP |
| | | S-RC-01 Requested Connector assessment | MVP |
| | | S-RC-02 External Integration records | MVP |
| | | S-RC-03 Connector and integration escalation flags | MVP |
| | **F-LICCAP Licensing and capacity assessment** | | MVP |
| | | S-LC-01 Licensing Requirement and License Type | MVP |
| | | S-LC-02 Capacity Estimate | MVP |
| | **F-SECREQ Security requirement and authorization boundary** | | MVP |
| | | S-SR-01 Authorization Boundary records | MVP |
| | | S-SR-02 Security Requirement record | MVP |
| | | S-SR-03 Security review requirement for sensitive data | MVP |
| | **F-SUPPORT Support and Sustainment Plan** | | MVP |
| | | S-SP-01 Structured support plan | MVP |
| | | S-SP-02 Support plan required before Production approval | MVP |
| | **F-DOCS Supporting documents and SharePoint links** | | MVP |
| | | S-DC-01 Supporting Document metadata and link | MVP |
| | | S-DC-02 SharePoint folder creation flow | MVP |
| **E05 Approvals, Decisions, and Exceptions** | | | MVP |
| | **F-ROUTING Approval routing rules** | | MVP |
| | | S-AR-01 Approval Rule evaluation | MVP |
| | | S-AR-02 Escalation flags and reasons | MVP |
| | | S-AR-03 Approval rule test dialog | MVP |
| | **F-DECISION Approval decisions** | | MVP |
| | | S-AD-01 Record a decision | MVP |
| | | S-AD-02 Decision immutability | MVP |
| | | S-AD-03 Conditional approval tracking | MVP |
| | **F-EXCEPTION Governance exceptions** | | MVP |
| | | S-EX-01 Exception record and workflow | MVP |
| | | S-EX-02 Expiring exceptions view and reminders | MVP |
| **E06 Provisioning, Validation, and Inventory** | | | MVP |
| | **F-PROVTASK Provisioning task generation and execution** | | MVP |
| | | S-PT-01 Task templates | MVP |
| | | S-PT-02 Generate tasks on approval | MVP |
| | | S-PT-03 Complete tasks with evidence | MVP |
| | | S-PT-04 Test before Production gate | MVP |
| | **F-VALID Post-provisioning validation and handoff** | | MVP |
| | | S-VL-01 Validation checklist tasks | MVP |
| | | S-VL-02 Owner handoff acceptance | MVP |
| | | S-VL-03 Completion guard | MVP |
| | **F-PROVENV Environment inventory and configuration** | | MVP |
| | | S-PE-01 Provisioned Environment record | MVP |
| | | S-PE-02 Environment Configuration items | MVP |
| | | S-PE-03 Inventory views | MVP |
| **E07 Security Model and Audit** | | | MVP |
| | **F-ROLES Security roles and column security** | | MVP |
| | | S-RL-01 Create the 14 security roles | MVP |
| | | S-RL-02 Column security profiles | MVP |
| | | S-RL-03 Role test suite | MVP |
| | **F-SOD Separation of duties enforcement** | | MVP |
| | | S-SD-10 Integrity and separation-of-duties plug-in | MVP |
| | **F-AUDIT Audit and evidence configuration** | | MVP |
| | | S-AU-01 Audit configuration and export procedure | MVP |
| **E08 Model-Driven App Experience** | | | MVP |
| | **F-APP App module and sitemap** | | MVP |
| | | S-AP-01 App module and role-secured sitemap | MVP |
| | | S-AP-02 Main forms for core tables | MVP |
| | | S-AP-03 Command bar actions | MVP |
| | | S-AP-04 Views and charts | MVP |
| | **F-A11Y Accessibility and usability** | | MVP |
| | | S-AC-01 Accessibility verification | MVP |
| **E09 Automation** | | | MVP |
| | **F-AUTONOTIFY Notifications and reminders** | | MVP |
| | | S-AN-01 Notification Rule engine | MVP |
| | | S-AN-02 Return-for-information notification | MVP |
| | | S-AN-03 Overdue review escalation and reminders | MVP |
| | | S-AN-04 Handoff notifications | MVP |
| | **F-AUTOIDENT Automation identity and monitoring** | | MVP |
| | | S-AI-01 Service identity for plug-ins and flows | MVP |
| | | S-AI-02 Failure alerting | MVP |
| **E10 Findings, Lifecycle Review, Change, and Retirement** | | | Phase 2 |
| | **F-FINDINGS Findings and remediation** | | MVP |
| | | S-FN-01 Finding record and views | MVP |
| | | S-FN-02 No compliance claim from absence of findings | MVP |
| | | S-FN-03 Finding reminders | MVP |
| | **F-LIFECYCLE Periodic lifecycle review** | | Phase 2 |
| | | S-LR-01 Lifecycle Review and Review Items | Phase 2 |
| | | S-LR-02 Lifecycle review scheduling | Phase 2 |
| | | S-LR-03 Owner validation | Phase 2 |
| | | S-LR-04 Inactive-environment review | Phase 2 |
| | **F-CHANGE Environment change requests** | | Phase 2 |
| | | S-CH-01 Environment Change Request | Phase 2 |
| | **F-RETIRE Controlled environment retirement** | | Phase 2 |
| | | S-RT-01 Retirement Request and checklist | Phase 2 |
| | | S-RT-02 Retirement completion guard | Phase 2 |
| **E11 Reporting and Dashboards** | | | MVP |
| | **F-DASH Operational dashboards** | | MVP |
| | | S-DB-01 Intake, My Work, Reviews, Approvals dashboards | MVP |
| | | S-DB-02 Provisioning and Inventory dashboards | MVP |
| | | S-DB-03 Governance dashboards | MVP |
| | **F-KPI Advanced KPI reporting** | | Phase 2 |
| | | S-KP-01 Time-in-stage and trend reporting | Phase 2 |
| | | S-KP-02 Scheduled governance report | Phase 2 |
| **E12 ALM, Quality, and Government-Cloud Validation** | | | MVP |
| | **F-GOVVAL Government-cloud validation spike** | | MVP |
| | | S-GV-01 Validate blocking dependencies G01 to G03 and G21 | MVP |
| | | S-GV-02 Validate remaining dependencies G04 to G23 | MVP |
| | **F-ALM Solution layering, source control, and pipeline** | | MVP |
| | | S-AL-01 Scaffold layered solutions | MVP |
| | | S-AL-02 CI pipeline | MVP |
| | | S-AL-03 Deployment and validation | MVP |
| | **F-VALRULES Validation rules implementation** | | MVP |
| | | S-VR-01 Implement validation catalog BV-01 to BV-35 | MVP |
| | **F-NFR Nonfunctional verification** | | MVP |
| | | S-NF-01 Performance and scale check | MVP |
| | | S-NF-02 Generalization test | MVP |

Totals: 12 epics, 44 features, 114 stories.

## 27. Traceability matrix

Maps governance requirements from the source specification to application features, the design documents, and functional requirements.

| Req | Governance requirement | Design docs | Features | Stories |
|---|---|---|---|---|
| GR-01 | Federated operating model with delegation and escalation | [05](05-security.md) | F-ROUTING | S-AR-01, S-AR-02, S-AR-03 |
| GR-02 | Generalization: no hard-coded organization values | [01](01-overview.md), [04](04-data-model/config-reference.md) | F-ORGCONFIG, F-INTAKEOPT, F-SEED | S-OC-01, S-OC-02, S-OC-03, S-OC-04, S-IO-01, S-IO-02, S-SD-01, S-SD-02, S-SD-03 |
| GR-03 | Organization Configuration record | [04](04-data-model/config-reference.md) | F-ORGCONFIG | S-OC-01, S-OC-02, S-OC-03, S-OC-04 |
| GR-04 | USMC defaults as seed configuration | [04](04-data-model/config-reference.md), [10](10-alm-govcloud.md) | F-SEED | S-SD-01, S-SD-02, S-SD-03 |
| GR-05 | Identify features requiring government-cloud validation | [10](10-alm-govcloud.md) | F-GOVVAL | S-GV-01, S-GV-02 |
| GR-06 | Normalized request information with a simple requestor intake | [03a](03a-requestor-intake.md) | F-INTAKEOPT, F-INTAKEFORM | S-IO-01, S-IO-02, S-IF-01, S-IF-02, S-IF-03, S-IF-04, S-IF-05 |
| GR-07 | Request separate from Environment; environment sets | [04](04-data-model/README.md) | F-REQENV, F-PROVENV | S-RE-01, S-RE-02, S-PE-01, S-PE-02, S-PE-03 |
| GR-08 | Environment changes through linked change requests | [04](04-data-model/provisioning-lifecycle.md) | F-CHANGE | S-CH-01 |
| GR-09 | Rules-based Program Core recommendation with human decision | [06](06-rules.md) | F-PROGCORE | S-PC-01, S-PC-02 |
| GR-10 | Application and data classification, most restrictive controls | [03a](03a-requestor-intake.md), [06](06-rules.md) | F-CLASSDERIVE | S-CD-01, S-CD-02, S-CD-03 |
| GR-11 | No automatic approval or rejection based on classification | [06](06-rules.md) | F-CLASSDERIVE, F-ROUTING | S-CD-01, S-CD-02, S-CD-03, S-AR-01, S-AR-02, S-AR-03 |
| GR-12 | Normalized Dataverse data model | [04](04-data-model/README.md) | F-DATAMODEL | S-DM-01, S-DM-02, S-DM-03, S-DM-04, S-DM-05, S-DM-06 |
| GR-13 | Immutable request identifier | [04](04-data-model/request.md), [08](08-automation.md) | F-REQNUM | S-RN-01, S-RN-02 |
| GR-14 | Request status model | [03](03-process.md) | F-SUBMIT, F-STATUS | S-SB-01, S-SB-02, S-SB-03, S-SB-04, S-ST-01, S-ST-02, S-ST-03 |
| GR-15 | Business process flow | [03](03-process.md) | F-STATUS | S-ST-01, S-ST-02, S-ST-03 |
| GR-16 | Configurable required reviews | [06](06-rules.md) | F-REVGEN | S-RG-01, S-RG-02, S-RG-03 |
| GR-17 | Configurable approval routing and decisions | [05](05-security.md) | F-ROUTING, F-DECISION, F-EXCEPTION | S-AR-01, S-AR-02, S-AR-03, S-AD-01, S-AD-02, S-AD-03, S-EX-01, S-EX-02 |
| GR-18 | Connector and integration model | [06](06-rules.md) | F-CONNREG, F-REQCONN | S-CR-01, S-CR-02, S-RC-01, S-RC-02, S-RC-03 |
| GR-19 | Licensing and capacity | [04](04-data-model/request.md) | F-LICCAP | S-LC-01, S-LC-02 |
| GR-20 | Security and authorization capture, no secrets | [04](04-data-model/request.md) | F-SECREQ | S-SR-01, S-SR-02, S-SR-03 |
| GR-21 | Support and sustainment plan | [04](04-data-model/request.md) | F-SUPPORT | S-SP-01, S-SP-02 |
| GR-22 | SharePoint document integration | [09](09-audit-reporting.md) | F-DOCS | S-DC-01, S-DC-02 |
| GR-23 | Provisioning tasks, manual then API | [04](04-data-model/provisioning-lifecycle.md) | F-PROVTASK, F-PROVENV | S-PT-01, S-PT-02, S-PT-03, S-PT-04, S-PE-01, S-PE-02, S-PE-03 |
| GR-24 | Post-provisioning validation | [03](03-process.md), [04](04-data-model/provisioning-lifecycle.md) | F-VALID | S-VL-01, S-VL-02, S-VL-03 |
| GR-25 | Periodic lifecycle review | [04](04-data-model/provisioning-lifecycle.md) | F-LIFECYCLE | S-LR-01, S-LR-02, S-LR-03, S-LR-04 |
| GR-26 | Findings and remediation | [04](04-data-model/provisioning-lifecycle.md) | F-FINDINGS | S-FN-01, S-FN-02, S-FN-03 |
| GR-27 | Controlled retirement | [04](04-data-model/provisioning-lifecycle.md) | F-RETIRE | S-RT-01, S-RT-02 |
| GR-28 | Security roles, least privilege, separation of duties | [05](05-security.md) | F-ROLES, F-SOD | S-RL-01, S-RL-02, S-RL-03, S-SD-10 |
| GR-29 | Model-driven app sitemap, forms, and views | [07](07-app-design.md) | F-REVUI, F-APP | S-RU-01, S-AP-01, S-AP-02, S-AP-03, S-AP-04 |
| GR-30 | Automation without personal accounts | [08](08-automation.md) | F-AUTONOTIFY, F-AUTOIDENT | S-AN-01, S-AN-02, S-AN-03, S-AN-04, S-AI-01, S-AI-02 |
| GR-31 | Business rules and validation | [06](06-rules.md) | F-VALRULES | S-VR-01 |
| GR-32 | Reporting and dashboards | [09](09-audit-reporting.md) | F-DASH, F-KPI | S-DB-01, S-DB-02, S-DB-03, S-KP-01, S-KP-02 |
| GR-33 | Nonfunctional requirements | [02](02-requirements.md) | F-A11Y, F-NFR | S-AC-01, S-NF-01, S-NF-02 |
| GR-34 | ALM and solution architecture | [10](10-alm-govcloud.md) | F-ENVVARS, F-ALM | S-EV-01, S-AL-01, S-AL-02, S-AL-03 |
| GR-35 | Audit and evidence | [09](09-audit-reporting.md) | F-HISTORY, F-AUDIT | S-HI-01, S-HI-02, S-AU-01 |

<!-- END GENERATED -->
