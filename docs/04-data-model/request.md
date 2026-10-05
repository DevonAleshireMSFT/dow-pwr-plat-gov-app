# Request Domain Tables

Tables 1, 2, 6, 8, 12, 13, 15, 16, 17, 18, 25, 31, 32. All are **user or team owned** unless noted. Conventions are in [README.md](README.md).

Notation: Req: B = Business Required, R = Recommended. **CS** = column security recommended. **GCV** = validate in GCC High, DoD, IL5.

---

## 1. Environment Request (`ppg_environmentrequest`)

| Property | Value |
|---|---|
| Purpose | The request for one or more environments. Holds intake identity, ownership summary, classification, routing flags, and status. |
| Ownership | User or team (Requestor owns Drafts. Ownership moves to the Intake queue team on submission) |
| Category | Transactional |
| Primary name | `ppg_name` (Text 200), the request title |
| Alternate keys | `ppg_requestnumber` |
| Audit | Yes: table and columns status, classification, decision summary, owner, flags |
| Retention | Retain per the organization's retention policy reference. Never delete. Deactivate and archive. |
| Sensitive columns | `ppg_businessjustification` (CS if it can contain mission detail), `ppg_notsupportedoverridejustification` |

Columns are grouped by who supplies them. The requestor supplies only the 10 intake items in group A. Everything else is derived by rules or assessed by the platform team and reviewers. See [../03a-requestor-intake.md](../03a-requestor-intake.md).

### A. Requestor-provided intake items (the 10-item request)

| # | Intake item | Column | Schema | Type | Req at submit | Notes |
|---|---|---|---|---|---|---|
| | Title | Title | `ppg_name` | Text (200) | B | Primary name |
| 1 | Program or Command Name | Program or Command | `ppg_programid` | Lookup (Program) | B | Organization is derived from the program. If the program is not listed, the requestor picks the organization and enters the name in `ppg_programnametext` |
| 1 | Organization | Organization | `ppg_organizationid` | Lookup (Organization) | B | Defaults from the program or the requestor profile |
| 1 | Program name (not listed) | Program Name (as entered) | `ppg_programnametext` | Text (200) | | Used only when the program is not in the list. Intake resolves it |
| 2 | Business Justification and Intended Use | Business Justification | `ppg_businessjustification` | Memo (4000) | B | **CS** consideration. Guidance: describe the purpose, not mission-sensitive detail |
| 3 | Business Owner | via Stakeholder Assignment (role code BO) | | | B | Entered on the form as a lookup and written to the junction table |
| 4 | Technical Owner | via Stakeholder Assignment (role code TO) | | | B | Same |
| 5 | Data types | Data Types | N:N to Intake Option (group Data Type) | | B | Multi-select, includes "I don't know". See [config-reference.md](config-reference.md) |
| 6 | Estimated User Population | Estimated User Population | `ppg_estimatedusers` | Whole Number | B | A rough number or band. Licensing detail is assessed later |
| 7 | Capabilities needed | Capabilities | N:N to Intake Option (group Capability) | | B | Multi-select, includes "Not sure" |
| 8 | External systems or integrations | Connects to Other Systems | `ppg_connectsexternal` | Choice | B | No, Yes, Not Sure |
| 8 | External systems (names) | Systems or Services (summary) | `ppg_integrationsummary` | Memo (2000) | B if Yes | Shown when Yes or Not Sure. Names only. Never credentials |
| 9 | Requested Environment Family or Purpose | Workload Type | `ppg_workloadtypeid` | Lookup (Intake Option, group Workload Type) | B | "What kind of workload is this?" The app recommends a family and stage set |
| 9 | Requested Environment Family | Requested Family | `ppg_requestedfamilyid` | Lookup (Environment Family) | | Prefilled from the workload type. Requestor may accept, change, or leave as "Not sure" |
| 10 | Expected Duration | Duration Type | `ppg_durationtype` | Choice | B | Permanent, Temporary, Unknown |
| 10 | Expected End Date | Expected End Date | `ppg_expectedenddate` | Date Only | B if Temporary | |

Conditional intake prompts (shown only when triggered, and "Unknown" is always allowed):

| Prompt | Column | Type | Shown when |
|---|---|---|---|
| Is the workload already associated with an authorization boundary? | `ppg_knownboundary` | Choice (Yes, No, Unknown) | Data types include anything other than public or releasable, or Connects to Other Systems is Yes or Not Sure |
| Authorization boundary | `ppg_authorizationboundaryid` | Lookup (Authorization Boundary) | `ppg_knownboundary` = Yes |
| Data Owner | via Stakeholder Assignment (role code DO) | | Data types indicate governed or sensitive data |
| Security point of contact | via Stakeholder Assignment (role code SPOC) | | Intake or a rule triggers security review. Not asked on page one |

### B. Derived by rules or assessed during intake and review (not entered by the requestor)

| Column | Schema | Type | Set by | Notes |
|---|---|---|---|---|
| Request Number | `ppg_requestnumber` | Text (30) | System | Immutable. Generated by plug-in from Organization Configuration format and Number Sequence. No mutable data (no status or organization name). Read-only on forms. Alternate key. Blocked from update by plug-in |
| Request Type | `ppg_requesttype` | Choice | System or intake | New Environment Set, Change (linked), Resubmission |
| Application or Workload | `ppg_applicationid` | Lookup (Application) | Technical owner or intake | Created or matched during technical assessment |
| Environment Family (confirmed) | `ppg_familyid` | Lookup (Environment Family) | Intake analyst | Confirms or changes the requested family. Drives the default stage set |
| Recommended Family | `ppg_recommendedfamilyid` | Lookup (Environment Family) | System | From workload type and rules |
| Family Confirmed By / On | `ppg_familyconfirmedbyid`, `ppg_familyconfirmedon` | Lookup (User), Date and Time | Intake analyst | |
| Data Classification (confirmed) | `ppg_dataclassificationid` | Lookup (Data Classification) | Intake analyst or reviewer | Required before reviews are generated, not at submission |
| Recommended Data Classification | `ppg_recdataclassificationid` | Lookup (Data Classification) | System | Highest-rank minimum classification among the selected data types. "I don't know" yields a pending flag |
| Data Classification Pending | `ppg_dataclassificationpending` | Yes/No | System | Yes when any selected data type is "I don't know" and no confirmed value exists |
| Impact Answer | `ppg_impactanswerid` | Lookup (Intake Option, group Impact) | Business owner or intake analyst | Impact question collected at Stage 2. Wording and values are organization-configured |
| Application Classification (confirmed) | `ppg_appclassificationid` | Lookup (Application Classification) | Intake analyst or reviewer | Required before reviews are generated |
| Recommended Application Classification | `ppg_recappclassificationid` | Lookup (Application Classification) | System | Derived from the impact answer and capability flags |
| Effective Governance Rank | `ppg_effectiverank` | Whole Number | System | Greater of the confirmed ranks. If a classification is not yet confirmed, the recommended rank is used. If neither exists, the highest configured rank applies until resolved (conservative default) |
| Has Premium or Dataverse Capability | `ppg_haspremium` | Yes/No | System | Derived from selected capabilities. Reviewer may override |
| Has Connectors | `ppg_hasconnectors` | Yes/No | System or technical owner | Set when connector records exist or intake confirms |
| AI or Agent Capability | `ppg_hasai` | Yes/No | System | Derived from the capability option. Escalation trigger when using mission or sensitive data |
| External-Facing Capability | `ppg_isexternalfacing` | Yes/No | Intake or reviewer | Escalation trigger |
| Cross-Program Data Integration | `ppg_crossprogramdata` | Yes/No | Intake or reviewer | Escalation trigger |
| Enterprise Architecture Exception | `ppg_hasarchexception` | Yes/No | Reviewer | Escalation trigger |
| Break-Glass or Exception Operation | `ppg_hasbreakglass` | Yes/No | Security reviewer | Escalation trigger |
| Program Core Indicators | `ppg_programcoreindicators` | Choices | Technical owner or intake | Multi-select of the indicators in [../06-rules.md](../06-rules.md). Asked in technical assessment, not at submission |
| Program Core Recommendation | `ppg_programcorerecommendation` | Choice | System | Recommended, Not Recommended, Insufficient Information |
| Program Core Decision | `ppg_programcoredecision` | Choice | Authorized reviewer | Include, Exclude, Pending |
| Program Core Decision By | `ppg_programcoredecisionbyid` | Lookup (User) | System | |
| Program Core Decision Rationale | `ppg_programcorerationale` | Memo (2000) | Authorized reviewer | Required if decision differs from recommendation |
| Escalation Required | `ppg_escalationrequired` | Yes/No | System | From Approval Rules |
| Escalation Reasons | `ppg_escalationreasons` | Choices | System | |
| Intake Triage Notes | `ppg_triagenotes` | Memo (2000) | Intake analyst | Explains derived values that were changed |
| Not-Supported Data Override Justification | `ppg_notsupportedoverridejustification` | Memo (2000) | Authorized role | |
| Prior Request | `ppg_priorrequestid` | Lookup (Environment Request, self) | System or requestor | For resubmission of a rejected request |
| Related Environment | `ppg_relatedenvironmentid` | Lookup (Provisioned Environment) | Requestor | For change-type requests |
| Request Status | `statuscode` | Status Reason | System | Per [../03-process.md](../03-process.md) |
| Submitted On | `ppg_submittedon` | Date and Time | System | |
| Decision Date | `ppg_decisiondate` | Date and Time | System | From latest Approval Decision |
| Completed On | `ppg_completedon` | Date and Time | System | |
| Requestor | `ppg_requestorid` | Lookup (User) | System | Cannot be altered after submission |
| Business Process Flow stage | system `processid` and `stageid` | | System | BPF |

Not collected on the request at all (collected in child records during review): licensing detail (Licensing Requirement), capacity (Capacity Estimate), security requirements (Security Requirement), connector detail (Requested Connector), integration detail (External Integration), support and sustainment (Support and Sustainment Plan).

Lookups out: Organization, Program, Application, Requested Family, Recommended Family, Family, Workload Type, Impact Answer, Application Classification, Recommended Application Classification, Data Classification, Recommended Data Classification, Authorization Boundary, Requestor (User), Prior Request, Related Environment.

One-to-many: Requested Environment, Stakeholder Assignment, Requested Connector, External Integration, Licensing Requirement, Capacity Estimate, Security Requirement, Support Plan, Review Requirement, Governance Review, Approval Decision, Governance Exception, Provisioning Task, Supporting Document, Request History Entry.

Many-to-many: Intake Option (data types and capabilities selected), via `ppg_environmentrequest_intakeoption`. Connectors and stages link through Requested Connector and its N:N to Requested Environment.

---

## 2. Requested Environment (`ppg_requestedenvironment`)

| Property | Value |
|---|---|
| Purpose | One requested stage or environment within a request (for example Development, Test, Production). A request can have several. |
| Primary name | `ppg_name` (Text 200). System-built, for example request number plus type name |
| Alternate keys | `ppg_requestid` + `ppg_typeid` |
| Audit | Yes |
| Retention | Same as parent request |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup (Environment Request) | B | Parent. Cascade: parental |
| Environment Type | `ppg_typeid` | Lookup (Environment Type) | B | Must belong to the request family (plug-in check) |
| Required | `ppg_isrequired` | Yes/No | B | Optional types such as Program Core default to No |
| Proposed Environment Name | `ppg_proposedname` | Text (200) | | Generated from Naming Standard. Editable by provisioner |
| Justification | `ppg_justification` | Memo (2000) | | Required when an optional stage is included, or when a default stage is excluded |
| Requested Region | `ppg_region` | Text (100) | | Region values vary by cloud **GCV** |
| Planned Start Date | `ppg_plannedstart` | Date Only | | |
| Status | `statuscode` | Status Reason | B | Planned, Approved, Provisioning, Provisioned, Excluded, Cancelled |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup (Provisioned Environment) | | Set when created |

Relationships: N:1 Environment Request, Environment Type. 1:1 Provisioned Environment. N:N Requested Connector (`ppg_requestedconnector_requestedenvironment`).

---

## 6. Stakeholder Assignment (`ppg_stakeholderassignment`)

| Property | Value |
|---|---|
| Purpose | Junction that assigns a person to a role on a request, application, or environment. Avoids a personnel database. |
| Primary name | `ppg_name` (Text 200), system-built |
| Alternate keys | `ppg_requestid` + `ppg_roleid` + `ppg_userid` (active) |
| Audit | Yes. Ownership validity is a lifecycle-review item |
| Sensitive columns | `ppg_contactemail` if used (PII). **CS** |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Stakeholder Role | `ppg_roleid` | Lookup (Stakeholder Role) | B | |
| Person (User) | `ppg_userid` | Lookup (User) | | Use when the person is an Entra-synced Dataverse user |
| Person (Contact) | `ppg_contactid` | Lookup (Contact) | | Use when the person is not a Dataverse user |
| Request | `ppg_requestid` | Lookup (Environment Request) | | One of Request, Application, or Provisioned Environment is required |
| Application | `ppg_applicationid` | Lookup (Application) | | |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup (Provisioned Environment) | | |
| Organization | `ppg_organizationid` | Lookup (Organization) | | Person's organization when relevant |
| Is Primary | `ppg_isprimary` | Yes/No | | |
| Effective From | `ppg_effectivefrom` | Date Only | | |
| Effective To | `ppg_effectiveto` | Date Only | | Null means active |
| Last Validated On | `ppg_lastvalidatedon` | Date Only | | System, by owner validation |
| Contact Email | `ppg_contactemail` | Text (Email) | | **CS**. Only for Contact-based stakeholders without a mailbox in the directory |

Validation: exactly one of User or Contact is required. The requestor cannot be assigned as the sole approver of their own request (see [../05-security.md](../05-security.md)).

---

## 8. Application or Workload (`ppg_application`)

| Property | Value |
|---|---|
| Purpose | The application or workload that will run in the requested environments. Persists across requests and environments. |
| Primary name | `ppg_name` (Text 200) |
| Alternate keys | `ppg_applicationcode` |
| Audit | Yes |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Application Code | `ppg_applicationcode` | Text (50) | | Alternate key |
| Organization | `ppg_organizationid` | Lookup | B | |
| Program or Command | `ppg_programid` | Lookup | | |
| Application Classification | `ppg_appclassificationid` | Lookup | | Current classification. The request keeps the classification at the time of the request |
| Description | `ppg_description` | Memo (4000) | | |
| Workload Type | `ppg_workloadtype` | Choice | | Canvas App, Model-Driven App, Flow Automation, Copilot or Agent, Portal, Mixed, Other |
| Uses Shared Dataverse Data Model | `ppg_usessharedmodel` | Yes/No | | Program Core indicator |
| Shared Components Description | `ppg_sharedcomponents` | Memo (2000) | | Program Core indicator |
| Development Team Count | `ppg_devteamcount` | Whole Number | | Program Core indicator |
| Source Repository Location | `ppg_repourl` | Text (URL, 500) | | Link only. No credentials |
| Lifecycle Status | `ppg_lifecyclestatus` | Choice | | Planned, In Development, In Service, Retiring, Retired |

---

## 12. Requested Connector (`ppg_requestedconnector`)

| Property | Value |
|---|---|
| Purpose | A connector requested by a specific request, with the request-specific assessment. References the Connector register. |
| Primary name | `ppg_name` (Text 200), system-built |
| Alternate keys | `ppg_requestid` + `ppg_connectorid` |
| Audit | Yes. Decision and expiry are audited |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup (Environment Request) | B | |
| Connector | `ppg_connectorid` | Lookup (Connector) | B | |
| Connector Name (as requested) | `ppg_requestedname` | Text (200) | | Used when the connector is not yet in the register |
| Connector Type | `ppg_connectortype` | Choice | | Standard, Premium, Custom, Other (copied then reviewed) |
| Publisher or Owner | `ppg_publisher` | Text (200) | | |
| Data Sources | `ppg_datasources` | Memo (2000) | | |
| Destination | `ppg_destination` | Memo (2000) | | |
| Authentication Model | `ppg_authmodel` | Choice | | Same choices as Connector |
| Supports Service Principal | `ppg_supportsserviceprincipal` | Yes/No | | |
| Data Residency | `ppg_dataresidency` | Text (200) | | |
| Endpoint Exposure | `ppg_endpointexposure` | Choice | | Internal, External, Both, Unknown |
| Data Classification | `ppg_dataclassificationid` | Lookup (Data Classification) | | |
| DLP Grouping Requested | `ppg_dlpgrouping` | Choice | | Business, Non-Business, Blocked, Not Applicable |
| Existing Approval Status | `ppg_existingapprovalstatus` | Choice | | Not Assessed, Approved, Approved with Conditions, Restricted, Blocked. Copied from register at creation |
| Licensing Impact | `ppg_licensingimpact` | Choice | | None, Premium Required, Capacity Impact, Unknown |
| Authorization Impact | `ppg_authorizationimpact` | Choice | | None, New Boundary, Boundary Change, Unknown |
| Security Review Required | `ppg_securityreviewrequired` | Yes/No | | System recommendation, reviewer confirms |
| Exception Required | `ppg_exceptionrequired` | Yes/No | | |
| Decision | `ppg_decision` | Choice | | Pending, Approved, Approved with Conditions, Rejected, Not Required |
| Decision Expiration | `ppg_decisionexpiration` | Date Only | | Required for conditional decisions |
| Decision Rationale | `ppg_decisionrationale` | Memo (2000) | | |
| Related Exception | `ppg_exceptionid` | Lookup (Governance Exception) | | |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | Connector and DLP reviewer |

Many-to-many: Requested Environment (the stages that use the connector), via `ppg_requestedconnector_requestedenvironment`.

---

## 13. External Integration (`ppg_externalintegration`)

| Property | Value |
|---|---|
| Purpose | An integration between the requested capability and an external or other system. |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Sensitive columns | `ppg_endpoint` (may reveal internal topology). **CS** consideration. No credentials allowed. |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Source System | `ppg_sourcesystem` | Text (200) | B | |
| Target System | `ppg_targetsystem` | Text (200) | B | |
| Direction | `ppg_direction` | Choice | B | Inbound, Outbound, Bidirectional |
| Data Exchanged | `ppg_dataexchanged` | Memo (2000) | B | |
| Data Classification | `ppg_dataclassificationid` | Lookup (Data Classification) | B | |
| Endpoint | `ppg_endpoint` | Text (500) | | Hostname or URL only. Never a credential or token |
| Hosting Boundary | `ppg_hostingboundary` | Text (200) | | |
| Authentication Method | `ppg_authmethod` | Choice | | OAuth, Certificate Based, API Key (secret held in an approved vault), Windows, Managed Identity, Service Principal, None, Other |
| Frequency or Volume | `ppg_frequencyvolume` | Text (200) | | |
| Availability Requirement | `ppg_availabilityreq` | Text (200) | | Organization-defined wording |
| Owning Organization | `ppg_owningorganizationid` | Lookup (Organization) | | |
| Technical Owner | `ppg_technicalownerid` | Lookup (User) | | |
| Authorization Boundary | `ppg_authorizationboundaryid` | Lookup (Authorization Boundary) | | |
| Uses Custom Connector | `ppg_usescustomconnector` | Yes/No | | Escalation trigger |
| Gateway Dependency | `ppg_gatewaydependency` | Choice | | None, On-Premises Data Gateway, VNet Data Gateway, Other. Support in the target cloud **GCV** |
| Gateway Description | `ppg_gatewaydescription` | Text (300) | | |
| Monitoring Requirement | `ppg_monitoringreq` | Memo (1000) | | |
| Support Responsibility | `ppg_supportresponsibility` | Text (300) | | |
| Cross-Program | `ppg_iscrossprogram` | Yes/No | | Escalation trigger |
| Is External-Facing | `ppg_isexternalfacing` | Yes/No | | Escalation trigger |

Many-to-many: Connector (the connectors or custom connectors this integration depends on), via `ppg_externalintegration_connector`.

---

## 15. Licensing Requirement (`ppg_licensingrequirement`)

| Property | Value |
|---|---|
| Purpose | Licensing needs and the licensing review outcome for a request (and optionally per stage). |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Requested Environment | `ppg_requestedenvironmentid` | Lookup | | Null means whole request |
| Role or User Group | `ppg_userrole` | Text (150) | B | For users-by-role detail |
| Estimated Application Users | `ppg_appusers` | Whole Number | B | |
| Estimated Makers | `ppg_makers` | Whole Number | | |
| Estimated Total Users | `ppg_totalusers` | Whole Number | | |
| Requested Premium Capabilities | `ppg_premiumcapabilities` | Memo (2000) | | |
| Requested License Type | `ppg_licensetypeid` | Lookup (License Type) | | |
| Existing Entitlement | `ppg_existingentitlement` | Memo (1000) | | |
| License Funding Owner | `ppg_fundingownerid` | Lookup (User) | | |
| Funding Organization | `ppg_fundingorganizationid` | Lookup (Organization) | | |
| Licensing Review Outcome | `ppg_outcome` | Choice | | Pending, Sufficient, Additional Licenses Required, Funding Required, Not Approved |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | |
| Reviewed On | `ppg_reviewedon` | Date and Time | | |
| Decision Notes | `ppg_decisionnotes` | Memo (2000) | | |

---

## 16. Capacity Estimate (`ppg_capacityestimate`)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | Primary name |
| Request | `ppg_requestid` | Lookup | B | |
| Requested Environment | `ppg_requestedenvironmentid` | Lookup | B | Capacity is per Dataverse environment |
| Database Capacity Estimate (GB) | `ppg_dbgb` | Decimal (2 places) | B | |
| File Capacity Estimate (GB) | `ppg_filegb` | Decimal (2 places) | | |
| Log Capacity Estimate (GB) | `ppg_loggb` | Decimal (2 places) | | |
| Basis of Estimate | `ppg_basis` | Memo (2000) | | |
| Capacity Allocation Required | `ppg_allocationrequired` | Yes/No | | |
| Capacity Add-on Needed | `ppg_addonneeded` | Yes/No | | |
| Capacity Review Outcome | `ppg_outcome` | Choice | | Pending, Within Available Capacity, Allocation Required, Add-on Required, Not Approved |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | |
| Reviewed On | `ppg_reviewedon` | Date and Time | | |
| Decision Notes | `ppg_decisionnotes` | Memo (2000) | | |

Audit: yes. Retention: with the request.

---

## 17. Security Requirement (`ppg_securityrequirement`)

| Property | Value |
|---|---|
| Purpose | Security requirements and review outcome for a request. |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes, all columns |
| Sensitive columns | Break-glass, service-account exception, production access, unresolved findings text. **CS** profile for Security Reviewer, Platform Administrator, Auditor only. |
| Hard rule | No secrets, passwords, certificates, keys, or tokens. Guidance text shown on the form and a plug-in pattern check on text columns. |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Authorization Boundary | `ppg_authorizationboundaryid` | Lookup (Authorization Boundary) | | Required when data is sensitive |
| CUI Indicator | `ppg_cui` | Yes/No | B | |
| PII Indicator | `ppg_pii` | Yes/No | B | |
| Mission Data Indicator | `ppg_missiondata` | Yes/No | B | |
| Required Security Groups | `ppg_securitygroups` | Memo (2000) | | Group names, not membership secrets |
| Required Dataverse Roles or Teams | `ppg_dataverseroles` | Memo (2000) | | |
| Field Security Requirement | `ppg_fieldsecurityreq` | Memo (1000) | | |
| Audit Requirement | `ppg_auditreq` | Memo (1000) | | |
| Monitoring Requirement | `ppg_monitoringreq` | Memo (1000) | | |
| Conditional Access or Session Control Consideration | `ppg_caconsideration` | Memo (1000) | | |
| Production Access Model | `ppg_productionaccessmodel` | Choice | | Least Privilege Role Based, Just-in-Time, Privileged Group, Other |
| Break-Glass Required | `ppg_breakglass` | Yes/No | | **CS**. Escalation trigger |
| Break-Glass Justification | `ppg_breakglassjustification` | Memo (2000) | | **CS** |
| Service Principal Required | `ppg_serviceprincipal` | Yes/No | | |
| Service-Account Exception Required | `ppg_serviceaccountexception` | Yes/No | | **CS**. Escalation trigger |
| Service-Account Exception Justification | `ppg_serviceaccountjustification` | Memo (2000) | | **CS** |
| Security Review Outcome | `ppg_outcome` | Choice | | Pending, Satisfactory, Satisfactory with Conditions, Unsatisfactory, Not Required |
| Unresolved Security Findings | `ppg_unresolvedfindings` | Memo (4000) | | **CS**. Findings are tracked in the Finding table. This is a summary |
| Reviewer | `ppg_reviewerid` | Lookup (User) | | |
| Reviewed On | `ppg_reviewedon` | Date and Time | | |

---

## 18. Authorization Boundary (`ppg_authorizationboundary`)

| Property | Value |
|---|---|
| Purpose | A named authorization boundary (existing or new) that requests, integrations, and environments sit within. Reusable. |
| Ownership | User or team (so a security team can own it) |
| Category | Reference with transactional change history |
| Primary name | `ppg_name` (Text 200) |
| Alternate keys | `ppg_boundarycode` |
| Audit | Yes, all columns |
| Sensitive columns | Identifiers and POC detail. **CS** |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Boundary Code | `ppg_boundarycode` | Text (50) | B | Alternate key |
| Existing or New | `ppg_existingornew` | Choice | B | Existing, New, Changed |
| Authorization Status | `ppg_authstatus` | Choice | B | Not Started, In Progress, Authorized, Authorized with Conditions, Expired, Revoked, Not Applicable. Term mapping is organization-specific (see Organization Configuration terminology) |
| Authorization Owner | `ppg_authownerid` | Lookup (User) | | |
| Security Point of Contact | `ppg_securitypocid` | Lookup (User) | | |
| Security Manager (term from configuration) | `ppg_securitymanagerid` | Lookup (User) | | First security role term (for example ISSM in the seed) |
| Security Officer (term from configuration) | `ppg_securityofficerid` | Lookup (User) | | Second security role term (for example ISSO in the seed) |
| Authorization Expiration | `ppg_authexpiration` | Date Only | | |
| Description | `ppg_description` | Memo (2000) | | |
| Reference Link | `ppg_reference` | Text (URL, 500) | | Link to authorization documentation |
| Organization | `ppg_organizationid` | Lookup (Organization) | | |

---

## 25. Support and Sustainment Plan (`ppg_supportplan`)

| Property | Value |
|---|---|
| Purpose | Structured support and sustainment plan. Required before Production approval. Linked to a request, application, and later the Provisioned Environment. |
| Primary name | `ppg_name` (Text 200) |
| Audit | Yes |
| Retention | Retain while any linked environment exists plus retention policy |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | | |
| Application | `ppg_applicationid` | Lookup | | |
| Business Owner | `ppg_businessownerid` | Lookup (User) | B | |
| Technical Owner | `ppg_technicalownerid` | Lookup (User) | B | |
| Data Owner | `ppg_dataownerid` | Lookup (User) | | Required when governed data |
| Support Owner | `ppg_supportownerid` | Lookup (User) | B | Individual or team (see support team) |
| Support Team | `ppg_supportteamid` | Lookup (Team) | | Preferred over a named individual |
| Support Tier | `ppg_supporttier` | Choice | B | Tier 1, Tier 2, Tier 3, Vendor, Other |
| Help-Desk Route | `ppg_helpdeskroute` | Text (500) | | |
| Escalation Path | `ppg_escalationpath` | Memo (2000) | | |
| Operating Hours | `ppg_operatinghours` | Text (300) | | Organization-defined |
| Recovery Owner | `ppg_recoveryownerid` | Lookup (User) | | |
| Source Repository Location | `ppg_repourl` | Text (URL, 500) | | |
| Deployment Method | `ppg_deploymentmethod` | Choice | | Pipelines, Manual Solution Import, Source-Control Pipeline, Other |
| Operational Runbook Location | `ppg_runbookurl` | Text (URL, 500) | B (Prod) | |
| Solution Backup Location | `ppg_backupurl` | Text (URL, 500) | | |
| Known Dependencies | `ppg_dependencies` | Memo (2000) | | |
| Service Principals or Approved Non-Personal Identities | `ppg_nonpersonalidentities` | Memo (1000) | | Names or identifiers only. No secrets |
| Recovery Time Objective (hours) | `ppg_rtohours` | Decimal (2 places) | | Required when classification requires |
| Recovery Point Objective (hours) | `ppg_rpohours` | Decimal (2 places) | | Required when classification requires |
| Continuity Requirements | `ppg_continuity` | Memo (2000) | | |
| Personnel-Transition Plan | `ppg_transitionplan` | Memo (2000) | | |
| Decommissioning Owner | `ppg_decommissionownerid` | Lookup (User) | | |
| Plan Status | `ppg_planstatus` | Choice | B | Draft, Complete, Accepted, Needs Update |
| Last Reviewed On | `ppg_lastreviewedon` | Date Only | | |

Relationships: N:1 Request, Application. 1:N Provisioned Environment (an environment references the plan in effect).

---

## 31. Supporting Document (`ppg_supportingdocument`)

| Property | Value |
|---|---|
| Purpose | Metadata and link for evidence stored in SharePoint. Dataverse is not the primary file store. |
| Primary name | `ppg_name` (Text 300) |
| Audit | Yes |
| Retention | Metadata retained per policy. The document retention is governed in SharePoint |
| Sensitive columns | `ppg_documenturl` can expose location. **CS** by role through table scope instead of column security in most cases |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (300) | B | |
| Document Type | `ppg_doctype` | Choice | B | Architecture Diagram, Security Assessment, Authorization Documentation, Licensing Estimate, Connector Assessment, Support Plan, Operational Runbook, Approval Memorandum, Exception Documentation, Provisioning Evidence, Validation Evidence, Retirement Evidence, Other |
| Document URL | `ppg_documenturl` | Text (URL, 1000) | B | SharePoint link |
| Version or Date | `ppg_version` | Text (50) | | |
| Request | `ppg_requestid` | Lookup | | Regarding. At least one regarding lookup is required |
| Provisioned Environment | `ppg_provisionedenvironmentid` | Lookup | | |
| Review | `ppg_reviewid` | Lookup (Governance Review) | | |
| Approval Decision | `ppg_decisionid` | Lookup | | |
| Exception | `ppg_exceptionid` | Lookup | | |
| Finding | `ppg_findingid` | Lookup | | |
| Retirement Request | `ppg_retirementrequestid` | Lookup | | |
| Provisioning Task | `ppg_taskid` | Lookup | | |
| Handling Marking | `ppg_handlingmarking` | Text (100) | | Marking text from the organization scheme |
| Uploaded By | `ppg_uploadedbyid` | Lookup (User) | | |
| Upload Date | `ppg_uploadeddate` | Date and Time | | |

Native SharePoint document management on the entity is optional. Verify in the target cloud (**GCV**). The link-table approach works without it.

---

## 32. Request History Entry (`ppg_requesthistory`)

| Property | Value |
|---|---|
| Purpose | Append-only business history and comments: status changes, decisions, returns, comments, key events. Complements Dataverse auditing with business-readable history. |
| Ownership | User or team. Create only. No update or delete privilege for any role. |
| Category | Audit/history |
| Primary name | `ppg_name` (Text 200), summary |
| Audit | Table-level on |
| Retention | Retain at least as long as the request |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Summary | `ppg_name` | Text (200) | B | |
| Request | `ppg_requestid` | Lookup | B | |
| Event Type | `ppg_eventtype` | Choice | B | Status Change, Comment, Decision, Review Event, Return for Information, Resubmission, Document Added, Assignment, Exception, System |
| Detail | `ppg_detail` | Memo (4000) | | |
| Previous Value | `ppg_previousvalue` | Text (200) | | |
| New Value | `ppg_newvalue` | Text (200) | | |
| Actor | `ppg_actorid` | Lookup (User) | | Acting user or the automation identity |
| Actor Is Automation | `ppg_actorisautomation` | Yes/No | | |
| Related Record Type | `ppg_relatedtype` | Text (100) | | |
| Related Record Id | `ppg_relatedid` | Text (50) | | |
| Event Date | `ppg_eventdate` | Date and Time | B | System-set |
