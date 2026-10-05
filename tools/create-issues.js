// Creates GitHub issues for epics and features from tools/backlog.js, links features as sub-issues of epics,
// and adds everything to the GitHub Project. Stories and acceptance criteria are written into the feature issue body.
// Idempotent: progress is stored in tools/issues-map.json.
// Usage: node tools/create-issues.js [--dry-run]
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { epics, governanceRequirements } = require("./backlog");

const REPO = "DevonAleshireMSFT/dow-pwr-plat-gov-app";
const OWNER = "DevonAleshireMSFT";
const PROJECT = 9;
const MAP_FILE = path.join(__dirname, "issues-map.json");
const dry = process.argv.includes("--dry-run");

const MILESTONES = { DOC: "M1 Design Docs", MVP: "M2 MVP Solution", P2: "M3 Phase 2" };
const DOC_BASE = `https://github.com/${REPO}/blob/main/docs/`;

const docEpic = {
  id: "E00", title: "Design Documentation", phase: "DOC", labels: ["documentation"],
  summary: "Design documents for the 27 specification deliverables, written in docs/. Review and approval by the governance owner is pending.",
  features: [
    { id: "D-01", title: "Overview, assumptions, and personas", file: "01-overview.md", note: "Deliverables 1 to 3" },
    { id: "D-02", title: "Functional and nonfunctional requirements", file: "02-requirements.md", note: "Deliverables 4 and 5" },
    { id: "D-03", title: "Process, status model, BPF, and requestor intake", file: "03-process.md", note: "Deliverables 6 and 7, plus 03a-requestor-intake.md" },
    { id: "D-04", title: "Dataverse data model", file: "04-data-model/README.md", note: "Deliverables 8 to 10 (44 tables)" },
    { id: "D-05", title: "Security roles and approval routing", file: "05-security.md", note: "Deliverables 11 and 12" },
    { id: "D-06", title: "Rules, connector assessment, and validation catalog", file: "06-rules.md", note: "Deliverables 13, 14, 17" },
    { id: "D-07", title: "Model-driven app design", file: "07-app-design.md", note: "Deliverable 15" },
    { id: "D-08", title: "Automation catalog", file: "08-automation.md", note: "Deliverable 16" },
    { id: "D-09", title: "Audit, evidence, and reporting", file: "09-audit-reporting.md", note: "Deliverables 18 and 19" },
    { id: "D-10", title: "ALM and government-cloud dependencies", file: "10-alm-govcloud.md", note: "Deliverables 20 and 21" },
    { id: "D-11", title: "Delivery: risks, scope, stories, backlog, traceability", file: "11-delivery.md", note: "Deliverables 22 to 27" },
  ],
};

const gh = (args, input) => execFileSync("gh", args, { encoding: "utf8", input }).trim();
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
const save = () => fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");

function createIssue(key, title, body, labels, milestone) {
  if (map[key]) return map[key];
  if (dry) {
    console.log(`[dry] ${key}: ${title} [${labels.join(",")}] (${milestone})`);
    return { number: 0, id: 0, url: "" };
  }
  const args = ["issue", "create", "-R", REPO, "--title", title, "--body-file", "-", "--milestone", milestone];
  for (const l of labels) args.push("--label", l);
  const url = gh(args, body);
  const number = Number(url.split("/").pop());
  const id = Number(gh(["api", `repos/${REPO}/issues/${number}`, "--jq", ".id"]));
  map[key] = { number, id, url };
  save();
  console.log(`created ${key} -> #${number}`);
  sleep(1500);
  return map[key];
}

function linkSub(parent, child, key) {
  if (dry || map[key + ":linked"]) return;
  gh(["api", "-X", "POST", `repos/${REPO}/issues/${parent.number}/sub_issues`, "-F", `sub_issue_id=${child.id}`]);
  map[key + ":linked"] = true;
  save();
  sleep(800);
}

let projectId, fields;
function projectSetup() {
  if (dry) return;
  projectId = gh(["project", "view", String(PROJECT), "--owner", OWNER, "--format", "json", "--jq", ".id"]);
  fields = JSON.parse(gh(["project", "field-list", String(PROJECT), "--owner", OWNER, "--format", "json"])).fields;
}
function addToProject(key, issue, status, priority) {
  if (dry || map[key + ":project"]) return;
  const item = JSON.parse(gh(["project", "item-add", String(PROJECT), "--owner", OWNER, "--url", issue.url, "--format", "json"]));
  const setField = (fieldName, optionName) => {
    const f = fields.find((x) => x.name === fieldName);
    const o = f && f.options.find((x) => x.name === optionName);
    if (!o) return;
    gh(["project", "item-edit", "--id", item.id, "--project-id", projectId, "--field-id", f.id, "--single-select-option-id", o.id]);
  };
  setField("Status", status);
  setField("Priority", priority);
  map[key + ":project"] = true;
  save();
  sleep(800);
}

const trace = Object.fromEntries(governanceRequirements.map((g) => [g.id, g.text]));
const priorityFor = (epic, phase) => (phase === "P2" ? "P2" : ["E01", "E12"].includes(epic.id) ? "P0" : "P1");

function epicBody(e) {
  const lines = [e.summary, "", "## Features", ""];
  for (const f of e.features) lines.push(`- ${f.id} ${f.title}`);
  lines.push("", "Sub-issues are linked below. Source: `tools/backlog.js`, design in `docs/`.");
  return lines.join("\n");
}

function featureBody(e, f, phase) {
  if (f.file) {
    return [
      `Design document: ${DOC_BASE}${f.file}`, "", f.note, "",
      "Status: drafted, pending review by the governance owner.", "",
      "## Done when", "", "- [ ] Reviewed and comments resolved", "- [ ] Open decisions in the document assigned to an owner",
    ].join("\n");
  }
  const lines = [];
  lines.push(`Epic: ${e.id} ${e.title}`, `Phase: ${phase === "MVP" ? "MVP" : "Phase 2"}`, "");
  if ((f.trace || []).length) {
    lines.push("Traces to:");
    for (const t of f.trace) lines.push(`- ${t} ${trace[t]}`);
    lines.push("");
  }
  lines.push("## Stories", "");
  for (const s of f.stories) {
    lines.push(`### ${s.id} ${s.title}`, "", s.story, "", "Acceptance criteria:", "");
    for (const a of s.ac) lines.push(`- [ ] ${a}`);
    lines.push("");
  }
  lines.push("Design docs: https://github.com/" + REPO + "/tree/main/docs");
  return lines.join("\n");
}

projectSetup();
for (const e of [docEpic, ...epics]) {
  const eKey = `epic:${e.id}`;
  const epicIssue = createIssue(eKey, `[Epic] ${e.id} ${e.title}`, epicBody(e), ["epic", ...e.labels], MILESTONES[e.phase]);
  addToProject(eKey, epicIssue, e.phase === "DOC" ? "In review" : "Backlog", priorityFor(e, e.phase));
  for (const f of e.features) {
    const phase = f.phase || e.phase;
    const fKey = `feature:${f.id}`;
    const labels = ["feature", ...(f.labels || e.labels)];
    const unique = [...new Set(labels)];
    const issue = createIssue(fKey, `${f.id}: ${f.title}`, featureBody(e, f, phase), unique, MILESTONES[phase]);
    linkSub(epicIssue, issue, fKey);
    addToProject(fKey, issue, phase === "DOC" ? "In review" : "Backlog", priorityFor(e, phase));
  }
}
console.log(dry ? "dry run complete" : "done");
