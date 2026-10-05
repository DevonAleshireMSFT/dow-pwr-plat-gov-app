// Source of truth for the implementation backlog (deliverable 26) and user stories (deliverable 25).
// docs/11-delivery.md sections 25 and 26 are generated from this file by tools/gen-backlog-md.js.
// tools/create-issues.js creates the GitHub issues and adds them to the project.
// phase: "MVP" (milestone M2 MVP Solution) | "P2" (M3 Phase 2). A feature phase overrides its epic phase.

const epics = [
  {
    id: "E01", title: "Foundation, Configuration, and Seed Data", phase: "MVP", labels: ["dataverse", "mvp"],
    summary: "Core data model, configuration and reference tables, Organization Configuration, Intake Options, and the optional USMC seed package.",
    features: [
      {
        id: "F-DATAMODEL", title: "Core data model", trace: ["GR-12"], labels: ["dataverse"],
        stories: [
          { id: "S-DM-01", title: "Create publisher and Core Data Model solution", story: "As a solution developer, I want a publisher and the Core Data Model solution so that all tables live in one governed layer.", ac: ["Publisher with prefix ppg exists and is documented", "Solution ppg_core is unmanaged in dev and exported unpacked to solutions/ppg_core", "Solution passes solution checker with no critical issues"] },
          { id: "S-DM-02", title: "Build configuration and reference tables", story: "As a platform administrator, I want the configuration and reference tables so that organization-specific values are data, not code.", ac: ["Tables 4, 5, 7, 9, 10, 11, 14, 33 to 42 and 44 exist with the columns, types, and alternate keys in docs/04-data-model/config-reference.md", "Organization-owned ownership is set", "No organization name appears in any schema name or label"] },
          { id: "S-DM-03", title: "Build request-domain tables", story: "As a solution developer, I want the request-domain tables so that request data is normalized.", ac: ["Tables 1, 2, 6, 8, 12, 13, 15, 16, 17, 18, 25, 31, 32 exist per docs/04-data-model/request.md", "Lookups and N:N relationships match docs/04-data-model/relationships.md", "Requestor-provided and derived columns are separated as in the dictionary"] },
          { id: "S-DM-04", title: "Build review, approval, and exception tables", story: "As a solution developer, I want the review and approval tables so that each review keeps its own state.", ac: ["Tables 19 to 22 exist per docs/04-data-model/review-approval.md", "Status reason values match the dictionary"] },
          { id: "S-DM-05", title: "Build provisioning, inventory, and lifecycle tables", story: "As a solution developer, I want the inventory and lifecycle tables so that environments persist beyond requests.", ac: ["Tables 3, 23, 24, 26 to 30 and 43 exist per docs/04-data-model/provisioning-lifecycle.md", "Provisioned Environment links to the originating Request and Requested Environment"] },
          { id: "S-DM-06", title: "Enable auditing on governed tables", story: "As an auditor, I want auditing enabled so that governance changes are traceable.", ac: ["Table and column auditing are enabled as listed in docs/09-audit-reporting.md", "Audit data is visible to the Auditor role only"] },
        ],
      },
      {
        id: "F-ORGCONFIG", title: "Organization Configuration and reference administration", trace: ["GR-02", "GR-03"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-OC-01", title: "Organization Configuration record and form", story: "As an implementation team member, I want to configure organization terminology, boundary, cadence, naming, number format, and notification settings so that the app fits my organization.", ac: ["All fields in the Organization Configuration dictionary are on the form", "Only one active record is allowed", "Changing terminology changes labels where configured without a solution update"] },
          { id: "S-OC-02", title: "Environment family and type administration", story: "As a platform administrator, I want to define families and types so that environment structure is configurable.", ac: ["Families and types can be added and deactivated", "A family cannot be saved active without at least one type", "Types support predecessor, production-class, optional, and default-included flags"] },
          { id: "S-OC-03", title: "Classification administration", story: "As a governance board member, I want configurable application and data classifications with ranks so that the most restrictive rule works for any organization.", ac: ["Classifications have a unique rank and code", "Data classification supports governed, sensitive, high-impact, and not-supported flags"] },
          { id: "S-OC-04", title: "Stakeholder role, review type, and license type administration", story: "As a platform administrator, I want to maintain roles, review types, and license types as reference data.", ac: ["Role codes drive logic, names are labels", "Review types carry default reviewer team and due offset with no schema default"] },
        ],
      },
      {
        id: "F-INTAKEOPT", title: "Intake Option configuration", trace: ["GR-02", "GR-06"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-IO-01", title: "Intake Option table, form, and views", story: "As a platform administrator, I want to configure the plain-language answer options and their governance mappings so that requestors never see classification labels.", ac: ["Option groups Data Type, Capability, Workload Type, and Impact exist", "Mappings to classification, family, review type, and flags are editable", "Unknown options are flaggable"] },
          { id: "S-IO-02", title: "Intake Option mapping validation", story: "As a governance board member, I want invalid or incomplete mappings flagged so that routing cannot silently fail.", ac: ["A warning shows when an option group has no unknown option", "A warning shows when a data-type option lacks a minimum classification"] },
        ],
      },
      {
        id: "F-SEED", title: "USMC example seed package", trace: ["GR-04", "GR-02"], labels: ["dataverse"],
        stories: [
          { id: "S-SD-01", title: "Seed package structure and upsert script", story: "As an implementation team member, I want a separable seed package using alternate keys so that I can import, replace, or skip the USMC examples.", ac: ["Seed lives in seed/ and is not part of any solution", "Re-running the import does not create duplicates", "A non-USMC sample seed imports cleanly"] },
          { id: "S-SD-02", title: "USMC seed values", story: "As a USMC implementer, I want the USMC defaults as starting configuration.", ac: ["Organization, boundary, platform team, governance board, and security reviewer terms are seeded as configuration values", "Families Platform, Shared Services, Command Hub, Program, Individual Developer, Default with their types are seeded", "Application and data classifications from the spec are seeded with ranks", "Seeded values are labeled as examples"] },
          { id: "S-SD-03", title: "Seed Intake Options, approval rules, and task templates", story: "As an implementer, I want example Intake Options, escalation rules T1 to T16, and provisioning task templates so that I can start from a working baseline.", ac: ["Example options and rules match docs/03a and docs/05", "Rules are marked as examples pending governance board approval"] },
        ],
      },
      {
        id: "F-ENVVARS", title: "Environment variables and connection references", trace: ["GR-34"], labels: ["alm"],
        stories: [
          { id: "S-EV-01", title: "Define environment variables", story: "As a release manager, I want environment variables for deployment-specific values so that no endpoint is hard-coded.", ac: ["Variables listed in docs/10-alm-govcloud.md are defined", "No variable holds a secret value in the solution"] },
        ],
      },
    ],
  },
  {
    id: "E02", title: "Requestor Intake and Request Management", phase: "MVP", labels: ["dataverse", "app-ui", "mvp"],
    summary: "The simple 10-item request, immutable request number, submission, return for information, withdraw, resubmission, and history.",
    features: [
      {
        id: "F-REQNUM", title: "Immutable request identifier", trace: ["GR-13"], labels: ["automation"],
        stories: [
          { id: "S-RN-01", title: "Request number plug-in", story: "As a requestor, I want a unique request number on creation so that I can reference my request.", ac: ["Number format comes from Organization Configuration", "Number contains no status or organization name", "Concurrent creates never produce duplicates", "Number cannot be changed after creation"] },
          { id: "S-RN-02", title: "Number Sequence maintenance", story: "As a platform administrator, I want sequences per prefix and year so that numbering restarts as configured.", ac: ["A new year creates a new sequence row", "Only the automation identity can update the last value"] },
        ],
      },
      {
        id: "F-INTAKEFORM", title: "Requestor 10-item request form", trace: ["GR-06"], labels: ["app-ui"],
        stories: [
          { id: "S-IF-01", title: "Requestor quick-create and main form", story: "As a requestor, I want a short form with plain-language questions so that I can request an environment without knowing governance terms.", ac: ["The form shows exactly the 10 intake items plus title", "Classification, licensing, security, and review fields are not visible", "Help text comes from Intake Option"] },
          { id: "S-IF-02", title: "Conversational data type and capability questions", story: "As a requestor, I want to answer what kind of information and capabilities I need, including I don't know, so that I am not blocked.", ac: ["Data type and capability multi-selects include unknown options", "Selecting an unknown option does not block submission"] },
          { id: "S-IF-03", title: "Conditional prompts", story: "As a requestor, I want follow-up questions only when relevant so that the form stays short.", ac: ["Systems summary appears when connects to another system is Yes or Not Sure", "End date is required when duration is Temporary", "Authorization-boundary question appears per rules and allows Unknown", "Data Owner appears when the data types prompt it"] },
          { id: "S-IF-04", title: "Workload type drives recommended family", story: "As a requestor, I want to say what kind of workload I have and see a recommended environment family so that I do not choose Dev, Test, or Production.", ac: ["Selecting a workload type prefills the recommended family", "I can accept, change, or leave it as Not sure", "No stage selection is shown to the requestor"] },
          { id: "S-IF-05", title: "Business and technical owner capture", story: "As a requestor, I want to name the business and technical owners so that accountability is recorded.", ac: ["Selections create Stakeholder Assignment records", "Both are required to submit", "A person can be a user or a contact"] },
        ],
      },
      {
        id: "F-SUBMIT", title: "Submission and request lifecycle actions", trace: ["GR-14"], labels: ["automation", "app-ui"],
        stories: [
          { id: "S-SB-01", title: "Submission validation", story: "As a requestor, I want a clear list of what is missing when I submit so that I can fix it.", ac: ["Submit validates the 10 items and lists failures in plain language", "Unknown answers pass validation", "On success status is Submitted and ownership moves to the intake queue"] },
          { id: "S-SB-02", title: "Return for information and resubmit", story: "As a requestor, I want to see the specific question returned to me and answer it so that my request continues.", ac: ["A rationale and question are required to return a request", "I see the question in My Work and can reply and resubmit", "History records each return and resubmission"] },
          { id: "S-SB-03", title: "Withdraw and cancel", story: "As a requestor, I want to withdraw my request so that it stops processing.", ac: ["Withdraw requires a rationale and is allowed from Draft, Submitted, and Returned", "Cancel by an authorized role requires a rationale", "Terminal statuses block further edits"] },
          { id: "S-SB-04", title: "Resubmission after rejection", story: "As a requestor, I want to start a new request from a rejected one so that I keep context.", ac: ["A new request references the prior request", "The rejected request is not reopened"] },
        ],
      },
      {
        id: "F-STATUS", title: "Status model and business process flow", trace: ["GR-14", "GR-15"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-ST-01", title: "Request status reasons", story: "As an intake analyst, I want the defined status reasons so that requests are consistently tracked.", ac: ["Status reasons match docs/03-process.md", "Terminal statuses are Inactive state"] },
          { id: "S-ST-02", title: "Business process flow", story: "As a user, I want a staged process bar so that I know where a request is.", ac: ["Ten stages exist per docs/03-process.md", "Stage 1 requires only the 10 intake items", "Return paths move to the defined earlier stage"] },
          { id: "S-ST-03", title: "Status synchronization", story: "As an intake analyst, I want request status to reflect review and task states so that I do not update it by hand.", ac: ["Open reviews set status by priority", "All reviews complete moves to Pending Approval", "Terminal statuses are never overwritten"] },
        ],
      },
      {
        id: "F-REQENV", title: "Requested Environment and Application", trace: ["GR-07"], labels: ["dataverse"],
        stories: [
          { id: "S-RE-01", title: "Generate requested environment stage records", story: "As an intake analyst, I want stage records generated from the confirmed family so that a request can produce an environment set.", ac: ["Default-included types become Requested Environment rows", "Optional types require a justification", "One request can have zero, one, or many provisioned environments"] },
          { id: "S-RE-02", title: "Application or workload record", story: "As a technical owner, I want to create or match an application record so that environments tie to a persistent workload.", ac: ["An application can be reused across requests", "Program Core indicator fields are on the application and request"] },
        ],
      },
      {
        id: "F-HISTORY", title: "Request history and comments", trace: ["GR-35"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-HI-01", title: "Append-only request history", story: "As an auditor, I want a business-readable append-only history so that I can reconstruct what happened.", ac: ["Status changes, decisions, returns, and automation actions create entries", "No role can update or delete entries", "Automation entries are marked as automation"] },
          { id: "S-HI-02", title: "Comments", story: "As a reviewer, I want to add comments so that discussion is retained.", ac: ["Comments create history entries", "Platform-only comments are hidden from the requestor"] },
        ],
      },
    ],
  },
  {
    id: "E03", title: "Classification, Routing, and Reviews", phase: "MVP", labels: ["dataverse", "automation", "mvp"],
    summary: "Derived classifications, intake confirmation, rules-driven review generation, and review records with independent state.",
    features: [
      {
        id: "F-CLASSDERIVE", title: "Classification derivation and intake confirmation", trace: ["GR-10", "GR-11"], labels: ["automation", "app-ui"],
        stories: [
          { id: "S-CD-01", title: "Derive recommended classifications", story: "As an intake analyst, I want recommended data and application classifications from the requestor answers so that I can confirm rather than start from scratch.", ac: ["Recommended data classification is the highest minimum among selected data types", "Unknown answers set the pending flag", "Effective rank is the greater of the two ranks, with the conservative default when unconfirmed"] },
          { id: "S-CD-02", title: "Intake confirm step", story: "As an intake analyst, I want to confirm or change classification and family so that routing is based on a human decision.", ac: ["Confirming requires the classifications and family", "A change from the recommendation requires triage notes", "Changes are recorded in history"] },
          { id: "S-CD-03", title: "Not-supported data handling", story: "As a governance board member, I want not-supported data routed to a human decision so that nothing is auto-rejected.", ac: ["A warning and decision task are created", "The request cannot reach Pending Approval without a recorded human decision"] },
        ],
      },
      {
        id: "F-REVGEN", title: "Rules-driven review generation", trace: ["GR-16"], labels: ["automation"],
        stories: [
          { id: "S-RG-01", title: "Review Requirement generation", story: "As an intake analyst, I want required reviews generated from rules and intake option triggers so that not every request gets every review.", ac: ["Review Requirements are created with basis and reason", "Generation is idempotent", "Generation is blocked until classifications and family are confirmed"] },
          { id: "S-RG-02", title: "Governance Review records", story: "As a reviewer, I want a review record with my own status, outcome, conditions, and completion date.", ac: ["Each required review type has a Governance Review row", "Review status is independent of request status", "Completed reviews require a completion date"] },
          { id: "S-RG-03", title: "Waive a review requirement", story: "As an authorized role, I want to waive a non-mandatory review with a rationale so that unnecessary work is avoided.", ac: ["Waiver requires a rationale", "Mandatory escalation reviews cannot be waived by intake"] },
        ],
      },
      {
        id: "F-PROGCORE", title: "Program Core recommendation", trace: ["GR-09"], labels: ["automation", "app-ui"],
        stories: [
          { id: "S-PC-01", title: "Program Core indicators and recommendation", story: "As a technical owner, I want to answer the architectural indicators so that the app can suggest whether Program Core is warranted.", ac: ["Importance, mission criticality, and longevity are not indicators", "Recommendation values are Recommended, Not Recommended, or Insufficient Information", "Only shown for the Program family"] },
          { id: "S-PC-02", title: "Authorized reviewer decision", story: "As an authorized reviewer, I want to include or exclude Program Core with a rationale so that the final decision is human.", ac: ["Rationale is required when the decision differs from the recommendation", "Decision, user, and date are recorded"] },
        ],
      },
      {
        id: "F-REVUI", title: "Review work queues and forms", trace: ["GR-29"], labels: ["app-ui"],
        stories: [
          { id: "S-RU-01", title: "Review queues by type", story: "As a reviewer, I want queues for my review type so that I can find my work.", ac: ["Views exist for Security, Licensing and Capacity, Connector and DLP, Governance", "My Reviews and Overdue Reviews views exist"] },
        ],
      },
    ],
  },
  {
    id: "E04", title: "Technical, Licensing, and Security Assessment", phase: "MVP", labels: ["dataverse", "security", "mvp"],
    summary: "Connector register, requested connectors, external integrations, licensing, capacity, security requirements, authorization boundaries, and support plan.",
    features: [
      {
        id: "F-CONNREG", title: "Connector register and DLP policy reference", trace: ["GR-18"], labels: ["dataverse"],
        stories: [
          { id: "S-CR-01", title: "Connector register", story: "As a Connector and DLP reviewer, I want a register of connectors with risk, status, and DLP grouping so that decisions are consistent.", ac: ["Register holds type, publisher, risk, high-risk flag, approval status, DLP grouping", "Approval status and risk changes are audited"] },
          { id: "S-CR-02", title: "DLP policy reference", story: "As a Connector and DLP reviewer, I want DLP policies recorded as reference so that environments and connectors link to them.", ac: ["Policies can apply to families through N:N", "The app does not claim to enforce DLP"] },
        ],
      },
      {
        id: "F-REQCONN", title: "Requested connectors and external integrations", trace: ["GR-18"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-RC-01", title: "Requested Connector assessment", story: "As a Connector and DLP reviewer, I want request-specific connector records so that I can assess and decide each connector.", ac: ["Record captures the attributes in the spec", "Existing approval status is copied from the register", "Stages are linked through N:N", "Decision expiration is required for conditional decisions"] },
          { id: "S-RC-02", title: "External Integration records", story: "As a technical owner, I want to record each integration so that it is assessed.", ac: ["All 17 integration attributes are captured", "Integrations can depend on connectors through N:N", "No credentials are accepted in free text"] },
          { id: "S-RC-03", title: "Connector and integration escalation flags", story: "As a governance board member, I want high-risk, custom, external-facing, and cross-program items to escalate so that they are decided at the right level.", ac: ["Flags set escalation reasons on the request", "Rules T3 to T6 and T10 are evaluated"] },
        ],
      },
      {
        id: "F-LICCAP", title: "Licensing and capacity assessment", trace: ["GR-19"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-LC-01", title: "Licensing Requirement and License Type", story: "As a Licensing and Capacity reviewer, I want licensing records with configurable license types so that I can assess entitlement and funding.", ac: ["Users by role, makers, application users, license type, entitlement, and funding owner are captured", "Outcome and decision notes are recorded", "The requestor is not asked for licensing detail"] },
          { id: "S-LC-02", title: "Capacity Estimate", story: "As a Licensing and Capacity reviewer, I want database, file, and log estimates per Dataverse environment so that I can plan capacity.", ac: ["An estimate is required for each Dataverse requested environment", "Capacity above the configured threshold raises escalation"] },
        ],
      },
      {
        id: "F-SECREQ", title: "Security requirement and authorization boundary", trace: ["GR-20"], labels: ["dataverse", "security"],
        stories: [
          { id: "S-SR-01", title: "Authorization Boundary records", story: "As a security reviewer, I want reusable authorization boundary records so that requests and environments link to the right boundary.", ac: ["Existing or New or Changed, status, owner, and POCs are captured", "Terminology labels follow Organization Configuration", "Unknown is allowed at intake"] },
          { id: "S-SR-02", title: "Security Requirement record", story: "As a security reviewer, I want a structured security requirement record so that I can document needs and outcome.", ac: ["All spec attributes are captured", "Sensitive columns use the Security Detail column profile", "No secret, password, certificate, key, or token is accepted in text columns"] },
          { id: "S-SR-03", title: "Security review requirement for sensitive data", story: "As a security authority, I want security review required for sensitive-data requests so that none bypasses review.", ac: ["Sensitive data classification generates a Security Review Requirement", "Authorization information is required before the security review completes for CUI and sensitive workloads"] },
        ],
      },
      {
        id: "F-SUPPORT", title: "Support and Sustainment Plan", trace: ["GR-21"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-SP-01", title: "Structured support plan", story: "As a technical owner, I want a structured support plan so that support and recovery are defined.", ac: ["All 20 spec attributes are captured", "RTO and RPO are required when the classification requires them", "No secrets are stored"] },
          { id: "S-SP-02", title: "Support plan required before Production approval", story: "As a platform administrator, I want Production approval blocked without a support plan so that nothing runs unsupported.", ac: ["An approval decision for a production-class stage fails without a complete plan", "The plan is not required to submit"] },
        ],
      },
      {
        id: "F-DOCS", title: "Supporting documents and SharePoint links", trace: ["GR-22"], labels: ["dataverse", "app-ui", "gov-cloud-validate"],
        stories: [
          { id: "S-DC-01", title: "Supporting Document metadata and link", story: "As a reviewer, I want to attach evidence links with a document type so that evidence is findable.", ac: ["A document record holds type, URL, version, and regarding record", "Dataverse stores no file content", "At least one regarding lookup is required"] },
          { id: "S-DC-02", title: "SharePoint folder creation flow", story: "As a platform administrator, I want a folder created per request so that documents are organized.", ac: ["Folder is created from the request number", "Depends on validation of SharePoint integration (gov-cloud-validate)"] },
        ],
      },
    ],
  },
  {
    id: "E05", title: "Approvals, Decisions, and Exceptions", phase: "MVP", labels: ["dataverse", "automation", "mvp"],
    summary: "Configurable approval routing, decisions, conditional approval tracking, and governance exceptions.",
    features: [
      {
        id: "F-ROUTING", title: "Approval routing rules", trace: ["GR-01", "GR-17", "GR-11"], labels: ["automation"],
        stories: [
          { id: "S-AR-01", title: "Approval Rule evaluation", story: "As a platform administrator, I want configurable approval rules so that routine requests go to delegated authority and escalated ones go higher.", ac: ["Rules evaluate in priority order", "Triggers T1 to T16 are supported and individually activatable", "A fallback authority is used if nothing matches"] },
          { id: "S-AR-02", title: "Escalation flags and reasons", story: "As a governance board member, I want to see why a request was escalated so that I can decide efficiently.", ac: ["Escalation reasons are shown on the request and snapshot on the decision"] },
          { id: "S-AR-03", title: "Approval rule test dialog", story: "As a platform administrator, I want to preview which rules match a sample request so that I can test rule changes.", ac: ["Dialog lists matched rules, reviews, and authority for a chosen request"] },
        ],
      },
      {
        id: "F-DECISION", title: "Approval decisions", trace: ["GR-17"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-AD-01", title: "Record a decision", story: "As an approver, I want to record Approve, Approve with conditions, Reject, Return, Withdraw, or Cancel so that the outcome is recorded.", ac: ["Authority, approver, date, rationale, conditions, expiration, related review, exception, and evidence are captured", "Rationale is required for Reject, Return, Cancel, Withdraw", "Conditions and a review or expiration date are required for Approve with conditions", "The approver cannot be the requestor"] },
          { id: "S-AD-02", title: "Decision immutability", story: "As an auditor, I want decisions to be append-only so that history cannot be altered.", ac: ["Decisions cannot be edited or deleted after creation", "A new decision supersedes without overwriting"] },
          { id: "S-AD-03", title: "Conditional approval tracking", story: "As a platform administrator, I want conditions tracked with reminders so that conditions are met or expire visibly.", ac: ["Condition status Open, Met, Expired, Waived", "Reminders before the review date", "Expired conditions create a finding"] },
        ],
      },
      {
        id: "F-EXCEPTION", title: "Governance exceptions", trace: ["GR-17"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-EX-01", title: "Exception record and workflow", story: "As a governance board member, I want time-bound exceptions with compensating controls so that deviations are controlled.", ac: ["Approved exceptions require an expiration date", "Exceptions can link to requests, environments, and connectors"] },
          { id: "S-EX-02", title: "Expiring exceptions view and reminders", story: "As a security reviewer, I want expiring exceptions surfaced so that they are renewed or closed.", ac: ["Expiring Exceptions view uses the configured window", "Reminders go to the risk owner and authority"] },
        ],
      },
    ],
  },
  {
    id: "E06", title: "Provisioning, Validation, and Inventory", phase: "MVP", labels: ["dataverse", "app-ui", "mvp"],
    summary: "Provisioning tasks from templates (manual first), post-provisioning validation, handoff, and the environment inventory.",
    features: [
      {
        id: "F-PROVTASK", title: "Provisioning task generation and execution", trace: ["GR-23"], labels: ["automation", "app-ui", "gov-cloud-validate"],
        stories: [
          { id: "S-PT-01", title: "Task templates", story: "As a platform administrator, I want provisioning task templates per family and type so that tasks are consistent.", ac: ["Templates include the activities listed in the spec", "Each template has execution mode and automation dependency flagged for validation"] },
          { id: "S-PT-02", title: "Generate tasks on approval", story: "As a provisioner, I want tasks generated when a request is approved so that I have a work list.", ac: ["One task per required activity per requested environment", "Generation is idempotent", "Naming standard is applied to the proposed name"] },
          { id: "S-PT-03", title: "Complete tasks with evidence", story: "As a provisioner, I want to complete tasks with evidence so that provisioning is traceable.", ac: ["Tasks requiring evidence cannot complete without a linked document", "Completion records user and time"] },
          { id: "S-PT-04", title: "Test before Production gate", story: "As a platform administrator, I want Production provisioning blocked until required Test validation is complete.", ac: ["Production tasks cannot start until Test validation tasks pass", "The block message names the missing validation"] },
        ],
      },
      {
        id: "F-VALID", title: "Post-provisioning validation and handoff", trace: ["GR-24"], labels: ["app-ui"],
        stories: [
          { id: "S-VL-01", title: "Validation checklist tasks", story: "As a provisioner, I want the 18 validation checks as tasks so that I confirm the environment is correct.", ac: ["Checks generated from templates", "Result is Pass, Fail, Accepted with Exception, or Not Applicable"] },
          { id: "S-VL-02", title: "Owner handoff acceptance", story: "As a business owner and technical owner, I want to accept handoff so that responsibility is explicit.", ac: ["Both owners record acceptance", "Support and runbook locations must be recorded first"] },
          { id: "S-VL-03", title: "Completion guard", story: "As an auditor, I want a request completed only with environment records and validation evidence.", ac: ["Completion fails if no Provisioned Environment exists, validation evidence is missing, a validation task failed, or handoff is not accepted"] },
        ],
      },
      {
        id: "F-PROVENV", title: "Environment inventory and configuration", trace: ["GR-07", "GR-23"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-PE-01", title: "Provisioned Environment record", story: "As a platform administrator, I want an inventory record for every environment so that I can govern it.", ac: ["Record holds ID, URL, family, type, region, boundary, classifications, owners", "Linked to the originating request and requested environment"] },
          { id: "S-PE-02", title: "Environment Configuration items", story: "As a provisioner, I want to record configuration items and their verification so that drift is visible.", ac: ["Items support the configuration types in the dictionary", "Values are names or identifiers only"] },
          { id: "S-PE-03", title: "Inventory views", story: "As a platform administrator, I want inventory views by family, organization, classification, review due, ownerless, and retirement recommended.", ac: ["Family views are generated from configuration, not hard-coded names"] },
        ],
      },
    ],
  },
  {
    id: "E07", title: "Security Model and Audit", phase: "MVP", labels: ["security", "mvp"],
    summary: "Security roles, column security, separation of duties, and audit.",
    features: [
      {
        id: "F-ROLES", title: "Security roles and column security", trace: ["GR-28"], labels: ["security"],
        stories: [
          { id: "S-RL-01", title: "Create the 14 security roles", story: "As a security architect, I want least-privilege roles so that each persona has only what they need.", ac: ["Roles and privileges match docs/05-security.md", "No role has Delete on transactional governance tables", "Roles are assigned to teams mapped to Entra groups"] },
          { id: "S-RL-02", title: "Column security profiles", story: "As a security reviewer, I want sensitive columns protected so that only the right roles see them.", ac: ["Security Detail, Authorization Detail, Funding Detail, Stakeholder Contact, and Exception Justification profiles exist"] },
          { id: "S-RL-03", title: "Role test suite", story: "As a quality engineer, I want automated role tests so that privileges do not regress.", ac: ["Each role is tested for allowed and prohibited actions", "Requestor cannot see classification, security, or review internals"] },
        ],
      },
      {
        id: "F-SOD", title: "Separation of duties enforcement", trace: ["GR-28"], labels: ["security", "automation"],
        stories: [
          { id: "S-SD-10", title: "Integrity and separation-of-duties plug-in", story: "As an auditor, I want separation-of-duties rules enforced on the server so that API or flow access cannot bypass them.", ac: ["Requestor cannot approve or review own request", "Security reviewer cannot be the technical owner or provisioner of the same request", "Finding owner cannot be the closure approver", "Immutable fields cannot be altered", "Secret-pattern check blocks obvious secrets in text columns"] },
        ],
      },
      {
        id: "F-AUDIT", title: "Audit and evidence configuration", trace: ["GR-35"], labels: ["security", "gov-cloud-validate"],
        stories: [
          { id: "S-AU-01", title: "Audit configuration and export procedure", story: "As an auditor, I want auditing configured and an export procedure documented so that evidence can be retained.", ac: ["Auditing is configured per docs/09-audit-reporting.md", "Export and retention procedure is documented, with gov-cloud validation items noted"] },
        ],
      },
    ],
  },
  {
    id: "E08", title: "Model-Driven App Experience", phase: "MVP", labels: ["app-ui", "mvp"],
    summary: "App module, sitemap, forms, views, charts, dashboards, command bar actions, and accessibility.",
    features: [
      {
        id: "F-APP", title: "App module and sitemap", trace: ["GR-29"], labels: ["app-ui"],
        stories: [
          { id: "S-AP-01", title: "App module and role-secured sitemap", story: "As a user, I want to see only the areas relevant to me so that navigation is simple.", ac: ["Seven areas exist per docs/07-app-design.md", "A requestor sees only My Work and New Request"] },
          { id: "S-AP-02", title: "Main forms for core tables", story: "As an internal user, I want well-organized forms so that I can work efficiently.", ac: ["Environment Request form has the tabs defined in docs/07-app-design.md", "Business rules show and hide fields by answer"] },
          { id: "S-AP-03", title: "Command bar actions", story: "As a user, I want guarded actions such as Submit, Record Decision, and Mark Completed so that processes are enforced.", ac: ["Actions are visible only to the relevant roles and statuses", "Guards show a readable failure list"] },
          { id: "S-AP-04", title: "Views and charts", story: "As a user, I want views and charts per queue so that I can see my work.", ac: ["Views listed in docs/07-app-design.md exist", "Charts exist for the MVP KPIs"] },
        ],
      },
      {
        id: "F-A11Y", title: "Accessibility and usability", trace: ["GR-33"], labels: ["app-ui", "accessibility"],
        stories: [
          { id: "S-AC-01", title: "Accessibility verification", story: "As a user with assistive technology, I want the app to be keyboard and screen-reader usable.", ac: ["Requestor and reviewer forms pass a keyboard and screen-reader test", "Status and severity are not conveyed by color alone"] },
        ],
      },
    ],
  },
  {
    id: "E09", title: "Automation", phase: "MVP", labels: ["automation", "mvp"],
    summary: "Notifications and scheduled automations running under service identities.",
    features: [
      {
        id: "F-AUTONOTIFY", title: "Notifications and reminders", trace: ["GR-30"], labels: ["automation", "gov-cloud-validate"],
        stories: [
          { id: "S-AN-01", title: "Notification Rule engine", story: "As a platform administrator, I want configurable notification rules so that messages follow policy.", ac: ["Events, recipients, channel, and offsets come from Notification Rule", "Email works as the baseline channel"] },
          { id: "S-AN-02", title: "Return-for-information notification", story: "As a requestor, I want to be notified when a question is returned.", ac: ["Message includes the question and a link", "Failure creates an intake task"] },
          { id: "S-AN-03", title: "Overdue review escalation and reminders", story: "As a platform administrator, I want overdue reviews and tasks escalated so that nothing stalls.", ac: ["Escalation follows the Notification Rule levels", "Due offsets come from configuration"] },
          { id: "S-AN-04", title: "Handoff notifications", story: "As an owner, I want a handoff notification with the environment details.", ac: ["Message includes URL, support plan, and runbook links"] },
        ],
      },
      {
        id: "F-AUTOIDENT", title: "Automation identity and monitoring", trace: ["GR-30"], labels: ["automation", "security", "gov-cloud-validate"],
        stories: [
          { id: "S-AI-01", title: "Service identity for plug-ins and flows", story: "As a security architect, I want automation to run under a service identity so that production is not bound to a person.", ac: ["Application user owns plug-in operations", "Flows use connection references bound to a service identity", "Deployment validation checks owners"] },
          { id: "S-AI-02", title: "Failure alerting", story: "As a platform administrator, I want failures alerted so that I can respond.", ac: ["Flow failure branches alert the platform address", "Plug-in errors are logged"] },
        ],
      },
    ],
  },
  {
    id: "E10", title: "Findings, Lifecycle Review, Change, and Retirement", phase: "P2", labels: ["dataverse", "automation", "phase-2"],
    summary: "Findings (MVP), recurring lifecycle reviews, environment change requests, and controlled retirement.",
    features: [
      {
        id: "F-FINDINGS", title: "Findings and remediation", trace: ["GR-26"], labels: ["dataverse", "app-ui", "mvp"], phase: "MVP",
        stories: [
          { id: "S-FN-01", title: "Finding record and views", story: "As a security reviewer, I want findings with owner, severity, due date, plan, and closure so that remediation is tracked.", ac: ["All spec attributes are captured", "Closure requires a closed date and a closure approver who is not the owner", "Risk Accepted requires an approved exception"] },
          { id: "S-FN-02", title: "No compliance claim from absence of findings", story: "As an auditor, I want views that never label an environment compliant solely because it has no open findings.", ac: ["No compliance label is derived from open finding count", "Views show last review date and outcome"] },
          { id: "S-FN-03", title: "Finding reminders", story: "As a finding owner, I want reminders before due dates.", ac: ["Reminders and overdue escalation follow Notification Rule"] },
        ],
      },
      {
        id: "F-LIFECYCLE", title: "Periodic lifecycle review", trace: ["GR-25"], labels: ["dataverse", "automation"],
        stories: [
          { id: "S-LR-01", title: "Lifecycle Review and Review Items", story: "As a platform administrator, I want recurring reviews that evaluate the 20 spec areas so that environments are periodically reassessed.", ac: ["Each cycle creates a new review and never overwrites the request", "Items are generated from a template"] },
          { id: "S-LR-02", title: "Lifecycle review scheduling", story: "As a platform administrator, I want reviews scheduled from the configured cadence.", ac: ["Cadence comes from the family override or Organization Configuration", "Scheduling is idempotent"] },
          { id: "S-LR-03", title: "Owner validation", story: "As a platform administrator, I want owner validity checked so that ownerless environments are found.", ac: ["Disabled users trigger an Ownership finding", "Ownerless view is updated"] },
          { id: "S-LR-04", title: "Inactive-environment review", story: "As a platform administrator, I want inactivity evaluated so that retirement can be recommended.", ac: ["MVP supports manual activity input", "Automated activity data is a gov-cloud-validate item"] },
        ],
      },
      {
        id: "F-CHANGE", title: "Environment change requests", trace: ["GR-08"], labels: ["dataverse", "app-ui"],
        stories: [
          { id: "S-CH-01", title: "Environment Change Request", story: "As a technical owner, I want to request a change to an existing environment without altering the original intake decision.", ac: ["Change links to the Provisioned Environment", "A change to classification, boundary, or high-risk connector triggers re-review", "A linked review request is created when needed"] },
        ],
      },
      {
        id: "F-RETIRE", title: "Controlled environment retirement", trace: ["GR-27"], labels: ["dataverse", "automation", "app-ui"],
        stories: [
          { id: "S-RT-01", title: "Retirement Request and checklist", story: "As a business owner, I want a controlled retirement process so that nothing is lost or left running.", ac: ["Checklist includes the 12 spec items", "Business, technical, and data owner approvals are captured"] },
          { id: "S-RT-02", title: "Retirement completion guard", story: "As an auditor, I want retirement blocked until retention and dependency tasks are resolved.", ac: ["Completion fails with unresolved required checklist items", "Environment state and inventory are updated on completion"] },
        ],
      },
    ],
  },
  {
    id: "E11", title: "Reporting and Dashboards", phase: "MVP", labels: ["reporting", "mvp"],
    summary: "Native dashboards for MVP and advanced reporting in a later phase.",
    features: [
      {
        id: "F-DASH", title: "Operational dashboards", trace: ["GR-32"], labels: ["reporting", "app-ui"],
        stories: [
          { id: "S-DB-01", title: "Intake, My Work, Reviews, Approvals dashboards", story: "As a user, I want dashboards for my role so that I see what needs attention.", ac: ["Dashboards listed in docs/07-app-design.md exist", "Charts respect security roles"] },
          { id: "S-DB-02", title: "Provisioning and Inventory dashboards", story: "As a platform administrator, I want inventory and provisioning dashboards.", ac: ["Environments by family, type, organization, and classification are charted", "Ownerless and due-for-review are listed"] },
          { id: "S-DB-03", title: "Governance dashboards", story: "As a security reviewer, I want findings, exceptions, and connector risk dashboards.", ac: ["Open findings by severity", "Expiring exceptions", "Connector requests by risk"] },
        ],
      },
      {
        id: "F-KPI", title: "Advanced KPI reporting", trace: ["GR-32"], labels: ["reporting", "gov-cloud-validate", "phase-2"], phase: "P2",
        stories: [
          { id: "S-KP-01", title: "Time-in-stage and trend reporting", story: "As a governance board member, I want time-in-stage and trends so that I can improve the process.", ac: ["K02, K15 to K22 are available", "Targets come from configuration and are not hard-coded"] },
          { id: "S-KP-02", title: "Scheduled governance report", story: "As a governance board member, I want a periodic governance report.", ac: ["Report is generated and distributed on a schedule", "Power BI use depends on gov-cloud validation"] },
        ],
      },
    ],
  },
  {
    id: "E12", title: "ALM, Quality, and Government-Cloud Validation", phase: "MVP", labels: ["alm", "gov-cloud-validate", "mvp"],
    summary: "Solution layering, pipelines, testing, deployment validation, and validation of government-cloud dependencies.",
    features: [
      {
        id: "F-GOVVAL", title: "Government-cloud validation spike", trace: ["GR-05"], labels: ["gov-cloud-validate"],
        stories: [
          { id: "S-GV-01", title: "Validate blocking dependencies G01 to G03 and G21", story: "As a solution architect, I want the blocking platform dependencies validated first so that the design is confirmed before build.", ac: ["Results for Dataverse, plug-ins, flows, and service principal are recorded in docs/10-alm-govcloud.md", "Any unavailable item has a decision recorded"] },
          { id: "S-GV-02", title: "Validate remaining dependencies G04 to G23", story: "As a solution architect, I want all flagged dependencies validated so that fallbacks are applied where needed.", ac: ["Each item has a status, date, and tester", "Gaps are added to the risk register"] },
        ],
      },
      {
        id: "F-ALM", title: "Solution layering, source control, and pipeline", trace: ["GR-34"], labels: ["alm"],
        stories: [
          { id: "S-AL-01", title: "Scaffold layered solutions", story: "As a release manager, I want the nine solution layers scaffolded so that components go in the right place.", ac: ["Solutions exist with correct dependency order", "No circular dependency"] },
          { id: "S-AL-02", title: "CI pipeline", story: "As a release manager, I want CI to unpack, check, and build managed solutions.", ac: ["Solution checker runs", "Forbidden-literal scan runs", "Managed artifacts are built"] },
          { id: "S-AL-03", title: "Deployment and validation", story: "As a release manager, I want automated deployment to Test with a smoke test and a validation checklist.", ac: ["Deployment settings supply variables and connection references", "Smoke test covers submit to review generation", "Rollback steps are documented"] },
        ],
      },
      {
        id: "F-VALRULES", title: "Validation rules implementation", trace: ["GR-31"], labels: ["automation", "security"],
        stories: [
          { id: "S-VR-01", title: "Implement validation catalog BV-01 to BV-35", story: "As an auditor, I want the validation catalog implemented so that governance rules hold.", ac: ["Each BV rule has an automated test", "Server-side enforcement exists for integrity rules"] },
        ],
      },
      {
        id: "F-NFR", title: "Nonfunctional verification", trace: ["GR-33"], labels: ["alm"],
        stories: [
          { id: "S-NF-01", title: "Performance and scale check", story: "As a platform administrator, I want views and forms to load within the organization-defined target.", ac: ["A test dataset is loaded", "Results are recorded against the configured target"] },
          { id: "S-NF-02", title: "Generalization test", story: "As an implementation team member, I want proof that the app works with a non-USMC configuration.", ac: ["A sample alternate seed runs the full smoke test", "No USMC value appears outside the seed"] },
        ],
      },
    ],
  },
];

// Governance requirements for the traceability matrix (deliverable 27).
const governanceRequirements = [
  { id: "GR-01", text: "Federated operating model with delegation and escalation" },
  { id: "GR-02", text: "Generalization: no hard-coded organization values" },
  { id: "GR-03", text: "Organization Configuration record" },
  { id: "GR-04", text: "USMC defaults as seed configuration" },
  { id: "GR-05", text: "Identify features requiring government-cloud validation" },
  { id: "GR-06", text: "Normalized request information with a simple requestor intake" },
  { id: "GR-07", text: "Request separate from Environment; environment sets" },
  { id: "GR-08", text: "Environment changes through linked change requests" },
  { id: "GR-09", text: "Rules-based Program Core recommendation with human decision" },
  { id: "GR-10", text: "Application and data classification, most restrictive controls" },
  { id: "GR-11", text: "No automatic approval or rejection based on classification" },
  { id: "GR-12", text: "Normalized Dataverse data model" },
  { id: "GR-13", text: "Immutable request identifier" },
  { id: "GR-14", text: "Request status model" },
  { id: "GR-15", text: "Business process flow" },
  { id: "GR-16", text: "Configurable required reviews" },
  { id: "GR-17", text: "Configurable approval routing and decisions" },
  { id: "GR-18", text: "Connector and integration model" },
  { id: "GR-19", text: "Licensing and capacity" },
  { id: "GR-20", text: "Security and authorization capture, no secrets" },
  { id: "GR-21", text: "Support and sustainment plan" },
  { id: "GR-22", text: "SharePoint document integration" },
  { id: "GR-23", text: "Provisioning tasks, manual then API" },
  { id: "GR-24", text: "Post-provisioning validation" },
  { id: "GR-25", text: "Periodic lifecycle review" },
  { id: "GR-26", text: "Findings and remediation" },
  { id: "GR-27", text: "Controlled retirement" },
  { id: "GR-28", text: "Security roles, least privilege, separation of duties" },
  { id: "GR-29", text: "Model-driven app sitemap, forms, and views" },
  { id: "GR-30", text: "Automation without personal accounts" },
  { id: "GR-31", text: "Business rules and validation" },
  { id: "GR-32", text: "Reporting and dashboards" },
  { id: "GR-33", text: "Nonfunctional requirements" },
  { id: "GR-34", text: "ALM and solution architecture" },
  { id: "GR-35", text: "Audit and evidence" },
];

module.exports = { epics, governanceRequirements };
