# 03a. Requestor Intake Design (simple upfront request)

Integrates the simplified-request recommendation into the design. It refines deliverables 4, 6, 7, 9, and 17.

## Principle

**The requestor explains what they are trying to accomplish. The governance process determines which controls apply.**

A requestor should not need to understand DLP classification, licensing, authorization boundaries, connector risk, Managed Environments, or ALM architecture to submit a request. Requestor-provided business information is separated from governance-derived technical information. Governance rigor is not reduced. It moves from page one of the form to rules and the platform review workflow.

## The 10-item request

| # | Item | Control | Notes |
|---|---|---|---|
| 1 | Program or Command Name | Lookup (Program), organization derived | Free-text fallback if not listed |
| 2 | Business Justification and Intended Use | Multiline text | |
| 3 | Business Owner | Person lookup | Becomes a Stakeholder Assignment |
| 4 | Technical Owner | Person lookup | Becomes a Stakeholder Assignment |
| 5 | What type of information will the solution store or process? | Multi-select (Data Type options) | Includes "I don't know". Never asks for a classification label |
| 6 | Estimated User Population | Number or band | |
| 7 | What capabilities are needed? | Multi-select (Capability options) | Includes "Not sure" |
| 8 | Will the solution connect to another system or service? | Choice: No, Yes, Not Sure | If Yes or Not Sure, shows "Which systems or services need to exchange data with the solution?" |
| 9 | What kind of workload is this? | Choice (Workload Type options) | The app recommends the environment family and stage set. Requestor never picks Development, Test, or Production individually |
| 10 | Expected Duration | Choice: Permanent, Temporary, Unknown | If Temporary, an expected end date is required |

Required to submit: all 10 items. "I don't know", "Not sure", and "Unknown" are valid answers that never block submission. They create a pending determination for the intake analyst.

Quick-create (or a single-page main form for requestors) shows only these items plus the title. Everything else is hidden from the Requestor role.

## Conversational phrasing

| Instead of asking | Ask |
|---|---|
| Data Classification: CUI requiring high-impact handling | What type of information will the solution store or process? Public or releasable, internal business, PII, CUI, mission-sensitive, I don't know |
| Connector Requirements | Will the solution connect to another system or service? No, Yes, Not sure. If Yes: which systems or services need to exchange data? |
| Licensing Requirements | Does the solution require Dataverse, Power Pages, AI or Copilot Studio, external system integration, a custom connector or API, or other capabilities beyond standard Microsoft 365 services? Not sure is allowed |
| Requested Environment Type (Dev/Test/Prod) | What kind of workload is this? The app recommends the family and stage set |
| Expected Environment Lifecycle | Permanent, Temporary, or Unknown. End date if temporary |

Option labels, help text, and their mappings are Intake Option records ([config-reference.md](04-data-model/config-reference.md)). The wording is organization-configured.

## Disposition of the original 18 request items

| Original item | Disposition | Where it is collected or derived |
|---|---|---|
| 1 Program, command, organization, or business unit | **Keep** | Request, item 1 |
| 2 Business justification | **Keep** | Request, item 2 |
| 3 Business owner | **Keep** | Request, item 3 |
| 4 Technical owner | **Keep** | Request, item 4 |
| 5 Data owner | **Conditional** | Asked only when the selected data types indicate governed or sensitive data (Intake Option `promptsdataowner`). Otherwise added by intake |
| 6 Application classification | **Assess during intake** | Impact question at Stage 2, system recommendation, confirmed by intake analyst or reviewer |
| 7 Data classification | **Simplified question** | Requestor picks data types. System recommends a classification. Intake or reviewer confirms |
| 8 Estimated user population | **Keep** | Request, item 6 |
| 9 Licensing requirements | **Move to platform review** | Capabilities drive a Licensing and Capacity review. Detail in Licensing Requirement and Capacity Estimate |
| 10 External integration requirements | **Keep, simplified** | Request, item 8. Detail in External Integration records during technical assessment |
| 11 Connector requirements | **Conditional** | Connector detail is optional for the requestor. Requested Connector records are created by the technical owner or intake. Risk assessment belongs to Connector and DLP review |
| 12 Security requirements | **Move to security review** | Security Requirement record completed with the security reviewer. Requestor describes data and use case only |
| 13 Authorization boundary information | **Conditional** | "Is this already associated with an authorization boundary?" Yes, No, Unknown. Shown only when data types or integration warrant |
| 14 Security point of contact | **Conditional** | Surfaced only when intake or a rule triggers security review |
| 15 Requested environment family | **Simplify** | Workload type, then recommended family. Intake confirms |
| 16 Requested environment type or lifecycle stages | **Delete as a requestor field** | Duplicate of 15. Requested Environment stage records are generated from the confirmed family |
| 17 Expected environment lifecycle | **Simplify** | Duration Type and Expected End Date |
| 18 Support and sustainment plan | **Move later** | Required before Production approval, not before submission |

## Where the work moves

| Concern | Who determines it | When |
|---|---|---|
| Data classification | Rule recommendation from data types, confirmed by intake analyst or reviewer | Intake Validation |
| Application classification | Rule recommendation from impact answer and capability flags, confirmed by intake analyst or reviewer | Intake Validation (Stage 2) |
| Which reviews are required | Approval Rules and Intake Option triggers | Review generation, after classifications are confirmed |
| Licensing and capacity | Licensing and Capacity Reviewer, with technical owner input | Stage 4 |
| Connector and integration detail | Technical owner with intake, Connector and DLP Reviewer assesses | Stage 3 |
| Security requirements and authorization | Security Reviewer with technical owner input | Stage 5 |
| Environment family and stage set | Recommendation from workload type, confirmed by intake analyst | Intake Validation |
| Support and sustainment plan | Technical owner and business owner | Before Production approval |
| Program Core indicators | Technical owner, recommendation from rules, decision by authorized reviewer | Stage 3 |

## Derivation rules (summary)

Detailed rule design is in [06-rules.md](06-rules.md).

| Derivation | Logic |
|---|---|
| Recommended data classification | Highest-rank Minimum Data Classification among selected Data Type options. If an unknown option is selected and nothing is confirmed, set Data Classification Pending |
| Recommended application classification | From the Impact answer's suggested classification. Capability flags may raise it. Never lowers it |
| Effective governance rank | Greater of confirmed (or recommended) application and data ranks. If neither exists, use the highest configured rank until resolved (conservative default) |
| Review triggers | Union of Intake Option triggers and matching Approval Rules |
| Escalation flags | AI, premium or Dataverse, external-facing, custom connector, cross-program, and similar flags derive from options and from intake and review answers |
| Recommended family | Suggested Family of the selected Workload Type, subject to Approval Rule overrides |
| Not-supported data | If a selected data type maps to a classification marked Not Supported, the request is routed to a human decision. It is not auto-rejected |

Rules produce recommendations, required reviews, warnings, and escalation tasks. A human confirms classification and the family. A confirmed value that differs from the recommendation requires triage notes, and the change is recorded in Request History.

## Intake Validation changes

The platform intake analyst now has an explicit confirm step:

1. Confirm or change the recommended environment family (sets `ppg_familyid`, generates Requested Environment stage records).
2. Confirm or change the data classification and application classification.
3. Resolve any "I don't know", "Not sure", or "Unknown" answers, or return the request for information with a specific question.
4. Confirm the program and organization if free text was used.
5. Assign missing stakeholders (Data Owner, Security POC) when triggered.

Reviews are generated only after step 2 completes. This prevents wrong routing from an uninformed requestor answer.

## Submission validation (revised)

| Check | Rule |
|---|---|
| Ten items present | All 10 items answered. "Unknown" answers allowed |
| Owners | Business Owner and Technical Owner present and not the same record as an approver for this request |
| Temporary duration | End date required |
| Integration | If Yes, systems or services summary required |
| Hidden fields | Governance-derived columns are not required at submission |

Business rules that remain required later (unchanged from the spec): Data Owner when governed data, security reviewer for sensitive data, connector records when integrations are requested, licensing review for premium capabilities, capacity review for Dataverse, support plan before Production approval, authorization information for CUI and sensitive workloads, Test validation before Production.

## Requestor experience in the app

| Surface | Requestor sees | Requestor does not see |
|---|---|---|
| Quick-create or single-page form | The 10 items | Classification labels, review lists, routing, security, licensing, authorization, connector risk |
| My Work | Status in plain language, questions returned for information, decisions and conditions | Internal review notes marked platform-only |
| Return for information | A specific question and a place to answer | |
| Request detail (read-only after submission) | Their answers, current stage, next step, owners | Derived classification until confirmed, then shown with its plain-language meaning |

## Suggested governance guidance wording

The source governance guidance lists the fields an environment request "shall include". Revise it to separate requestor-provided information from information collected during governance review:

> ### Provisioning Requirements
>
> Environment requests shall collect sufficient information to establish business need, accountable ownership, intended use, data sensitivity, expected scale, integration requirements, and environment purpose. Additional licensing, security, authorization, DLP, connector, and sustainment information may be collected or derived during the intake and governance review process based on the characteristics of the request.
>
> At a minimum, requestors shall provide:
>
> 1. Program or Command Name
> 2. Business Justification and Intended Use
> 3. Business Owner
> 4. Technical Owner
> 5. Data Types and Sensitivity
> 6. Estimated User Population
> 7. Required Platform Capabilities
> 8. External Systems or Integration Requirements
> 9. Requested Environment Family or Intended Workload Type
> 10. Expected Duration
>
> Additional information, including Data Owner, application classification, licensing requirements, connector requirements, security requirements, authorization boundary information, security reviewer involvement, and support and sustainment requirements, shall be collected when applicable during governance review.

Treat this as proposed wording for the organization's governance document. The organization owns the decision to adopt it.

## Unresolved decisions this introduces

| # | Decision | Owner |
|---|---|---|
| D13 | Wording and values of the Stage 2 impact question and its mapping to application classification | Governance board |
| D14 | Mapping of each Data Type option to a minimum data classification, and which options trigger which reviews | Governance board, security authority |
| D15 | Whether "I don't know" on data type pauses review generation until intake confirms (recommended) or defaults to the strictest path | Governance board |
| D16 | Requestor-visible wording for status and for returned questions | Central platform team |
