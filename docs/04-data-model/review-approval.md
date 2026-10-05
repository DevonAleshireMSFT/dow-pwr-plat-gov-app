# Review, Approval, and Exception Tables

Tables 19, 20, 21, 22. All **user or team owned**. Conventions are in [README.md](README.md).

Design notes:
- Each review has its own status, reviewer, decision, conditions, findings, and completion date. Request status does not substitute for review status.
- Reviews are generated only after intake confirms the data classification, application classification, and family ([../03a-requestor-intake.md](../03a-requestor-intake.md)).
- Separation of duties is enforced by a pre-operation plug-in: a reviewer or approver cannot be the request's requestor, and a security reviewer cannot approve their own implementation.

---

## 20. Review Requirement (`ppg_reviewrequirement`)

| Property | Value |
|---|---|
| Purpose | Records that a review of a given type is required for a request, why, and by which rule or intake option. Created by rule evaluation. Not every request has every review. |
| Primary name | `ppg_name` (Text 200), system-built |
| Alternate keys | `ppg_requestid` + `ppg_reviewtypeid` + `ppg_basisid` (prevents duplicates) |
| Audit | Yes. Removal of a requirement must be traceable |
| Retention | With the request |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup (Environment Request) | B | |
| Review Type | `ppg_reviewtypeid` | Lookup (Review Type) | B | |
| Basis | `ppg_basis` | Choice | B | Approval Rule, Intake Option, Manual Addition, Escalation |
| Approval Rule | `ppg_approvalruleid` | Lookup (Approval Rule) | | |
| Intake Option | `ppg_intakeoptionid` | Lookup (Intake Option) | | |
| Reason | `ppg_reason` | Memo (1000) | | Plain-language explanation of why it is required |
| Requirement Status | `statuscode` | Status Reason | B | Required, Waived, Satisfied, Withdrawn |
| Waived By | `ppg_waivedbyid` | Lookup (User) | | |
| Waiver Rationale | `ppg_waiverrationale` | Memo (2000) | | Required when Waived. Only an authorized role may waive. Mandatory reviews triggered by escalation cannot be waived by intake |
| Satisfied By Review | `ppg_satisfiedbyreviewid` | Lookup (Governance Review) | | |

---

## 19. Governance Review (`ppg_governancereview`)

| Property | Value |
|---|---|
| Purpose | One review activity of a given type (governance, security, licensing and capacity, connector and DLP, command or program). |
| Primary name | `ppg_name` (Text 200), system-built |
| Audit | Yes, all columns |
| Retention | With the request. Evidence retained per policy |
| Sensitive columns | `ppg_findingssummary` and `ppg_conditions` for Security reviews. **CS** profile |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Review Type | `ppg_reviewtypeid` | Lookup (Review Type) | B | |
| Review Requirement | `ppg_reviewrequirementid` | Lookup (Review Requirement) | B | |
| Requested Environment | `ppg_requestedenvironmentid` | Lookup | | Null means whole request |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | Cannot equal the requestor |
| Reviewer Team | `ppg_reviewerteamid` | Lookup (Team) | | Queue owner |
| Review Status | `statuscode` | Status Reason | B | Not Started, In Progress, Waiting on Requestor, Complete, Cancelled |
| Outcome | `ppg_outcome` | Choice | | Satisfactory, Satisfactory with Conditions, Unsatisfactory, Escalate, Return for Information |
| Recommendation | `ppg_recommendation` | Choice | | Approve, Approve with Conditions, Reject, Escalate |
| Conditions | `ppg_conditions` | Memo (4000) | | Required when outcome has conditions |
| Findings Summary | `ppg_findingssummary` | Memo (4000) | | Detail lives in Finding records |
| Rationale | `ppg_rationale` | Memo (4000) | | Required for Unsatisfactory, Escalate, Return |
| Due Date | `ppg_duedate` | Date Only | | From Review Type offset. Value set by the organization |
| Started On | `ppg_startedon` | Date and Time | | |
| Completed On | `ppg_completedon` | Date and Time | | Required when Complete |
| Is Escalated | `ppg_isescalated` | Yes/No | | |

Relationships: N:1 Request, Review Type, Review Requirement. 1:N Finding, Supporting Document. Referenced by Approval Decision.

---

## 21. Approval Decision (`ppg_approvaldecision`)

| Property | Value |
|---|---|
| Purpose | A recorded decision on a request by a decision authority. Append-only. A new decision supersedes but never overwrites an earlier one. |
| Category | Transactional with audit/history character |
| Primary name | `ppg_name` (Text 200), system-built |
| Privileges | Create by authorized approver. No update or delete after creation except `ppg_conditionstatus` and `ppg_supersededbyid` by system. |
| Audit | Yes, all columns |
| Retention | Permanent with the request. These are key audit evidence |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Decision | `ppg_decision` | Choice | B | Approve, Approve with Conditions, Reject, Return for Information, Withdraw, Cancel |
| Decision Authority | `ppg_authoritytype` | Choice | B | Delegated Platform Authority, Governance Board, Security Authority, Other |
| Decision Authority Team | `ppg_authorityteamid` | Lookup (Team) | | |
| Approver | `ppg_approverid` | Lookup (User) | B | Cannot be the requestor. Plug-in enforced |
| Decision Date | `ppg_decisiondate` | Date and Time | B | |
| Rationale | `ppg_rationale` | Memo (4000) | B for Reject, Return, Cancel, Withdraw | |
| Conditions | `ppg_conditions` | Memo (4000) | B for Approve with Conditions | |
| Condition Review Date | `ppg_conditionreviewdate` | Date Only | | Review or expiration date required for conditional approvals |
| Expiration Date | `ppg_expirationdate` | Date Only | | Required for conditional approvals and exception-based approvals |
| Condition Status | `ppg_conditionstatus` | Choice | | Open, Met, Expired, Waived |
| Related Review | `ppg_reviewid` | Lookup (Governance Review) | | |
| Related Exception | `ppg_exceptionid` | Lookup (Governance Exception) | | |
| Return To Stage | `ppg_returntostage` | Choice | | For Return for Information. Names the stage the request returns to |
| Evidence References | N:1 from Supporting Document | | | Documents link to the decision |
| Superseded By | `ppg_supersededbyid` | Lookup (Approval Decision, self) | | |
| Escalation Reasons | `ppg_escalationreasons` | Choices | | Snapshot of the reasons present when decided |

---

## 22. Governance Exception (`ppg_governanceexception`)

| Property | Value |
|---|---|
| Purpose | A time-bound exception to a standard, policy, or guardrail (for example DLP exception, enterprise architecture exception, break-glass, service-account exception). |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes, all columns |
| Retention | Permanent with the request. Keep after expiry as evidence |
| Sensitive columns | `ppg_justification` and `ppg_compensatingcontrols` for security exceptions. **CS** |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Exception Number | `ppg_exceptionnumber` | Text (30) | B | Immutable, generated like the request number |
| Request | `ppg_requestid` | Lookup | | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | | Exceptions can persist beyond the originating request |
| Exception Type | `ppg_exceptiontype` | Choice | B | DLP, Connector, Enterprise Architecture, Security or Authorization, Break-Glass, Service Account, Naming, Other |
| Requested Connector | `ppg_requestedconnectorid` | Lookup | | |
| Justification | `ppg_justification` | Memo (4000) | B | |
| Compensating Controls | `ppg_compensatingcontrols` | Memo (4000) | | |
| Risk Acceptance Owner | `ppg_riskownerid` | Lookup (User) | | |
| Status | `statuscode` | Status Reason | B | Requested, Under Review, Approved, Rejected, Expired, Revoked, Closed |
| Approved Decision | `ppg_decisionid` | Lookup (Approval Decision) | | |
| Effective Date | `ppg_effectivedate` | Date Only | | |
| Expiration Date | `ppg_expirationdate` | Date Only | B when Approved | Drives the expiring-exceptions view and reminders |
| Renewal Count | `ppg_renewalcount` | Whole Number | | |
| Last Reviewed On | `ppg_lastreviewedon` | Date Only | | |
