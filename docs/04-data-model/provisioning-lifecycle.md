# Provisioning, Inventory, and Lifecycle Tables

Tables 3, 23, 24, 26, 27, 28, 29, 30, 43. All **user or team owned**. Conventions are in [README.md](README.md).

---

## 3. Provisioned Environment (`ppg_provisionedenvironment`)

| Property | Value |
|---|---|
| Purpose | The inventory record of an actual environment. Created at provisioning. Persists after the request completes. |
| Primary name | `ppg_name` (Text 200), the actual environment display name |
| Alternate keys | `ppg_environmentid` (platform environment ID) |
| Audit | Yes, all columns |
| Retention | Permanent inventory record, including after retirement, per policy |
| Sensitive columns | `ppg_environmenturl` is not secret but is operational. Tenant IDs. Limit with table scope |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Environment Name | `ppg_name` | Text (200) | B | |
| Originating Request | `ppg_requestid` | Lookup (Environment Request) | B | |
| Requested Environment | `ppg_requestedenvironmentid` | Lookup (Requested Environment) | | |
| Environment ID | `ppg_environmentid` | Text (100) | B | Platform identifier. Alternate key |
| Environment URL | `ppg_environmenturl` | Text (URL, 500) | B | |
| Environment Family | `ppg_familyid` | Lookup (Environment Family) | B | |
| Environment Type | `ppg_typeid` | Lookup (Environment Type) | B | |
| Organization | `ppg_organizationid` | Lookup | B | |
| Program or Command | `ppg_programid` | Lookup | | |
| Application | `ppg_applicationid` | Lookup | | |
| Application Classification | `ppg_appclassificationid` | Lookup | B | Confirmed value at provisioning |
| Data Classification | `ppg_dataclassificationid` | Lookup | B | Confirmed value at provisioning |
| Region | `ppg_region` | Text (100) | B | **GCV** |
| Cloud Boundary | `ppg_cloudboundary` | Text (200) | B | |
| DLP Policy | `ppg_dlppolicyid` | Lookup (DLP Policy) | | |
| Authorization Boundary | `ppg_authorizationboundaryid` | Lookup | | |
| Support Plan | `ppg_supportplanid` | Lookup (Support Plan) | | |
| Business Owner / Technical Owner / Data Owner / Support Owner | via Stakeholder Assignment | | | Current owners. Ownerless is a view |
| Is Managed Environment | `ppg_ismanaged` | Yes/No | | **GCV** |
| Lifecycle State | `statuscode` | Status Reason | B | Provisioning, Active, Under Review, Retirement Recommended, Retiring, Retired |
| Provisioned On | `ppg_provisionedon` | Date and Time | | |
| Handoff Accepted On | `ppg_handoffon` | Date and Time | | |
| Next Review Due | `ppg_nextreviewdue` | Date Only | | From cadence |
| Last Reviewed On | `ppg_lastreviewedon` | Date Only | | |
| Expected End Date | `ppg_expectedenddate` | Date Only | | Carried from the request duration |
| Retirement Recommended | `ppg_retirementrecommended` | Yes/No | | Set by lifecycle review |

Relationships: N:1 Request, Requested Environment, Family, Type, Organization, Application, DLP Policy, Authorization Boundary, Support Plan. 1:N Environment Configuration, Provisioning Task, Lifecycle Review, Finding, Environment Change Request, Retirement Request, Governance Exception, Stakeholder Assignment, Supporting Document.

---

## 23. Provisioning Task (`ppg_provisioningtask`)

| Property | Value |
|---|---|
| Purpose | One required activity for provisioning, configuration, validation, or handoff. Generated from templates after approval. Manual first, API-ready. |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Retention | With the request. Evidence retained |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Requested Environment | `ppg_requestedenvironmentid` | Lookup | B | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | | |
| Template | `ppg_templateid` | Lookup (Provisioning Task Template) | | |
| Task Category | `ppg_taskcategory` | Choice | B | Provisioning, Configuration, Validation, Handoff |
| Sequence | `ppg_sequence` | Whole Number | B | |
| Execution Mode | `ppg_executionmode` | Choice | B | Manual, Automated, Hybrid |
| Automation Dependency | `ppg_automationdependency` | Text (300) | | **GCV** |
| Status | `statuscode` | Status Reason | B | Not Started, In Progress, Blocked, Complete, Failed, Not Applicable |
| Result | `ppg_result` | Choice | | Pass, Fail, Accepted with Exception, Not Applicable (validation tasks) |
| Assigned To | `ppg_assignedtoid` | Lookup (User) | | |
| Assigned Team | `ppg_assignedteamid` | Lookup (Team) | | |
| Due Date | `ppg_duedate` | Date Only | | Value set by the organization |
| Completed On | `ppg_completedon` | Date and Time | | |
| Completed By | `ppg_completedbyid` | Lookup (User) | | |
| Evidence Required | `ppg_evidencerequired` | Yes/No | | |
| Gated By Test Validation | `ppg_gatedbytest` | Yes/No | | Production tasks wait for Test validation |
| Notes | `ppg_notes` | Memo (2000) | | No secrets |

The post-provisioning validation checklist (18 checks) is a set of Validation-category tasks generated from templates.

---

## 24. Environment Configuration (`ppg_environmentconfiguration`)

| Property | Value |
|---|---|
| Purpose | A recorded configuration item or setting of an environment (security group, administrator groups, DLP assignment, managed environment settings, audit settings, language and currency, pipeline association, service principal reference, environment variables and connection reference expectations). |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Sensitive columns | `ppg_valuereference`. Names and identifiers only, never secrets. **CS** |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | B | |
| Configuration Type | `ppg_configtype` | Choice | B | Security Group, Administrator Group, DLP Policy, Managed Environment, Auditing, Dataverse Settings, Language Currency Region, Capacity, Pipeline Association, Environment Variable, Connection Reference, Service Principal, Backup, Other |
| Expected Value | `ppg_expectedvalue` | Text (500) | | |
| Actual Value (reference) | `ppg_valuereference` | Text (500) | | Identifier or name only |
| Verification Status | `ppg_verificationstatus` | Choice | | Not Verified, Verified, Drift Detected, Not Applicable |
| Verified On | `ppg_verifiedon` | Date and Time | | |
| Verified By | `ppg_verifiedbyid` | Lookup (User) | | |
| Source Task | `ppg_taskid` | Lookup (Provisioning Task) | | |

---

## 26. Lifecycle Review (`ppg_lifecyclereview`)

| Property | Value |
|---|---|
| Purpose | A recurring periodic review of a Provisioned Environment. A new record each cycle. The original request is never overwritten. |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Retention | Retain all cycles |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | B | |
| Review Cycle | `ppg_cycle` | Text (50) | | |
| Scheduled Date | `ppg_scheduleddate` | Date Only | B | From cadence |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | |
| Status | `statuscode` | Status Reason | B | Scheduled, In Progress, Complete, Overdue, Cancelled |
| Overall Outcome | `ppg_outcome` | Choice | | Continue, Continue with Actions, Retirement Recommended, Escalate |
| Retirement Recommendation | `ppg_retirementrecommended` | Yes/No | | |
| Summary | `ppg_summary` | Memo (4000) | | |
| Completed On | `ppg_completedon` | Date and Time | | |
| Open Findings at Review | `ppg_openfindings` | Whole Number | | Snapshot. Not a compliance statement |

---

## 43. Lifecycle Review Item (`ppg_lifecyclereviewitem`) (supplemental)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Lifecycle Review | `ppg_lifecyclereviewid` | Lookup | B | |
| Review Area | `ppg_area` | Choice | B | Business Owner Validity, Technical Owner Validity, Support Owner Validity, Continued Need, Environment Activity, App and Flow Activity, Orphaned Resources, DLP Compliance, Connector Usage, Licensing, Database Capacity, File Capacity, Log Capacity, Security Group Membership, Privileged Access, Service Principal Ownership, Support Readiness, Recovery Readiness, Authorization Status, Open Findings, Continued Need for Exceptions, Retirement Recommendation |
| Result | `ppg_result` | Choice | B | Satisfactory, Needs Action, Not Assessed, Not Applicable |
| Evidence Source | `ppg_evidencesource` | Choice | | Manual, Admin Center, Telemetry, Inventory Sync. Automated sources **GCV** |
| Notes | `ppg_notes` | Memo (2000) | | |
| Finding | `ppg_findingid` | Lookup (Finding) | | Created when Needs Action |

Note: a result of Satisfactory on every item is not stated as compliance. The review records what was assessed.

---

## 27. Finding or Remediation Action (`ppg_finding`)

| Property | Value |
|---|---|
| Purpose | A finding and its remediation action from any source (security review, lifecycle review, provisioning validation, audit). |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Retention | Permanent evidence |
| Sensitive columns | `ppg_description` for security findings. **CS** |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Finding Type | `ppg_findingtype` | Choice | B | Security, Authorization, DLP, Connector, Licensing, Capacity, Ownership, Support, Recovery, Configuration, Activity, Other |
| Severity | `ppg_severity` | Choice | B | Critical, High, Moderate, Low, Informational |
| Source | `ppg_source` | Choice | B | Governance Review, Lifecycle Review, Provisioning Validation, Audit, Manual |
| Description | `ppg_description` | Memo (4000) | B | |
| Request | `ppg_requestid` | Lookup | | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | | At least one of Request or Environment |
| Governance Review | `ppg_reviewid` | Lookup | | |
| Lifecycle Review | `ppg_lifecyclereviewid` | Lookup | | |
| Owner | `ppg_ownerid` | Lookup (User) | B | |
| Due Date | `ppg_duedate` | Date Only | B | |
| Status | `statuscode` | Status Reason | B | Open, In Progress, Pending Verification, Closed, Risk Accepted |
| Remediation Plan | `ppg_remediationplan` | Memo (4000) | | |
| Closed On | `ppg_closedon` | Date and Time | | Required when Closed |
| Closure Approver | `ppg_closureapproverid` | Lookup (User) | B when Closed | Not the finding owner. Plug-in enforced |
| Related Exception | `ppg_exceptionid` | Lookup | | Required when Risk Accepted |

Evidence links come from Supporting Document records.

---

## 28. Environment Change Request (`ppg_environmentchangerequest`)

| Property | Value |
|---|---|
| Purpose | A change to an existing Provisioned Environment, processed without overwriting the original intake decision. |
| Primary name | `ppg_name` (Text 200) |
| Alternate keys | `ppg_changenumber` |
| Audit | Yes |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Change Number | `ppg_changenumber` | Text (30) | B | Immutable |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | B | |
| Change Type | `ppg_changetype` | Choice | B | Add Connector, Change Classification, Add Integration, Capacity Change, Owner Change, Add Stage, Change Boundary, Configuration Change, Other |
| Description | `ppg_description` | Memo (4000) | B | |
| Requested By | `ppg_requestedbyid` | Lookup (User) | B | |
| Review Request | `ppg_reviewrequestid` | Lookup (Environment Request) | | A linked request of type Change when the change needs reviews and approval |
| Triggers Re-Review | `ppg_triggersrereview` | Yes/No | | System from rules. A change to classification, boundary, or high-risk connector triggers re-review |
| Status | `statuscode` | Status Reason | B | Draft, Submitted, In Review, Approved, Rejected, Implemented, Cancelled |
| Implemented On | `ppg_implementedon` | Date and Time | | |

---

## 29. Retirement Request (`ppg_retirementrequest`)

| Property | Value |
|---|---|
| Purpose | Controlled retirement of a Provisioned Environment. |
| Primary name | `ppg_name` (Text 200) |
| Alternate keys | `ppg_retirementnumber` |
| Audit | Yes |
| Retention | Permanent evidence |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Retirement Number | `ppg_retirementnumber` | Text (30) | B | Immutable |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | B | |
| Retirement Reason | `ppg_reason` | Choice | B | End of Need, Replaced, Inactivity, Review Recommendation, Compliance, Duration Expired, Other |
| Reason Detail | `ppg_reasondetail` | Memo (2000) | | |
| Initiated From Lifecycle Review | `ppg_lifecyclereviewid` | Lookup | | |
| Business Owner Approval | `ppg_boapproval` | Choice | | Pending, Approved, Rejected |
| Technical Owner Approval | `ppg_toapproval` | Choice | | Pending, Approved, Rejected |
| Data Owner Approval | `ppg_doapproval` | Choice | | Pending, Approved, Rejected, Not Applicable |
| Security Review Required | `ppg_securityreviewrequired` | Yes/No | | |
| Disposition | `ppg_disposition` | Choice | | Delete, Archive, Transfer, Retain with Hold |
| Status | `statuscode` | Status Reason | B | Draft, Approvals, In Progress, Ready to Complete, Completed, Cancelled |
| Target Date | `ppg_targetdate` | Date Only | | |
| Completed On | `ppg_completedon` | Date and Time | | Cannot be set until all required checklist items are resolved |

---

## 30. Retirement Checklist Item (`ppg_retirementchecklistitem`)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Retirement Request | `ppg_retirementrequestid` | Lookup | B | |
| Item Type | `ppg_itemtype` | Choice | B | Application and Flow Inventory Review, Dependency Review, Data-Retention Review, Backup Confirmation, Solution Artifact Retention, Audit-Record Retention, Access Removal, Integration Shutdown, Connection and Service-Principal Review, Inventory Update, Environment Deletion or Disposition, Completion Evidence |
| Required | `ppg_isrequired` | Yes/No | B | |
| Status | `statuscode` | Status Reason | B | Not Started, In Progress, Complete, Not Applicable |
| Owner | `ppg_ownerid` | Lookup (User) | | |
| Completed On | `ppg_completedon` | Date and Time | | |
| Notes | `ppg_notes` | Memo (2000) | | |
