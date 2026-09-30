# Harness-RSI

自进化 Harness（LLM 系统改进自身提示词 / 工作流 / 工具 / 记忆 / 代码）方向的论文图谱：收录 118 篇（2023–2026），记录论文之间的引用与对比关系，以及各论文的评价方式。完整背景见 [README.md](../README.md)。

## 目录约定

- `data/metadata/<年份>.md`：论文记录，每篇 `### 论文名` + 字段表（标题 / 机构 / 摘要 / 代码 / 对比方法）。手写。
- `data/related-links.json`：「论文 A 的相关工作提及论文 B」的关系对（用论文 id），关系图的「相关工作」边全来自这里。**相关工作原文和阅读笔记已移出项目、不开源**，归档在项目同级的 `../归档/Harness-RSI-相关工作与阅读笔记/`，不要再放回仓库。
- `data/evaluation.md`：评价方式。先看开头的「评价判定模型」再改。同一论文既有客观又有主观指标时拆成多行，不使用「混合」。
- `data/excluded.md`：已审核并判定不收录的论文，遇到无需重复评估。
- `PAPERS.md`：论文目录，新增论文时同步更新篇数和条目。
- `site/data/*.json`：由脚本生成，**不要手改**。
- `papers/`：本地缓存的 PDF / 全文，已在 `.gitignore` 里，**不要提交**（版权归原作者）。

## 新增或修改论文后

```bash
npm run build     # 重新生成 site/data，输出的论文数 / 关系数应与预期一致
npm run serve     # http://localhost:4322 预览
```

新增论文要同时改：`data/metadata/<年份>.md`、`PAPERS.md`（目录和篇数）、`data/related-links.json`（补上新论文提及 / 被提及的关系）、`data/evaluation.md`（如有评测记录）、`site/index.html` 和两份 README 里写死的篇数 / 数据集数 / 关系数（以 `npm run build` 输出为准）。

## 约定

- 页面上不出现本地文件路径、脚本路径这类表述。
- 「对比方法」边靠在对比方法文本里匹配论文名得到，论文名改动会影响关系，改完要重新 build；「相关工作」边是 `related-links.json` 里的静态数据，论文改名要同步改 id。
- `data/metadata/` 里的摘要是对原论文的翻译，版权归原作者，见 `data/LICENSE`；不要整段搬运全文，也不要把相关工作原文、阅读笔记写回仓库。
- 提交身份、推送和 Pages 设置见全局 CLAUDE.md；本项目是个人 GitHub 项目，remote 应是 github.com，不要使用内网身份。
