// Generates sections 25, 26, and 27 of docs/11-delivery.md from tools/backlog.js.
const fs = require("fs");
const path = require("path");
const { epics, governanceRequirements } = require("./backlog");

const phaseOf = (epic, feature) => feature.phase || epic.phase;
const phaseLabel = (p) => (p === "MVP" ? "MVP" : "Phase 2");

const errors = [];
const featureIds = new Set();
const storyIds = new Set();
const grIds = new Set(governanceRequirements.map((g) => g.id));
for (const e of epics) {
  for (const f of e.features) {
    if (featureIds.has(f.id)) errors.push(`Duplicate feature ${f.id}`);
    featureIds.add(f.id);
    for (const t of f.trace || []) if (!grIds.has(t)) errors.push(`Unknown requirement ${t} on ${f.id}`);
    for (const s of f.stories) {
      if (storyIds.has(s.id)) errors.push(`Duplicate story ${s.id}`);
      storyIds.add(s.id);
      if (!s.ac || s.ac.length === 0) errors.push(`No acceptance criteria on ${s.id}`);
    }
  }
}
const covered = new Set(epics.flatMap((e) => e.features.flatMap((f) => f.trace || [])));
for (const g of governanceRequirements) if (!covered.has(g.id)) errors.push(`Requirement ${g.id} has no feature`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const out = [];
out.push("## 25. User stories with acceptance criteria", "");
for (const e of epics) {
  for (const f of e.features) {
    out.push(`### ${f.id}: ${f.title}`, "");
    for (const s of f.stories) {
      out.push(`**${s.id} ${s.title}**`, "", s.story, "", "Acceptance criteria:", "");
      for (const a of s.ac) out.push(`- ${a}`);
      out.push("");
    }
  }
}

out.push("## 26. Implementation backlog", "");
out.push("Epic, feature, and story hierarchy. Phase is MVP (milestone M2) or Phase 2 (milestone M3).", "");
out.push("| Epic | Feature | Story | Phase |", "|---|---|---|---|");
for (const e of epics) {
  out.push(`| **${e.id} ${e.title}** | | | ${phaseLabel(e.phase)} |`);
  for (const f of e.features) {
    out.push(`| | **${f.id} ${f.title}** | | ${phaseLabel(phaseOf(e, f))} |`);
    for (const s of f.stories) out.push(`| | | ${s.id} ${s.title} | ${phaseLabel(phaseOf(e, f))} |`);
  }
}
const count = epics.reduce((n, e) => n + e.features.reduce((m, f) => m + f.stories.length, 0), 0);
out.push("", `Totals: ${epics.length} epics, ${featureIds.size} features, ${count} stories.`, "");

out.push("## 27. Traceability matrix", "");
out.push("Maps governance requirements from the source specification to application features, the design documents, and functional requirements.", "");
const docMap = {
  "GR-01": "[05](05-security.md)", "GR-02": "[01](01-overview.md), [04](04-data-model/config-reference.md)", "GR-03": "[04](04-data-model/config-reference.md)",
  "GR-04": "[04](04-data-model/config-reference.md), [10](10-alm-govcloud.md)", "GR-05": "[10](10-alm-govcloud.md)", "GR-06": "[03a](03a-requestor-intake.md)",
  "GR-07": "[04](04-data-model/README.md)", "GR-08": "[04](04-data-model/provisioning-lifecycle.md)", "GR-09": "[06](06-rules.md)",
  "GR-10": "[03a](03a-requestor-intake.md), [06](06-rules.md)", "GR-11": "[06](06-rules.md)", "GR-12": "[04](04-data-model/README.md)",
  "GR-13": "[04](04-data-model/request.md), [08](08-automation.md)", "GR-14": "[03](03-process.md)", "GR-15": "[03](03-process.md)",
  "GR-16": "[06](06-rules.md)", "GR-17": "[05](05-security.md)", "GR-18": "[06](06-rules.md)", "GR-19": "[04](04-data-model/request.md)",
  "GR-20": "[04](04-data-model/request.md)", "GR-21": "[04](04-data-model/request.md)", "GR-22": "[09](09-audit-reporting.md)",
  "GR-23": "[04](04-data-model/provisioning-lifecycle.md)", "GR-24": "[03](03-process.md), [04](04-data-model/provisioning-lifecycle.md)",
  "GR-25": "[04](04-data-model/provisioning-lifecycle.md)", "GR-26": "[04](04-data-model/provisioning-lifecycle.md)", "GR-27": "[04](04-data-model/provisioning-lifecycle.md)",
  "GR-28": "[05](05-security.md)", "GR-29": "[07](07-app-design.md)", "GR-30": "[08](08-automation.md)", "GR-31": "[06](06-rules.md)",
  "GR-32": "[09](09-audit-reporting.md)", "GR-33": "[02](02-requirements.md)", "GR-34": "[10](10-alm-govcloud.md)", "GR-35": "[09](09-audit-reporting.md)",
};
out.push("| Req | Governance requirement | Design docs | Features | Stories |", "|---|---|---|---|---|");
for (const g of governanceRequirements) {
  const feats = [];
  const stories = [];
  for (const e of epics) for (const f of e.features) if ((f.trace || []).includes(g.id)) {
    feats.push(f.id);
    for (const s of f.stories) stories.push(s.id);
  }
  out.push(`| ${g.id} | ${g.text} | ${docMap[g.id] || ""} | ${feats.join(", ")} | ${stories.join(", ")} |`);
}
out.push("");

const file = path.join(__dirname, "..", "docs", "11-delivery.md");
const text = fs.readFileSync(file, "utf8");
const begin = "<!-- BEGIN GENERATED -->";
const end = "<!-- END GENERATED -->";
const i = text.indexOf(begin);
const j = text.indexOf(end);
if (i < 0 || j < 0) throw new Error("Markers not found in docs/11-delivery.md");
fs.writeFileSync(file, text.slice(0, i + begin.length) + "\n\n" + out.join("\n") + "\n" + text.slice(j));
console.log(`Generated ${epics.length} epics, ${featureIds.size} features, ${count} stories.`);
