# Relationship Matrix

Deliverable 10. Cascade behavior: **Parental** = delete, assign, share, reparent cascade to children. **Referential** = no cascade (restrict delete). **Referential, remove link** = delete clears the lookup. Transactional children of a request are parental so security and ownership follow the request. Reference and configuration lookups are referential (restrict delete). In practice records are deactivated, not deleted.

## One-to-many (parent to child)

| Parent | Child | Lookup on child | Cascade | Notes |
|---|---|---|---|---|
| Environment Request | Requested Environment | `ppg_requestid` | Parental | |
| Environment Request | Stakeholder Assignment | `ppg_requestid` | Parental | |
| Environment Request | Requested Connector | `ppg_requestid` | Parental | |
| Environment Request | External Integration | `ppg_requestid` | Parental | |
| Environment Request | Licensing Requirement | `ppg_requestid` | Parental | |
| Environment Request | Capacity Estimate | `ppg_requestid` | Parental | |
| Environment Request | Security Requirement | `ppg_requestid` | Parental | |
| Environment Request | Support and Sustainment Plan | `ppg_requestid` | Referential | Plan outlives the request |
| Environment Request | Review Requirement | `ppg_requestid` | Parental | |
| Environment Request | Governance Review | `ppg_requestid` | Parental | |
| Environment Request | Approval Decision | `ppg_requestid` | Referential | Evidence. Not deletable |
| Environment Request | Governance Exception | `ppg_requestid` | Referential | |
| Environment Request | Provisioning Task | `ppg_requestid` | Referential | |
| Environment Request | Supporting Document | `ppg_requestid` | Referential | |
| Environment Request | Request History Entry | `ppg_requestid` | Referential | Append-only |
| Environment Request | Provisioned Environment | `ppg_requestid` | Referential | |
| Environment Request | Environment Request (prior) | `ppg_priorrequestid` | Referential | Self |
| Requested Environment | Provisioned Environment | `ppg_requestedenvironmentid` | Referential | 1:1 in practice |
| Requested Environment | Provisioning Task | `ppg_requestedenvironmentid` | Referential | |
| Requested Environment | Capacity Estimate | `ppg_requestedenvironmentid` | Referential | |
| Requested Environment | Licensing Requirement | `ppg_requestedenvironmentid` | Referential | Optional |
| Requested Connector | Governance Exception | `ppg_requestedconnectorid` | Referential | |
| Review Requirement | Governance Review | `ppg_reviewrequirementid` | Referential | |
| Governance Review | Finding | `ppg_reviewid` | Referential | |
| Governance Review | Approval Decision | `ppg_reviewid` | Referential | |
| Governance Exception | Approval Decision | `ppg_exceptionid` | Referential | |
| Provisioned Environment | Environment Configuration | `ppg_provisionedenvironmentid` | Parental | |
| Provisioned Environment | Provisioning Task | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Lifecycle Review | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Finding | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Environment Change Request | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Retirement Request | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Governance Exception | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Stakeholder Assignment | `ppg_provisionedenvironmentid` | Referential | |
| Provisioned Environment | Supporting Document | `ppg_provisionedenvironmentid` | Referential | |
| Lifecycle Review | Lifecycle Review Item | `ppg_lifecyclereviewid` | Parental | |
| Lifecycle Review | Finding | `ppg_lifecyclereviewid` | Referential | |
| Retirement Request | Retirement Checklist Item | `ppg_retirementrequestid` | Parental | |
| Environment Change Request | Environment Request (review request) | `ppg_reviewrequestid` | Referential | Lookup on change request |
| Application | Environment Request | `ppg_applicationid` | Referential | |
| Application | Support and Sustainment Plan | `ppg_applicationid` | Referential | |
| Application | Provisioned Environment | `ppg_applicationid` | Referential | |
| Support and Sustainment Plan | Provisioned Environment | `ppg_supportplanid` | Referential | |
| Authorization Boundary | Security Requirement | `ppg_authorizationboundaryid` | Referential | |
| Authorization Boundary | External Integration | `ppg_authorizationboundaryid` | Referential | |
| Authorization Boundary | Environment Request | `ppg_authorizationboundaryid` | Referential | Known boundary, optional |
| Authorization Boundary | Provisioned Environment | `ppg_authorizationboundaryid` | Referential | |
| Organization | Program or Command | `ppg_organizationid` | Referential | |
| Organization | Organization (child) | `ppg_parentorganizationid` | Referential | Self hierarchy |
| Organization | Environment Request | `ppg_organizationid` | Referential | |
| Organization | Application | `ppg_organizationid` | Referential | |
| Organization | Provisioned Environment | `ppg_organizationid` | Referential | |
| Program or Command | Environment Request | `ppg_programid` | Referential | |
| Program or Command | Application | `ppg_programid` | Referential | |
| Stakeholder Role | Stakeholder Assignment | `ppg_roleid` | Referential | |
| Organization Configuration | Environment Family, Approval Rule, Notification Rule, Naming Standard, Application Classification, Data Classification, DLP Policy, Number Sequence | `ppg_organizationconfigurationid` | Referential | |
| Environment Family | Environment Type | `ppg_familyid` | Referential | |
| Environment Family | Environment Request | `ppg_familyid`, `ppg_requestedfamilyid`, `ppg_recommendedfamilyid` | Referential | Confirmed, requested, recommended |
| Environment Family | Provisioned Environment | `ppg_familyid` | Referential | |
| Environment Family | Naming Standard | `ppg_familyid` | Referential | |
| Environment Family | Approval Rule | `ppg_familyid` | Referential | |
| Environment Family | Provisioning Task Template | `ppg_familyid` | Referential | |
| Environment Family | Intake Option | `ppg_suggestedfamilyid` | Referential | |
| Environment Type | Requested Environment | `ppg_typeid` | Referential | |
| Environment Type | Provisioned Environment | `ppg_typeid` | Referential | |
| Environment Type | Provisioning Task Template | `ppg_typeid` | Referential | |
| Environment Type | Environment Type (predecessor) | `ppg_predecessortypeid` | Referential | Self |
| Application Classification | Environment Request | `ppg_appclassificationid`, `ppg_recappclassificationid` | Referential | Confirmed and recommended |
| Application Classification | Application, Provisioned Environment, Intake Option | `ppg_appclassificationid`, `ppg_suggestedappclassificationid` | Referential | |
| Data Classification | Environment Request | `ppg_dataclassificationid`, `ppg_recdataclassificationid` | Referential | Confirmed and recommended |
| Data Classification | Requested Connector, External Integration, Provisioned Environment, Intake Option | `ppg_dataclassificationid`, `ppg_mindataclassificationid` | Referential | |
| Connector | Requested Connector | `ppg_connectorid` | Referential | |
| DLP Policy | Connector | `ppg_dlppolicyid` | Referential | |
| DLP Policy | Provisioned Environment | `ppg_dlppolicyid` | Referential | |
| License Type | Licensing Requirement | `ppg_licensetypeid` | Referential | |
| Review Type | Approval Rule, Review Requirement, Governance Review, Intake Option | `ppg_reviewtypeid`, `ppg_triggerreviewtypeid` | Referential | |
| Approval Rule | Review Requirement | `ppg_approvalruleid` | Referential | |
| Intake Option | Review Requirement | `ppg_intakeoptionid` | Referential | |
| Intake Option | Environment Request | `ppg_workloadtypeid`, `ppg_impactanswerid` | Referential | Single-select groups |
| Provisioning Task Template | Provisioning Task | `ppg_templateid` | Referential | |
| Provisioning Task | Environment Configuration | `ppg_taskid` | Referential | Source task |

## Many-to-many

| Table A | Table B | Relationship name | Purpose |
|---|---|---|---|
| Environment Request | Intake Option | `ppg_environmentrequest_intakeoption` | Data types and capabilities the requestor selected |
| Requested Connector | Requested Environment | `ppg_requestedconnector_requestedenvironment` | Stages that need the connector |
| External Integration | Connector | `ppg_externalintegration_connector` | Connector or custom connector dependency |
| DLP Policy | Environment Family | `ppg_dlppolicy_environmentfamily` | Families a policy applies to |

## Lookups to system tables

| Table | Column | System table | Note |
|---|---|---|---|
| Environment Request | Requestor | User | |
| Stakeholder Assignment | Person (User) | User | |
| Stakeholder Assignment | Person (Contact) | Contact | Non-user stakeholders |
| Organization | Business Unit | Business Unit | Multi-organization deployments |
| Organization, Review Type, Approval Rule, Notification Rule, Provisioning Task Template, Provisioning Task, Governance Review | Team lookups | Team | Queues and authority teams |
| Reviews, decisions, findings, tasks | Reviewer, approver, owner, assignee | User | |
