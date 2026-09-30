import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const EVALUATION_PATH = path.join(ROOT_DIR, "data", "evaluation.md");
const RELATIONS_PATH = path.join(ROOT_DIR, "site", "data", "paper-relations.json");
const OUTPUT_PATH = path.join(ROOT_DIR, "site", "data", "paper-dataset-relations.json");

function normalizeName(value = "") {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "");
}

function splitMarkdownCells(rawLine) {
  const line = rawLine.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cell = "";
  let escaped = false;
  for (const char of line) {
    if (char === "\\" && !escaped) {
      escaped = true;
      cell += char;
      continue;
    }
    if (char === "|" && !escaped) {
      cells.push(cell.trim().replace(/\\\|/g, "|"));
      cell = "";
      continue;
    }
    escaped = false;
    cell += char;
  }
  cells.push(cell.trim().replace(/\\\|/g, "|"));
  return cells;
}

function loadPaperIndex() {
  if (!fs.existsSync(RELATIONS_PATH)) {
    console.error("找不到 site/data/paper-relations.json，请先运行 npm run export:paper-relations");
    process.exit(1);
  }
  const relations = JSON.parse(fs.readFileSync(RELATIONS_PATH, "utf8"));
  const index = new Map();
  for (const paper of relations.papers) {
    index.set(normalizeName(paper.name), paper.id);
  }
  return index;
}

function parseMarkdownTables(lines) {
  const tables = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) continue;
    if (!lines[index + 1]?.trim().match(/^\|?[\s:|-]+\|?$/)) continue;
    const headers = splitMarkdownCells(lines[index]);
    index += 1;
    const rows = [];
    while (index + 1 < lines.length && lines[index + 1].trim().startsWith("|")) {
      index += 1;
      const cells = splitMarkdownCells(lines[index]);
      rows.push(Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || ""])));
    }
    tables.push({ headers, rows });
  }
  return tables;
}

function parseJudgmentModel(content) {
  const firstCategoryIndex = content.search(/^##\s+[A-Z]\.\s+/m);
  const preamble = firstCategoryIndex >= 0 ? content.slice(0, firstCategoryIndex) : content;
  const lines = preamble.split("\n");
  const tables = parseMarkdownTables(lines);
  const notes = lines.filter((line) => /^>\s?/.test(line)).map((line) => line.replace(/^>\s?/, "").trim());
  const natureTable = tables.find((t) => t.headers[0] === "评价性质") || null;
  const scorerTable = tables.find((t) => t.headers[0] === "评分器/执行方式") || null;
  return {
    nature: natureTable ? natureTable.rows.map((r) => ({ nature: r["评价性质"], criterion: r["判定标准"], examples: r["典型情形"] })) : [],
    scorer: scorerTable ? scorerTable.rows.map((r) => ({ scorer: r["评分器/执行方式"], note: r["说明"] })) : [],
    notes
  };
}

function parseEvaluationDocument(paperIndex) {
  const content = fs.readFileSync(EVALUATION_PATH, "utf8");
  const judgmentModel = parseJudgmentModel(content);
  const lines = content.split("\n");
  const categories = [];
  const datasets = [];
  const records = [];
  const links = [];
  const unresolvedMentions = new Set();
  let category = null;
  let subsection = "";
  let tableHeaders = null;

  for (let index = 0; index < lines.length; index += 1) {
    const categoryHeading = lines[index].match(/^##\s+([A-Z])\.\s+(.+)$/);
    if (categoryHeading) {
      category = { id: categoryHeading[1], title: categoryHeading[2] };
      categories.push(category);
      subsection = "";
      tableHeaders = null;
      continue;
    }
    const heading = lines[index].match(/^###\s+(.+)$/);
    if (heading) {
      subsection = heading[1];
      tableHeaders = null;
      continue;
    }
    if (/^##\s+/.test(lines[index])) {
      subsection = "";
      tableHeaders = null;
      continue;
    }
    if (!lines[index].trim().startsWith("|")) {
      if (lines[index].trim()) tableHeaders = null;
      continue;
    }
    if (lines[index + 1]?.trim().match(/^\|?[\s:|-]+\|?$/)) {
      tableHeaders = splitMarkdownCells(lines[index]);
      index += 1;
      continue;
    }
    if (!tableHeaders) continue;

    const cells = splitMarkdownCells(lines[index]);
    const values = Object.fromEntries(tableHeaders.map((header, cellIndex) => [header, cells[cellIndex] || ""]));

    if (subsection.includes("数据集定义")) {
      datasets.push({
        id: values.ID,
        name: values["数据集/版本"],
        description: values["任务描述"],
        example: values["代表例"],
        categoryId: category?.id || "",
        categoryTitle: category?.title || ""
      });
    }

    if (subsection.includes("论文使用记录")) {
      const datasetId = values["数据集 ID"];
      const paperNames = (values["使用论文"] || "").split(/\s*[、,，;；]\s*/).filter(Boolean);
      const setting = values["实验设置/切分"];
      const metric = values["评价指标"];
      const nature = values["评价性质"];
      const basis = values["判定依据"];
      const scorer = values["评分器/执行方式"];

      const paperIds = [];
      for (const name of paperNames) {
        const paperId = paperIndex.get(normalizeName(name)) || null;
        if (!paperId) unresolvedMentions.add(name);
        else paperIds.push(paperId);
        links.push({ datasetId, paperName: name, paperId, setting, metric, nature, basis, scorer });
      }

      records.push({ datasetId, paperNames, paperIds, setting, metric, nature, basis, scorer });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    stats: {
      categories: categories.length,
      datasets: datasets.length,
      records: records.length,
      objectiveRecords: records.filter((r) => r.nature === "客观").length,
      subjectiveRecords: records.filter((r) => r.nature === "主观").length,
      paperDatasetLinks: links.length,
      unresolvedPaperMentions: unresolvedMentions.size
    },
    judgmentModel,
    categories,
    datasets,
    records,
    links,
    unresolvedMentions: [...unresolvedMentions].sort()
  };
}

const paperIndex = loadPaperIndex();
const evaluation = parseEvaluationDocument(paperIndex);
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(evaluation, null, 2), "utf8");

console.log(
  `已导出 ${evaluation.datasets.length} 个数据集、${evaluation.records.length} 条使用记录、${evaluation.links.length} 条论文-数据集关系 -> ${path.relative(process.cwd(), OUTPUT_PATH)}`
);
if (evaluation.unresolvedMentions.length) {
  console.log(`未能匹配到论文 id 的名字（${evaluation.unresolvedMentions.length} 个）：${evaluation.unresolvedMentions.join("、")}`);
}
