# Configuration and Reference Tables

Tables 4, 5, 7, 9, 10, 11, 14, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44. All are **organization owned** unless noted. Conventions are in [README.md](README.md).

Common to all tables in this file:
- **Auditing:** enabled at table level (configuration changes affect routing and must be traceable).
- **Retention:** retain for the life of the configuration plus the period set by the retention policy referenced in Organization Configuration. Deactivate rather than delete in-use rows.
- **Write access:** Platform Administrator only (see [../05-security.md](../05-security.md)). Read access is broad.
- **Seed:** USMC examples are in the seed package, not in the schema.

Column notation: Req = Required (B = Business Required, R = Recommended, blank = optional).

---

## 33. Organization Configuration (`ppg_organizationconfiguration`)

| Property | Value |
|---|---|
| Purpose | Single anchor record per implementing organization that holds terminology, defaults, and policy references. Drives forms labels, naming, numbering, routing defaults, and notifications. |
| Ownership | Organization |
| Category | Configuration |
| Primary name | `ppg_name` (Text 200), for example "Organization Configuration" |
| Alternate keys | `ppg_configkey` (Text 100) |
| Audit | Yes, all columns |
| Retention | Retain history for the life of the application |
| Sensitive columns | None expected. Do not store secrets in `ppg_notificationmailbox`. Use an environment variable or connection reference. |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | Primary name |
| Config Key | `ppg_configkey` | Text (100) | B | Alternate key. Value `default` for the single active record |
| Organization Name | `ppg_organizationname` | Text (200) | B | |
| Service or Agency | `ppg_serviceoragency` | Text (200) | B | |
| Tenant Name | `ppg_tenantname` | Text (200) | | |
| Cloud Boundary | `ppg_cloudboundary` | Text (200) | B | Descriptive, for example a commercial, GCC, GCC High, DoD, or other designation |
| Cloud Context Description | `ppg_cloudcontext` | Memo (2000) | | |
| Operating Boundary Name | `ppg_operatingboundary` | Text (200) | | Seed example only |
| Central Platform Team Name | `ppg_platformteamname` | Text (200) | B | |
| Governance Board Name | `ppg_governanceboardname` | Text (200) | B | |
| Security Authority Terminology | `ppg_securityauthorityterm` | Text (200) | B | Label for the security reviewer function |
| Security Role Term 1 | `ppg_securityroleterm1` | Text (100) | | Equivalent of the first security reviewer title |
| Security Role Term 2 | `ppg_securityroleterm2` | Text (100) | | Equivalent of the second security reviewer title |
| Authorization Boundary Terminology | `ppg_authboundaryterm` | Text (200) | | Label shown in the app |
| Default Review Cadence (months) | `ppg_defaultreviewcadencemonths` | Whole Number (1 to 120) | | Value set by the organization. Do not default in schema |
| Request Number Format | `ppg_requestnumberformat` | Text (100) | B | For example tokens `{PREFIX}-{YYYY}-{SEQ:6}` |
| Request Number Prefix | `ppg_requestnumberprefix` | Text (10) | B | |
| Default Naming Standard | `ppg_defaultnamingstandardid` | Lookup (Naming Standard) | | |
| Default Retention Policy Reference | `ppg_retentionpolicyref` | Text (500) | | Reference to the policy, not the policy text |
| Escalation Capacity Threshold (GB) | `ppg_escalationcapacitythresholdgb` | Decimal (2 places) | | Used by escalation rules |
| Escalation User Threshold | `ppg_escalationuserthreshold` | Whole Number | | Used by escalation rules |
| Notification Mailbox | `ppg_notificationmailbox` | Text (Email) | | Shared mailbox address, not a personal address |
| Notifications Enabled | `ppg_notificationsenabled` | Yes/No | B | |
| SharePoint Site URL | `ppg_sharepointsiteurl` | Text (URL, 500) | | Prefer an environment variable. This column is a display copy |
| Active | system `statecode` | State | | Only one active record is expected |

Lookups out: Default Naming Standard (N:1).
One-to-many: Environment Family, Approval Rule, Notification Rule, Naming Standard, Application Classification, Data Classification, DLP Policy, Number Sequence.

---

## 34. Environment Family (`ppg_environmentfamily`)

| Property | Value |
|---|---|
| Purpose | Configurable family such as Platform, Shared Services, Command Hub, Program, Individual Developer, Default. |
| Primary name | `ppg_name` (Text 100) |
| Alternate keys | `ppg_familycode` |
| Category | Configuration |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (100) | B | |
| Family Code | `ppg_familycode` | Text (30) | B | Alternate key. Used in naming tokens |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |
| Description | `ppg_description` | Memo (2000) | | |
| Default Stage Types | derived | N:1 from Environment Type | | Types with `ppg_defaultincluded` = Yes populate requested stages |
| Requires Governance Board | `ppg_requiresboardreview` | Yes/No | | Default routing hint, overridden by Approval Rules |
| Is Shared Environment | `ppg_isshared` | Yes/No | | |
| Default Review Cadence Override (months) | `ppg_reviewcadencemonths` | Whole Number | | Overrides the Organization Configuration cadence |
| Sort Order | `ppg_sortorder` | Whole Number | | |

Relationships: 1:N Environment Type, Naming Standard, Environment Request (requested family), Provisioned Environment.

---

## 35. Environment Type (`ppg_environmenttype`)

| Property | Value |
|---|---|
| Purpose | A lifecycle stage or type within a family (Development, Test, Production, Core, Individual Developer Environment, Default Environment). |
| Primary name | `ppg_name` (Text 150) |
| Alternate keys | `ppg_familyid` + `ppg_typecode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (150) | B | For example "Program Development" |
| Environment Family | `ppg_familyid` | Lookup (Environment Family) | B | |
| Type Code | `ppg_typecode` | Text (30) | B | |
| Lifecycle Stage | `ppg_lifecyclestage` | Choice | B | Core, Development, Test, Production, Sandbox, Personal, Default, Other. Used by rules |
| Is Production Class | `ppg_isproductionclass` | Yes/No | B | Drives support-plan and Test-before-Production rules |
| Optional | `ppg_isoptional` | Yes/No | | For example Program Core |
| Default Included | `ppg_defaultincluded` | Yes/No | | Auto-added to new requests |
| Predecessor Type | `ppg_predecessortypeid` | Lookup (Environment Type, self) | | For example Test is a predecessor of Production |
| Platform Environment Type | `ppg_platformenvtype` | Choice | | Production, Sandbox, Developer, Default, Trial, Other. Mapping to the platform type, validate in target cloud **GCV** |
| Sort Order | `ppg_sortorder` | Whole Number | | |

Relationships: N:1 Environment Family. 1:N Requested Environment, Provisioned Environment, Provisioning Task Template, Naming Standard (optional).

---

## 9. Application Classification (`ppg_applicationclassification`)

| Property | Value |
|---|---|
| Purpose | Configurable application classification (seed: Mission Critical, Business Critical, Standard, Maker or Personal Productivity). |
| Alternate keys | `ppg_classcode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (150) | B | |
| Class Code | `ppg_classcode` | Text (30) | B | Alternate key |
| Restrictiveness Rank | `ppg_rank` | Whole Number | B | Higher means more restrictive governance. Drives the "most restrictive wins" rule |
| Description | `ppg_description` | Memo (2000) | | |
| Requires Support Plan | `ppg_requiressupportplan` | Yes/No | | |
| Requires Recovery Objectives | `ppg_requiresrecoveryobjectives` | Yes/No | | RTO and RPO required |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

---

## 10. Data Classification (`ppg_dataclassification`)

| Property | Value |
|---|---|
| Purpose | Configurable data classification (seed: Unclassified Public, Unclassified Non-Sensitive, Controlled Unclassified Information, CUI requiring IL5 handling, Classified or Not Supported). |
| Alternate keys | `ppg_classcode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (150) | B | |
| Class Code | `ppg_classcode` | Text (30) | B | Alternate key |
| Restrictiveness Rank | `ppg_rank` | Whole Number | B | Higher means more restrictive |
| Is Governed Data | `ppg_isgoverneddata` | Yes/No | B | Data Owner is required when Yes |
| Is Sensitive | `ppg_issensitive` | Yes/No | B | Security review and authorization information required when Yes |
| Requires High-Impact Handling | `ppg_requireshighhandling` | Yes/No | | Seed example: IL5 handling. Escalation trigger |
| Is Not Supported | `ppg_isnotsupported` | Yes/No | B | Request is blocked from standard routing and is sent to a human decision |
| Description | `ppg_description` | Memo (2000) | | |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

---

## 4. Organization (`ppg_organization`)

| Property | Value |
|---|---|
| Purpose | Reference list of commands, business units, or subordinate organizations that own requests. Hierarchical. Does not replace Entra ID or Dataverse Business Unit. |
| Alternate keys | `ppg_orgcode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Org Code | `ppg_orgcode` | Text (50) | B | Alternate key |
| Parent Organization | `ppg_parentorganizationid` | Lookup (self) | | Hierarchy |
| Organization Type | `ppg_orgtype` | Choice | | Command, Business Unit, Program Office, Agency, Other |
| Delegated Approval Authority | `ppg_delegatedauthorityteamid` | Lookup (Team) | | Team that holds routine delegated approval for this organization |
| Command or Program Reviewer Team | `ppg_reviewerteamid` | Lookup (Team) | | |
| Dataverse Business Unit | `ppg_businessunitid` | Lookup (Business Unit) | | Used when one deployment serves several organizations |

---

## 5. Program or Command (`ppg_program`)

| Property | Value |
|---|---|
| Purpose | Program, command element, or business function that owns applications. Child of Organization. |
| Alternate keys | `ppg_programcode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Program Code | `ppg_programcode` | Text (50) | B | Alternate key |
| Organization | `ppg_organizationid` | Lookup | B | |
| Program Type | `ppg_programtype` | Choice | | Program, Command, Business Function, Other |
| Description | `ppg_description` | Memo (2000) | | |

---

## 7. Stakeholder Role (`ppg_stakeholderrole`)

| Property | Value |
|---|---|
| Purpose | Roles a person can hold on a request or environment (Business Owner, Technical Owner, Data Owner, Security POC, Support Owner, and others). |
| Alternate keys | `ppg_rolecode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (100) | B | |
| Role Code | `ppg_rolecode` | Text (30) | B | Alternate key. Logic references the code, not the name |
| Required for Submission | `ppg_requiredforsubmission` | Yes/No | | Business Owner and Technical Owner |
| Required When Governed Data | `ppg_requiredwhengoverneddata` | Yes/No | | Data Owner |
| Required When Security Review Triggered | `ppg_requiredwhensecurityreview` | Yes/No | | Security POC. Asked by intake or the security review, never on the initial request form |
| Collected at Intake | `ppg_collectedatintake` | Yes/No | | Yes only for roles on the 10-item request (Business Owner, Technical Owner). Other roles are added later or conditionally |
| Max Active Per Request | `ppg_maxactive` | Whole Number | | Null means unlimited |
| Description | `ppg_description` | Memo (1000) | | |

---

## 11. Connector (`ppg_connector`)

| Property | Value |
|---|---|
| Purpose | Register of connectors (standard, premium, custom, other) with risk, approval status, and DLP grouping. Reference for Requested Connector. |
| Alternate keys | `ppg_connectorkey` (platform connector identifier, or an internal key for custom) |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | Display name |
| Connector Key | `ppg_connectorkey` | Text (200) | B | Alternate key |
| Connector Type | `ppg_connectortype` | Choice | B | Standard, Premium, Custom, Other |
| Publisher or Owner | `ppg_publisher` | Text (200) | | |
| Risk Level | `ppg_risklevel` | Choice | B | Low, Moderate, High. Definition of High is an organization decision (D5) |
| Is High Risk | `ppg_ishighrisk` | Yes/No | B | Escalation trigger |
| Approval Status | `ppg_approvalstatus` | Choice | B | Not Assessed, Approved, Approved with Conditions, Restricted, Blocked |
| Default DLP Grouping | `ppg_dlpgrouping` | Choice | | Business, Non-Business, Blocked |
| DLP Policy | `ppg_dlppolicyid` | Lookup (DLP Policy) | | |
| Authentication Model | `ppg_authmodel` | Choice | | OAuth, Basic, API Key, Windows, Managed Identity, Service Principal, None, Other |
| Supports Service Principal | `ppg_supportsserviceprincipal` | Yes/No | | |
| Endpoint Exposure | `ppg_endpointexposure` | Choice | | Internal, External, Both, Unknown |
| Premium License Required | `ppg_premiumrequired` | Yes/No | | |
| Availability Notes by Cloud | `ppg_cloudavailability` | Memo (2000) | | Availability in the target cloud. **GCV** |
| Last Assessed On | `ppg_lastassessedon` | Date Only | | |
| Assessment Reference | `ppg_assessmentref` | Text (URL, 500) | | Link to evidence |

Auditing: yes (approval status and risk changes). Retention: retain for life. Sensitive: none.

---

## 14. DLP Policy (`ppg_dlppolicy`)

| Property | Value |
|---|---|
| Purpose | Reference to DLP policies defined in the tenant. The app does not enforce DLP. It records which policy applies and the group each connector belongs to. |
| Alternate keys | `ppg_policykey` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Policy Key | `ppg_policykey` | Text (100) | B | Alternate key. Platform policy identifier or an internal key |
| Scope | `ppg_scope` | Choice | B | Tenant, Environment, Other |
| Applies to Families | N:N to Environment Family | | | Relationship `ppg_dlppolicy_environmentfamily` |
| Description | `ppg_description` | Memo (2000) | | |
| Policy Reference | `ppg_policyref` | Text (URL, 500) | | |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

---

## 36. Approval Rule (`ppg_approvalrule`)

| Property | Value |
|---|---|
| Purpose | Configurable routing rule. Evaluated in priority order against a request to decide required reviews and the decision authority. |
| Alternate keys | `ppg_rulecode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Rule Code | `ppg_rulecode` | Text (50) | B | Alternate key |
| Priority | `ppg_priority` | Whole Number | B | Lower is evaluated first |
| Trigger Type | `ppg_triggertype` | Choice | B | See trigger catalog in [../05-security.md](../05-security.md) |
| Condition Parameter | `ppg_conditionparameter` | Text (500) | | Structured value, such as a classification code or threshold |
| Condition JSON | `ppg_conditionjson` | Memo (10000) | | Optional structured condition for combined triggers. Validated by plug-in |
| Required Review Type | `ppg_reviewtypeid` | Lookup (Review Type) | | Review the rule adds |
| Decision Authority Type | `ppg_authoritytype` | Choice | B | Delegated Platform Authority, Governance Board, Security Authority, Other |
| Decision Authority Team | `ppg_authorityteamid` | Lookup (Team) | | |
| Escalates | `ppg_escalates` | Yes/No | B | Whether a match escalates beyond delegated authority |
| Applies to Family | `ppg_familyid` | Lookup (Environment Family) | | Null means all |
| Applies to Organization | `ppg_organizationid` | Lookup (Organization) | | Null means all |
| Effective From | `ppg_effectivefrom` | Date Only | | |
| Effective To | `ppg_effectiveto` | Date Only | | |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |
| Rationale | `ppg_rationale` | Memo (2000) | | Why the rule exists, for governance traceability |

Auditing: yes, all columns. Rule changes alter routing and need review.

---

## 37. Notification Rule (`ppg_notificationrule`)

| Property | Value |
|---|---|
| Purpose | Defines which events notify whom, by which channel, and with what timing. |
| Alternate keys | `ppg_rulecode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| Rule Code | `ppg_rulecode` | Text (50) | B | Alternate key |
| Event | `ppg_event` | Choice | B | Submitted, Returned for Information, Review Assigned, Review Overdue, Decision Recorded, Condition Expiring, Exception Expiring, Provisioning Task Assigned, Validation Reminder, Handoff, Lifecycle Review Due, Finding Due, Retirement Step |
| Recipient Type | `ppg_recipienttype` | Choice | B | Requestor, Business Owner, Technical Owner, Data Owner, Assigned Reviewer, Team, Mailbox |
| Recipient Team | `ppg_recipientteamid` | Lookup (Team) | | |
| Channel | `ppg_channel` | Choice | B | Email, Teams, Both. Channel availability **GCV** |
| Lead or Lag Days | `ppg_offsetdays` | Whole Number | | Set by the organization (no default in schema) |
| Template Reference | `ppg_templateref` | Text (200) | | Name of the message template |
| Enabled | `ppg_enabled` | Yes/No | B | |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

---

## 38. Naming Standard (`ppg_namingstandard`)

| Property | Value |
|---|---|
| Purpose | Naming pattern for environments. Applied when generating a Provisioned Environment display name and the provisioning task. |
| Alternate keys | `ppg_standardcode` |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (150) | B | |
| Standard Code | `ppg_standardcode` | Text (50) | B | Alternate key |
| Pattern | `ppg_pattern` | Text (300) | B | Tokens: `{FAMILY}`, `{TYPE}`, `{ORG}`, `{PROGRAM}`, `{APP}`, `{SEQ}`. Token list is fixed by the solution |
| Applies to Family | `ppg_familyid` | Lookup (Environment Family) | | |
| Applies to Type | `ppg_typeid` | Lookup (Environment Type) | | |
| Max Length | `ppg_maxlength` | Whole Number | | |
| Uppercase Tokens | `ppg_uppercase` | Yes/No | | |
| Example | `ppg_example` | Text (200) | | Documentation only |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

---

## 39. License Type (`ppg_licensetype`) (supplemental)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | |
| License Code | `ppg_licensecode` | Text (50) | B | Alternate key |
| License Category | `ppg_licensecategory` | Choice | | Per User, Per App, Pay As You Go, Capacity Add-on, Included Entitlement, Other |
| Is Premium | `ppg_ispremium` | Yes/No | | |
| Description | `ppg_description` | Memo (2000) | | |
| Availability Notes by Cloud | `ppg_cloudavailability` | Memo (1000) | | **GCV** |

Names and entitlements are reference data owned by the organization because licensing terms change.

---

## 40. Review Type (`ppg_reviewtype`) (supplemental)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (150) | B | |
| Review Code | `ppg_reviewcode` | Text (30) | B | Alternate key. Seed: GOV, SEC, LIC, CON, CMD |
| Default Reviewer Team | `ppg_defaultteamid` | Lookup (Team) | | |
| Default Request Status Reason | `ppg_requeststatus` | Choice | | Which request status reason the review maps to |
| Status Priority | `ppg_statuspriority` | Whole Number | | Used when several reviews are open |
| Due Offset (days) | `ppg_dueoffsetdays` | Whole Number | | Organization-set service target. No schema default |
| Description | `ppg_description` | Memo (1000) | | |

---

## 41. Provisioning Task Template (`ppg_provisioningtasktemplate`) (supplemental)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (200) | B | For example "Associate security group" |
| Template Code | `ppg_templatecode` | Text (50) | B | Alternate key |
| Task Category | `ppg_taskcategory` | Choice | B | Provisioning, Configuration, Validation, Handoff |
| Applies to Family | `ppg_familyid` | Lookup (Environment Family) | | |
| Applies to Type | `ppg_typeid` | Lookup (Environment Type) | | |
| Condition Parameter | `ppg_conditionparameter` | Text (500) | | For example only when Managed Environment is required |
| Sequence | `ppg_sequence` | Whole Number | B | |
| Execution Mode | `ppg_executionmode` | Choice | B | Manual, Automated, Hybrid |
| Automation Dependency | `ppg_automationdependency` | Text (300) | | Platform capability needed. **GCV** |
| Requires Evidence | `ppg_requiresevidence` | Yes/No | | |
| Blocks Production Until Test Validated | `ppg_gatesproduction` | Yes/No | | |
| Default Assignee Team | `ppg_defaultteamid` | Lookup (Team) | | |
| Instruction | `ppg_instruction` | Memo (4000) | | Operator guidance |

---

## 44. Intake Option (`ppg_intakeoption`) (supplemental)

| Property | Value |
|---|---|
| Purpose | Plain-language answer choices shown on the requestor form (data types, capabilities, workload types) and the Stage 2 impact question. Each option carries the mapping that lets governance derive classification, reviews, and routing, so requestors do not need to understand the underlying models. |
| Ownership | Organization |
| Category | Configuration |
| Primary name | `ppg_name` (Text 200), the label the requestor sees |
| Alternate keys | `ppg_optiongroup` + `ppg_optioncode` |
| Audit | Yes. Mappings drive routing |
| Seed | Examples below are USMC-neutral starter values. Wording is configured by the implementing organization |

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Label | `ppg_name` | Text (200) | B | Plain language shown to requestor |
| Option Group | `ppg_optiongroup` | Choice | B | Data Type, Capability, Workload Type, Impact |
| Option Code | `ppg_optioncode` | Text (50) | B | Logic references the code |
| Help Text | `ppg_helptext` | Memo (1000) | | Shown beside the option |
| Sort Order | `ppg_sortorder` | Whole Number | | |
| Is Unknown Option | `ppg_isunknown` | Yes/No | | Marks "I don't know" or "Not sure". Selecting it creates a pending determination for intake. It never blocks submission |
| Minimum Data Classification | `ppg_mindataclassificationid` | Lookup (Data Classification) | | Data Type group. Drives the recommended data classification |
| Suggests Application Classification | `ppg_suggestedappclassificationid` | Lookup (Application Classification) | | Impact group |
| Suggested Family | `ppg_suggestedfamilyid` | Lookup (Environment Family) | | Workload Type group |
| Triggers Review Type | `ppg_triggerreviewtypeid` | Lookup (Review Type) | | For example a sensitive data type triggers the security review. A capability such as Dataverse triggers licensing and capacity review |
| Sets Premium Flag | `ppg_setspremium` | Yes/No | | Capability group |
| Sets AI Flag | `ppg_setsai` | Yes/No | | Capability group |
| Sets Integration Flag | `ppg_setsintegration` | Yes/No | | Capability group. Prompts integration detail |
| Sets Custom Connector Flag | `ppg_setscustomconnector` | Yes/No | | Capability group. Escalation trigger |
| Prompts Data Owner | `ppg_promptsdataowner` | Yes/No | | Data Type group. Shows the Data Owner field |
| Prompts Authorization Question | `ppg_promptsauthquestion` | Yes/No | | Data Type group |
| Active | system `statecode` | State | | |

Example options (illustrative, configurable):

| Group | Label |
|---|---|
| Data Type | Public or releasable information |
| Data Type | Internal business information |
| Data Type | Personally identifiable information (PII) |
| Data Type | Controlled unclassified information (CUI) |
| Data Type | Mission-sensitive information |
| Data Type | I don't know |
| Capability | Dataverse |
| Capability | Power Pages |
| Capability | AI or Copilot Studio |
| Capability | External system integration |
| Capability | Custom connector or API |
| Capability | Not sure |
| Workload Type | Personal productivity or individual developer |
| Workload Type | Team or office application |
| Workload Type | Command or program application |
| Workload Type | Shared service for multiple organizations |
| Workload Type | Platform or enterprise capability |
| Workload Type | Not sure |
| Impact | Impact question answers, wording defined by the organization (decision D13) |

The option-to-classification mappings are governance content. They are reviewed and approved by the Governance Board, not invented by the build team.

---

## 42. Number Sequence (`ppg_numbersequence`) (supplemental)

| Column | Schema | Type | Req | Notes |
|---|---|---|---|---|
| Name | `ppg_name` | Text (100) | B | |
| Sequence Key | `ppg_sequencekey` | Text (100) | B | Alternate key, for example `<prefix>-<year>` |
| Prefix | `ppg_prefix` | Text (10) | B | |
| Year | `ppg_year` | Whole Number | | Null for non-annual |
| Last Value | `ppg_lastvalue` | Whole Number | B | Incremented atomically by plug-in |
| Organization Configuration | `ppg_organizationconfigurationid` | Lookup | B | |

Restricted write: only the number-generation plug-in identity updates `ppg_lastvalue`. See [../08-automation.md](../08-automation.md).
