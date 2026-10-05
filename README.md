# Power Platform Environment Request and Governance Tracker

A Dataverse-backed model-driven app that manages the lifecycle of Power Platform environment requests: intake, governance and security review, approval, provisioning, validation, periodic review, change, and retirement. The design is organization-neutral and fits any U.S. military Service, DoD organization, or federal agency. USMC values ship only as seed configuration examples.

## Status

Design phase. Track work on the [project board](https://github.com/users/DevonAleshireMSFT/projects/9).

## Repository layout

| Path | Purpose |
|---|---|
| [.ai/](.ai/context.md) | Product context and Architecture Decision Records (ADRs) |
| [docs/](docs/) | Design documentation (requirements, data model, security, automation, ALM, backlog) |
| `solutions/` | Unpacked Dataverse solutions (PAC CLI), added in the build phase |
| `seed/` | Importable seed configuration (USMC example), added in the build phase |

## Principles

- Configuration over code: organizations, classifications, environment families, rules, and naming standards are Dataverse reference data and environment variables, never hard-coded.
- Classification and rules produce recommendations, required reviews, warnings, and escalations. Authorized humans make decisions.
- No secrets, credentials, keys, or tokens in Dataverse records or in this repository.
- Government-cloud (GCC High / DoD / IL5) availability is never assumed. Features that need validation are flagged `gov-cloud-validate`.
- Production automation runs under service principals or service accounts, never personal accounts.

## Tooling

PAC CLI, Node.js, Git, and GitHub CLI.
