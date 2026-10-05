# 0002. Layered managed solutions

- Status: Proposed (confirm in docs/10-alm-govcloud.md)
- Date: 2026-10-04

## Context

The application spans data model, configuration, request management, reviews, provisioning, lifecycle, automation, UI, and reporting. A single monolithic solution is hard to version, test, and promote, and mixes configuration with schema.

## Decision

Use separate managed solutions with a one-way dependency order: Core Data Model -> Reference and Configuration -> Request Management / Reviews and Approvals / Provisioning and Inventory / Lifecycle and Retirement -> Automation -> Model-Driven App -> Reporting. Seed data ships as a separate package, not inside a solution.

## Consequences

- Independent versioning and smaller deployment units.
- Environment variables and connection references are set per target environment.
- Cross-solution dependencies require disciplined layering. Circular references are not allowed.
- Validate that solution segmentation behaves correctly in the target government cloud.
