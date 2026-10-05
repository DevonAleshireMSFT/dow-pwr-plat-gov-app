# 0001. Configuration over hard-coding for organization-specific values

- Status: Accepted
- Date: 2026-10-04

## Context

The solution must serve any U.S. military Service, DoD organization, or federal agency. Names, authorities, classifications, DLP policies, connector rules, license plans, cadences, and naming standards differ by organization and change over time.

## Decision

All organization-specific values are stored in Dataverse reference and configuration tables (anchored by an Organization Configuration record) or in environment variables. USMC values are delivered as a separate, optional seed package that implementers replace.

## Consequences

- No organization name, boundary, or authority appears in code, forms, flows, or schema names.
- Rules (approval routing, required reviews, Program Core recommendation, naming, request-number format) are data-driven.
- Seed data is versioned separately from the schema solutions.
- Additional design effort goes into the configuration model, with validation to prevent incoherent configuration.
