# 0004. Simple requestor intake; governance determines controls

- Status: Accepted
- Date: 2026-10-04

## Context

The baseline environment request lists 18 items, including data classification, application classification, licensing, connector and security requirements, authorization boundary, security point of contact, environment type, and a support plan. Many of these require knowledge of the governance and platform models that an average requestor does not have. Intake exists to decide whether an environment is necessary, appropriately governed, adequately licensed, and aligned with security and operational requirements, and the central platform team and reviewers are responsible for much of that assessment.

## Decision

Separate requestor-provided business information from governance-derived technical information.

- The requestor provides 10 items: program or command, business justification and intended use, business owner, technical owner, data types, estimated user population, capabilities needed, external systems or integrations, workload type (which drives the recommended environment family), and expected duration.
- Questions are conversational and plain language. "I don't know", "Not sure", and "Unknown" are valid answers.
- Classifications, required reviews, licensing, connector risk, security requirements, authorization boundary, and support planning are derived by rules or collected during intake and review. Rules recommend. The intake analyst or reviewer confirms.
- Requestor answer options, help text, and mappings are configurable Intake Option records.
- The support and sustainment plan is required before Production approval, not before submission.
- The requested environment type field is not a requestor input. Requested Environment stage records are generated from the confirmed family.

## Consequences

- The requestor form is short and approachable. Governance rigor is not reduced. It moves into rules and the intake and review workflow.
- Intake Validation gains an explicit confirm step. Reviews are generated only after classifications and family are confirmed, which prevents mis-routing from uninformed answers.
- An additional configuration table (Intake Option) and derived/recommended columns on the request are needed.
- The Governance Board must approve the answer-to-classification and answer-to-review mappings (decisions D13 to D15).
- Intake analyst workload increases slightly and must be reflected in capacity planning.
- The source governance guidance should be updated from "requests shall include" to the minimum requestor set plus information collected during review. Proposed wording is in `docs/03a-requestor-intake.md`.
