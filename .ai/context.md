# Project Context: Power Platform Environment Request and Governance Tracker

## What this product is

A Dataverse-backed model-driven application that manages the full lifecycle of Power Platform environment requests (intake, reviews, approval, provisioning, post-provisioning validation, periodic review, change, retirement) and produces audit evidence and governance reporting. It supports a federated operating model: a central platform team sets guardrails, and commands, programs, or business units own their applications, data, and support. Routine decisions are delegated to the lowest level that can manage the risk. Enterprise, security, authorization, high-risk connector, custom connector, AI, external-facing, or cross-organizational impact is escalated.

## Current state

Design phase. The design documents in `docs/` (all 27 deliverables) are drafted and pending review. The backlog is in `tools/backlog.js` and mirrored as GitHub issues on the project board. The requestor intake has been simplified to a 10-item request (ADR 0004). No Dataverse solution has been built yet.

- Repo: https://github.com/DevonAleshireMSFT/dow-pwr-plat-gov-app
- Project board: https://github.com/users/DevonAleshireMSFT/projects/9

## Key Rules

1. **Do not hard-code organization-specific values.** USMC, MCEN, EIS, ISSM/ISSO, environment family names, classification values, approval authorities, DLP policy names, connector approval rules, licensing plans, review cadences, and naming standards live in configurable Dataverse reference tables and environment variables. USMC values are seed examples only.
2. **Rules recommend; humans decide.** Classification and routing rules generate recommendations, required reviews, warnings, and escalation tasks. They never auto-approve or auto-reject a request.
3. **Most restrictive classification controls.** Evaluate application classification and data classification together. The stricter governance requirement controls routing and required reviews.
4. **Request is separate from Environment.** One Request can yield zero, one, or many Environments. Changes to an existing Environment go through linked change requests and never overwrite the original intake decision.
5. **Normalize.** People, organizations, requested environment stages, connectors, integrations, reviews, decisions, provisioning tasks, and lifecycle activities are related tables, not text columns.
6. **Reviews carry their own state.** Each review record keeps its own status, reviewer, decision, conditions, findings, and completion date. Request status does not stand in for review status.
7. **Immutable request identifier.** The request number (default `ENV-YYYY-######`, configurable) is separate from the record GUID and contains no mutable business data.
8. **No secrets or PII in records.** Never store secrets, passwords, certificates, keys, or tokens in Dataverse request records. Do not replicate Entra ID as a personnel database.
9. **Least privilege and separation of duties.** Requestors cannot approve their own requests. Security reviewers cannot approve their own implementations. Developers do not receive routine Production administration through this app.
10. **Government-cloud validation.** Do not assume commercial features exist in GCC High, DoD, or IL5. Flag every dependent feature `gov-cloud-validate`.
11. **No invented targets.** SLAs, review cadences, and service-level targets are configured by the implementing organization.
12. **No personal-account automation.** Production automation runs under service principals or service accounts.
13. **Documents live in SharePoint.** Dataverse stores metadata, status, relationships, and links to supporting evidence.
14. **Absence of findings is not compliance.** Never state an environment is compliant solely because no open finding exists.
15. **Simple upfront request.** The requestor answers 10 plain-language items (program or command, justification, business owner, technical owner, data types, user population, capabilities, external systems, workload type, duration). Classification, licensing, connector risk, security requirements, authorization boundary, and support planning are derived by rules or collected during intake and review. "I don't know" answers never block submission. Do not put governance-model questions on the requestor form. See `docs/03a-requestor-intake.md` and ADR 0004.

## Known Gotchas

- Program Core is optional. Recommend it only on architectural indicators (shared schema, multiple teams or apps on a common data model, independent release of shared components). Never recommend it only because an app is important, mission-critical, or long-lived. A rule suggests, an authorized reviewer decides.
- Provisioning is manual first, with future API automation. Mark each automation dependency that needs gov-cloud validation.
- Production cannot be provisioned before required Test validation.
- Exact license names and entitlements are reference data because terms change.

## Where to find more

- Design docs: `docs/`
- Decisions: `.ai/adr/`
