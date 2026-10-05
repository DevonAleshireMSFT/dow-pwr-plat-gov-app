# 02. Requirements

Covers deliverables 4 (functional requirements) and 5 (nonfunctional requirements). Requirement IDs are used by the traceability matrix in [11-delivery.md](11-delivery.md).

Priority: **M** = MVP, **P2** = later phase. Items marked **GCV** depend on a feature that needs validation in GCC High, DoD, or IL5.

## 4. Functional requirements

### FR-CFG Configuration and generalization

| ID | Requirement | Pri |
|---|---|---|
| FR-CFG-01 | Provide an Organization Configuration record holding organization name, service or agency, tenant name, cloud boundary, central platform team name, governance board name, security-authority terminology, default review cadence, naming pattern, request-number format, supported classifications, families and types, retention policy reference, and notification settings. | M |
| FR-CFG-02 | Provide configurable reference tables for application classifications, data classifications, environment families, environment types, approval rules, notification rules, naming standards, DLP policies, connector policies, licensing types, and stakeholder roles. | M |
| FR-CFG-03 | Provide escalation thresholds and authorization-boundary terminology as configuration. | M |
| FR-CFG-04 | Ship USMC defaults only as an optional, separable seed package. | M |
| FR-CFG-05 | Use environment variables for deployment-specific values (SharePoint site, notification mailbox, base URLs, feature toggles). | M |
| FR-CFG-06 | Validate configuration coherence (for example, every family has at least one type, every classification has a restrictiveness rank). | P2 |

### FR-REQ Request management

| ID | Requirement | Pri |
|---|---|---|
| FR-REQ-01 | Create and save a request as Draft. | M |
| FR-REQ-02 | Generate an immutable request number in a configurable format (default `ENV-YYYY-######`) separate from the record GUID, with no mutable business data. | M |
| FR-REQ-03 | Collect the baseline request information in two tiers, normalized into related tables. The requestor provides the 10 intake items. The remaining baseline items (Data Owner, application classification, data classification, licensing, connector detail, security requirements, authorization boundary, security point of contact, environment type or stages, support and sustainment plan) are derived or collected during intake and review. See [03a-requestor-intake.md](03a-requestor-intake.md). | M |
| FR-REQ-11 | The requestor form contains exactly the 10 intake items. Questions are conversational and plain language (data types, capabilities, connects to another system, workload type, duration), not classification labels or technical models. | M |
| FR-REQ-12 | "I don't know", "Not sure", and "Unknown" are valid answers that never block submission. They create a pending determination for the intake analyst. | M |
| FR-REQ-13 | Conditional prompts appear only when triggered by earlier answers (systems summary, end date if temporary, authorization-boundary question, Data Owner, security point of contact). | M |
| FR-REQ-14 | Requestor-facing labels, help text, and answer-to-governance mappings are configurable Intake Option records. | M |
| FR-REQ-15 | Requestors do not select Development, Test, or Production stages. The app recommends an environment family and stage set from the workload type, and the intake analyst confirms. | M |
| FR-REQ-04 | Capture one or more Requested Environment records (the stages) per request, including optional Program Core. | M |
| FR-REQ-05 | Capture stakeholder assignments (business owner, technical owner, data owner, security POC, and others) through a junction table, with roles from the Stakeholder Role table. | M |
| FR-REQ-06 | Validate completeness at submission against the 10 intake items only. Governance-derived fields are not required at submission and are validated at the stage that collects them. | M |
| FR-REQ-07 | Allow return for information with a required rationale and resubmission, preserving history. | M |
| FR-REQ-08 | Allow withdraw and cancel with rationale. | M |
| FR-REQ-09 | Maintain full comment and status history. | M |
| FR-REQ-10 | Support linked Environment Change Requests against an existing Provisioned Environment without altering the original intake decision. | M |

### FR-CLS Classification and recommendation

| ID | Requirement | Pri |
|---|---|---|
| FR-CLS-01 | Evaluate application classification and data classification together. The more restrictive requirement controls routing and required reviews. Classifications are recommended by rules from requestor answers and confirmed by the intake analyst or reviewer before reviews are generated. | M |
| FR-CLS-05 | Derive a recommended data classification from the selected data types, and a recommended application classification from the impact answer and capability flags. A confirmed value that differs from the recommendation requires triage notes and is recorded in Request History. | M |
| FR-CLS-06 | When a classification is unconfirmed, apply the conservative default (highest configured rank) for routing preview until it is resolved. | M |
| FR-CLS-02 | Generate recommendations, required reviews, warnings, and escalation tasks. Never auto-approve or auto-reject based only on classification. | M |
| FR-CLS-03 | Provide a rules-based Program Core recommendation, with the final decision made by an authorized reviewer. Do not recommend Program Core solely on importance, criticality, or longevity. | M |
| FR-CLS-04 | Block or warn when data classification is a not-supported value (for example, classified), routing to a human decision. | M |

### FR-REV Reviews

| ID | Requirement | Pri |
|---|---|---|
| FR-REV-01 | Determine required reviews by configurable rules, not by assuming every request needs every review. | M |
| FR-REV-02 | Generate Review Requirement and Governance Review records for governance, security, licensing and capacity, connector and DLP, and command or program review. | M |
| FR-REV-03 | Each review retains status, reviewer, decision, conditions, findings, and completion date independently of request status. | M |
| FR-REV-04 | Support unresolved security findings and review outcomes. | M |
| FR-REV-05 | Enforce reviewer separation of duties (no self-review of own request or implementation). | M |

### FR-APR Approval and exceptions

| ID | Requirement | Pri |
|---|---|---|
| FR-APR-01 | Route approvals by configurable Approval Rules: delegated platform authority for standard requests, escalation for the defined triggers. | M |
| FR-APR-02 | Support decisions Approve, Approve with conditions, Reject, Return for information, Withdraw, Cancel. | M |
| FR-APR-03 | Record decision authority, individual approver, date, rationale, conditions, expiration, related review, related exception, and evidence links. | M |
| FR-APR-04 | Track conditional approvals and governance exceptions with expiration and reminders. | M |
| FR-APR-05 | Requestors cannot approve their own requests. | M |

### FR-CON Connectors and integrations

| ID | Requirement | Pri |
|---|---|---|
| FR-CON-01 | Maintain a Connector register (reference) with classification, publisher, DLP grouping, risk, approval status. | M |
| FR-CON-02 | Capture Requested Connector records per request with the attributes in the spec (type, publisher, sources, destination, auth model, service-principal support, residency, exposure, data classification, DLP grouping, approval status, stages, licensing and authorization impact, security-review and exception needs, decision, expiry). | M |
| FR-CON-03 | Capture External Integration records with the 17 attributes in the spec, including connector and gateway dependency. | M |
| FR-CON-04 | Flag high-risk and custom connectors and external-facing capability for escalation. | M |

### FR-LIC Licensing and capacity

| ID | Requirement | Pri |
|---|---|---|
| FR-LIC-01 | Capture Licensing Requirement and Capacity Estimate records (premium capabilities, users by role, makers, app users, license type, entitlement, funding owner, database, file, and log capacity, allocation need, outcomes, reviewer, notes). | M |
| FR-LIC-02 | Treat license names and entitlements as configurable reference data. | M |
| FR-LIC-03 | Require licensing review for premium capabilities and capacity review for Dataverse environments. | M |

### FR-SEC Security and authorization

| ID | Requirement | Pri |
|---|---|---|
| FR-SEC-01 | Capture Authorization Boundary and Security Requirement records per the spec list (boundary, status, owner, POCs, CUI, PII, mission-data indicators, groups, roles, field security, audit, monitoring, conditional access, production access model, break-glass, service principal, service-account exception, review outcome, unresolved findings). | M |
| FR-SEC-02 | Prevent storage of secrets, passwords, certificates, keys, and tokens in request records (guidance text, validation of free-text patterns where feasible). | M |
| FR-SEC-03 | Require authorization information for CUI and other sensitive workloads. | M |

### FR-SUP Support and sustainment

| ID | Requirement | Pri |
|---|---|---|
| FR-SUP-01 | Provide a structured Support and Sustainment Plan with the 20 spec attributes, required before Production approval. | M |

### FR-DOC Documents

| ID | Requirement | Pri |
|---|---|---|
| FR-DOC-01 | Store document metadata and SharePoint links in Supporting Document records. Do not use Dataverse as the primary file store. | M |
| FR-DOC-02 | Support native Dataverse SharePoint document-management integration for record-level folders. **GCV** | P2 |

### FR-PRV Provisioning and validation

| ID | Requirement | Pri |
|---|---|---|
| FR-PRV-01 | After approval, generate one Provisioning Task per required activity from a configurable template. | M |
| FR-PRV-02 | Support manual completion with evidence now, and API-based automation later per task. **GCV** | M / P2 |
| FR-PRV-03 | Provide a post-provisioning validation checklist (18 spec checks) with evidence and owner acceptance of handoff. | M |
| FR-PRV-04 | Block Production provisioning until required Test validation is complete. | M |
| FR-PRV-05 | Block request completion until Environment records and validation evidence exist. | M |
| FR-PRV-06 | Record Environment Configuration items (security group, DLP, managed environment, pipeline association, and others). | M |

### FR-INV Environment inventory

| ID | Requirement | Pri |
|---|---|---|
| FR-INV-01 | Maintain Provisioned Environment records with URL, ID, type, family, region, boundary, owners, classification, and links to originating request. | M |
| FR-INV-02 | Provide inventory views by family, organization, classification, review due, ownerless, and retirement recommended. | M |
| FR-INV-03 | Synchronize inventory with tenant admin data. **GCV** | P2 |

### FR-LCR Lifecycle review, findings, and retirement

| ID | Requirement | Pri |
|---|---|---|
| FR-LCR-01 | Create recurring Lifecycle Review records (never overwriting the original request) covering the 20 spec evaluation areas. | P2 |
| FR-LCR-02 | Schedule reviews from configurable cadence. | P2 |
| FR-LCR-03 | Maintain Finding or Remediation Action records with type, severity, source, description, scope, owner, due date, status, plan, evidence, closed date, and closure approver. | M |
| FR-LCR-04 | Do not state that an environment is compliant solely because no open finding exists. | M |
| FR-RET-01 | Provide a controlled Retirement Request with reason, owner approvals, reviews, and a Retirement Checklist covering the 17 spec items. | P2 |
| FR-RET-02 | Prevent retirement completion until retention and dependency tasks are resolved. | P2 |

### FR-AUD Audit and reporting

| ID | Requirement | Pri |
|---|---|---|
| FR-AUD-01 | Enable Dataverse auditing on governed tables and retain request, decision, and status history. | M |
| FR-AUD-02 | Provide the dashboards and KPIs listed in [09-audit-reporting.md](09-audit-reporting.md). | M / P2 |
| FR-AUD-03 | Do not invent targets. Targets are configured by the implementing organization. | M |

## 5. Nonfunctional requirements

| ID | Area | Requirement | Measure or approach |
|---|---|---|---|
| NFR-01 | Accessibility | Meet Section 508 / WCAG 2.1 AA for the model-driven app experience. Avoid custom controls that break keyboard or screen-reader access. | Accessibility checker and manual keyboard and screen-reader test per release. |
| NFR-02 | Performance | Views and forms load within an organization-defined target. Use indexed columns and filtered views. | Target set by implementing organization. Verify with form-load testing. |
| NFR-03 | Scale | Design for growth in requests, environments, and history without redesign. Avoid unbounded subgrids on main forms. | Expected volumes set by implementing organization. Load-test seed. |
| NFR-04 | Auditability | Audit all governance-relevant tables and columns. Retain decision, status, and review history. | Auditing enabled in solution. Audit-log export procedure documented. |
| NFR-05 | Least privilege | Roles grant minimum table privileges and scope. Column security on sensitive columns. | Security-role matrix in [05-security.md](05-security.md). |
| NFR-06 | Separation of duties | Requestor cannot approve own request. Security reviewer cannot approve own implementation. Developers get no routine Production admin through the app. | Enforced by plug-in validation plus role design. |
| NFR-07 | Records management | Retention policy reference is configurable. Evidence is retained according to organization policy. | Retention design in [09-audit-reporting.md](09-audit-reporting.md). **GCV** for Dataverse long-term retention. |
| NFR-08 | Maintainability | Modular layered solutions, consistent naming, documented schema, source-controlled. | ADR 0002, solution layout. |
| NFR-09 | Configurability | No organization-specific hard-coding. | ADR 0001. Static check for forbidden literals in solution source. |
| NFR-10 | Resilience | Automations are idempotent, retry safely, and surface failures. | Automation catalog in [08-automation.md](08-automation.md). |
| NFR-11 | Supportability | Runbook, monitoring, and owner of the app itself recorded. | Platform team ownership. |
| NFR-12 | Government-cloud compatibility | Every feature dependent on commercial-only capability is flagged and has a fallback. | List in [10-alm-govcloud.md](10-alm-govcloud.md). |
| NFR-13 | ALM | Source-controlled unpacked solutions, managed solution deployment, pipeline-built artifacts. | See [10-alm-govcloud.md](10-alm-govcloud.md). |
| NFR-14 | Environment variables and connection references | No hard-coded endpoints or personal connections. | Solution components use both. |
| NFR-15 | Solution segmentation | Layered solutions with a one-way dependency order. | ADR 0002. |
| NFR-16 | Automated testing | Unit tests for plug-ins, flow validation tests, and a deployment smoke test. Test data from a non-production seed. | CI pipeline. |
| NFR-17 | Deployment validation | Post-deploy checks for solution versions, environment variables, connection references, roles, and seed data. | Checklist in [10-alm-govcloud.md](10-alm-govcloud.md). |
| NFR-18 | Rollback | Each release documents a rollback plan (prior managed version, data backup). | Release template. |
| NFR-19 | Operational monitoring | Flow failures, plug-in errors, and overdue reviews are monitored and alerted. | Monitoring approach in [08-automation.md](08-automation.md). |
| NFR-20 | Data protection | No secrets or PII beyond what is necessary. Column security on sensitive columns. | Data dictionary sensitivity flags. |
