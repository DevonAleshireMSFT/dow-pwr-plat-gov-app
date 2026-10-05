# 0003. Manual-first provisioning with an automation-ready task model

- Status: Accepted
- Date: 2026-10-04

## Context

Power Platform administrative APIs and some admin capabilities may not be available in every government cloud (GCC High, DoD, IL5).

## Decision

Provisioning is modeled as Provisioning Task records executed manually at first. Each task carries an execution mode (Manual, Automated, Hybrid) and an automation-dependency flag (`gov-cloud-validate`). API-based automation is added task by task after validation.

## Consequences

- MVP does not depend on admin API availability.
- Task and validation evidence is captured the same way regardless of execution mode.
- Automation is an incremental enhancement, not a redesign.
