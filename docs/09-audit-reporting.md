# 09. Audit, Evidence, and Reporting

Covers deliverables 18 (audit and evidence model) and 19 (reporting and KPI model).

## 18. Audit and evidence model

### Evidence layers

| Layer | What it holds | Mechanism | Tamper resistance |
|---|---|---|---|
| Dataverse auditing | Create, update, delete, and access of governed records and columns, who and when, old and new values | Table and column auditing enabled in the solution | System-managed. Read by Auditor role. Export procedure documented |
| Request History Entry | Business-readable timeline: status changes, comments, decisions, returns, assignments, document additions, automation actions | Append-only table. Create only. No update or delete privilege for any role | Role design plus plug-in blocking update and delete |
| Approval Decision | Immutable decision records with authority, approver, rationale, conditions, expiry | Append-only with supersede link | Plug-in and role design |
| Supporting Document | Metadata and link to evidence in SharePoint | Dataverse record plus SharePoint library | SharePoint versioning and retention labels (**GCV** for specific features) |
| Review, Finding, Exception, Task records | Their own status, reviewer, decision, completion date, evidence | Governed tables with auditing | Auditing and role design |

### Audit configuration

| Item | Recommendation |
|---|---|
| Table-level auditing | On for all transactional, configuration, and history tables |
| Column-level auditing | On for classification, status, family, decision, authority, owner, flags, expiration, outcome, severity, approval status, risk level, rule definitions, and configuration values. Off for large memo columns that are not governance-relevant (reduces volume) |
| Read auditing | Consider for Security Requirement and Authorization Boundary detail. Validate availability and volume in the target environment (**GCV**) |
| Retention of audit logs | Per the organization's records-retention policy referenced in Organization Configuration. Do not invent a period. Dataverse long-term retention features need validation (**GCV**) |
| Export | Documented procedure for exporting audit data to the organization's log repository. Mechanism to be validated |

### Evidence by lifecycle event

| Event | Evidence recorded |
|---|---|
| Request submitted | Request record (10 items), history entry, audit |
| Intake confirmation | Confirmed classifications and family, triage notes (if changed from recommendation), history, audit |
| Review generated | Review Requirement with basis and rule, history |
| Review completed | Governance Review outcome, rationale, conditions, findings, reviewer, completion date, supporting documents |
| Decision | Approval Decision, escalation snapshot, approver, authority, rationale, conditions, expiry, evidence links |
| Exception | Governance Exception, justification, compensating controls, approver decision, expiry, renewals |
| Provisioning | Provisioning Tasks with completion, result, evidence links |
| Validation and handoff | Validation task results, evidence, owner acceptance |
| Configuration | Environment Configuration items with expected and verified values |
| Lifecycle review | Lifecycle Review and Items, findings |
| Change | Environment Change Request, linked review request, decision |
| Retirement | Retirement Request, approvals, checklist, completion evidence |

### SharePoint integration

| Item | Design |
|---|---|
| Approach | Store evidence in SharePoint. Dataverse stores metadata, status, relationships, and the link in Supporting Document. Dataverse is not the primary document repository |
| Structure | One library for the application. Folder per request number and per environment. Document type as a column. Permissions follow the request role teams through SharePoint groups (decision D12) |
| Integration options | (a) Native Dataverse SharePoint document management on selected tables. (b) Link-based Supporting Document records plus a flow that creates the folder. MVP uses (b), which does not depend on (a) |
| Handling markings | `ppg_handlingmarking` captures the marking. SharePoint labels or retention labels are applied by the organization (**GCV**) |
| Evidence integrity | Document version in metadata. SharePoint versioning enabled. Retention label per policy |
| Gov cloud | SharePoint Online availability and the Dataverse-SharePoint integration are validated per target cloud (**GCV**) |

### Retention considerations (summary)

Retention is governed by the policy referenced in Organization Configuration. The organization must define the following (decision D7):

| Record class | Retention decision needed |
|---|---|
| Requests, decisions, exceptions, reviews | Retention period and disposition |
| Audit logs | Period, storage, and export |
| Request history | Same as the request |
| Provisioned Environment records | Retain after retirement. Period |
| Documents | Per SharePoint retention label |
| Configuration history | Period |

Dataverse records are deactivated, not deleted, so evidence stays. Archival or deletion at end of retention is an administrative procedure to be documented.

## 19. Reporting and KPI model

Targets and thresholds are not set here. The implementing organization configures service-level targets and review cadences (decision D4). Each KPI below is a measurement, and targets are configuration.

### KPI catalog

| # | KPI or report | Definition | Source tables | Dimensions | Needs organization target |
|---|---|---|---|---|---|
| K01 | Requests by stage | Count of active requests by BPF stage | Environment Request | Stage, family, organization | No |
| K02 | Average time in each stage | Mean time between stage entry and exit | Request History (status and stage changes) | Stage, family, organization | Yes (target) |
| K03 | Requests awaiting action | Active requests with an open action, by action owner | Request, Review, Task | Owner team, action type | No |
| K04 | Requests returned for information | Count and age of requests in Returned for Information | Request | Organization, reason | Yes (response period) |
| K05 | Approval outcomes | Counts of Approve, Approve with Conditions, Reject, Return, Withdraw, Cancel | Approval Decision | Authority, family, organization, month | No |
| K06 | Provisioning backlog | Approved requests and open tasks not complete | Provisioning Task, Requested Environment | Family, type, assignee | Yes |
| K07 | Environments by family and type | Count of active environments | Provisioned Environment | Family, type | No |
| K08 | Environments by organization | Count | Provisioned Environment | Organization, program | No |
| K09 | Environments by classification | Count | Provisioned Environment | Application and data classification | No |
| K10 | Environments due for review | Next Review Due within window or overdue | Provisioned Environment | Family, organization | Yes (window) |
| K11 | Ownerless environments | Environments with a vacant required owner role | Stakeholder Assignment, Environment | Organization | No |
| K12 | Expiring exceptions | Exceptions expiring within window and expired | Governance Exception | Type, organization | Yes (window) |
| K13 | Open findings by severity | Open findings by severity and age | Finding | Severity, source, owner | Yes (due periods) |
| K14 | Connector requests by risk | Requested Connectors by risk, type, and decision | Requested Connector, Connector | Risk, type, decision | No |
| K15 | Licensing demand | Requested users by role and license type, premium demand | Licensing Requirement | License type, organization | No |
| K16 | Capacity demand | Database, file, and log capacity requested vs allocated | Capacity Estimate | Organization, environment | No |
| K17 | Environment retirement activity | Retirement requests by status and reason, recommended but not yet requested | Retirement Request, Lifecycle Review | Reason, family | Yes |
| K18 | Review turnaround | Review start to completion by type | Governance Review | Type | Yes (target) |
| K19 | Overdue reviews | Reviews past due date | Governance Review | Type, reviewer team | Yes (due offset) |
| K20 | Escalation rate | Share of requests with escalation reasons, by trigger | Request, Review Requirement | Trigger | No |
| K21 | Intake derivation accuracy | Share of requests where confirmed classification or family differs from the recommendation | Request, History | Option, reason | No. Supports tuning of Intake Option mappings |
| K22 | Unknown-answer rate | Share of requests with "I don't know", "Not sure", or "Unknown" answers | Request, Intake Option | Question | No. Supports question wording |

K21 and K22 measure the effect of the simplified requestor intake and guide improvements to answer wording and mappings.

### Compliance reporting caution

A report must not state that an environment is compliant solely because it has no open findings. Environment views show "No open findings" as a statement of record state, along with last lifecycle review date and outcome and the count of assessed review areas, not a compliance label.

### Delivery approach

| Phase | Reporting |
|---|---|
| MVP | Native Dataverse views, charts, and dashboards for K01, K03 to K05, K06 to K14 where simple, K18, K19. History-based time metrics (K02) via a calculated view or export |
| Later | Power BI or Excel reports for trends and time-in-stage (K02), K15, K16, K17, K20 to K22, scheduled governance report (A19). Availability of Power BI in the target cloud is validated (**GCV**) |
| Time-in-stage | Requires reliable stage-change history. Request History Entry stores status and stage change events with timestamps |
