import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const METADATA_DIR = path.join(DATA_DIR, "metadata");
const RELATED_LINKS_PATH = path.join(DATA_DIR, "related-links.json");
const SITE_DATA_DIR = path.join(ROOT_DIR, "site", "data");
const YEARS = ["2023", "2024", "2025", "2026"];
const OUTPUT_PATH = path.join(SITE_DATA_DIR, "paper-relations.json");

function normalizeName(value = "") {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9一-鿿]+/g, "");
}

function cleanInline(value = "") {
  return value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();
}

function parseRecordTable(block) {
  const fields = {};
  for (const rawLine of block.split("\n")) {
    if (!rawLine.trim().startsWith("|")) continue;
    const line = rawLine.trim().replace(/^\|/, "").replace(/\|$/, "");
    let divider = -1;
    let escaped = false;
    for (let i = 0; i < line.length; i += 1) {
      if (line[i] === "\\" && !escaped) {
        escaped = true;
        continue;
      }
      if (line[i] === "|" && !escaped) {
        divider = i;
        break;
      }
      escaped = false;
    }
    if (divider < 0) continue;
    const key = line.slice(0, divider).trim();
    const value = line.slice(divider + 1).trim().replace(/\\\|/g, "|");
    if (!key || key === "字段" || /^[-: ]+$/.test(key)) continue;
    fields[key] = value;
  }
  return fields;
}

function mentionPattern(name) {
  const parts = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!parts.length) return null;
  const body = parts.join("[\\s\\-–—_]*");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${body}(?=$|[^\\p{L}\\p{N}])`, "iu");
}

function parseYear(year) {
  const indexPath = path.join(METADATA_DIR, `${year}.md`);
  if (!fs.existsSync(indexPath)) return [];
  const source = fs.readFileSync(indexPath, "utf8");
  const headingPattern = /^###\s+(.+?)\s*$/gm;
  const headings = [...source.matchAll(headingPattern)];
  return headings.map((match, index) => {
    const name = match[1].trim();
    const start = match.index + match[0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index : source.length;
    const block = source.slice(start, end);
    const fields = parseRecordTable(block);
    return {
      id: `${year}-${normalizeName(name)}`,
      year: Number(year),
      name,
      title: cleanInline(fields["标题"] || name),
      organization: cleanInline(fields["机构"] || ""),
      abstract: cleanInline(fields["摘要"] || ""),
      comparisons: cleanInline(fields["对比方法"] || ""),
      codeUrl: (fields["代码"] || "").match(/https?:\/\/[^\s）)]+/)?.[0] || ""
    };
  });
}

function buildRelations() {
  const papers = YEARS.flatMap(parseYear);
  const ids = new Set(papers.map((paper) => paper.id));
  const links = [];
  // 「相关工作提及」关系是静态数据（原文未随仓库发布），见 data/related-links.json
  for (const [source, target] of JSON.parse(fs.readFileSync(RELATED_LINKS_PATH, "utf8")).links) {
    if (!ids.has(source) || !ids.has(target)) throw new Error(`related-links.json 中有未知论文：${source} -> ${target}`);
    links.push({ source, target, type: "related" });
  }
  for (const source of papers) {
    for (const target of papers) {
      if (source.id === target.id) continue;
      const pattern = mentionPattern(target.name);
      if (!pattern) continue;
      if (source.comparisons && pattern.test(source.comparisons)) {
        links.push({ source: source.id, target: target.id, type: "comparison" });
      }
    }
  }
  const degree = Object.fromEntries(papers.map((paper) => [paper.id, 0]));
  for (const link of links) {
    degree[link.source] += 1;
    degree[link.target] += 1;
  }
  for (const paper of papers) paper.degree = degree[paper.id];
  return {
    generatedAt: new Date().toISOString(),
    stats: {
      papers: papers.length,
      relatedLinks: links.filter((link) => link.type === "related").length,
      comparisonLinks: links.filter((link) => link.type === "comparison").length
    },
    papers,
    links
  };
}

const relations = buildRelations();
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(relations, null, 2), "utf8");

console.log(
  `已导出 ${relations.papers.length} 篇论文、${relations.links.length} 条关系 -> ${path.relative(process.cwd(), OUTPUT_PATH)}`
);
