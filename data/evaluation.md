# 评价方式

## 评价判定模型

| 评价性质 | 判定标准 | 典型情形 |
|---|---|---|
| 客观 | 存在预先确定、原则上可复验的正确性或数值依据 | 标准/参考答案、语义等价、单测、约束、环境终态、公式计算 |
| 主观 | 结果依赖质量判断，评分者可在合理范围内给出不同结论 | 按评分量规评价完整性/质量，或对开放结果做偏好比较 |

| 评分器/执行方式 | 是否自动决定主客观性 | 说明 |
|---|---|---|
| 程序/规则 | 否 | 可以做答案匹配、单测、约束检查或指标计算。 |
| LLM | 否 | 对参考答案做语义判等时仍属于客观评价；按评分量规或开放偏好判断质量时属于主观评价。 |
| 人工 | 否 | 核对参考答案可以是客观评价；专家按评分量规打分属于主观评价。 |

> `Accuracy`、`Pass Rate` 只是聚合名称，LLM/人工也只是评分器。主客观性由“依据是否预先确定且原则上可复验”决定。
> 若同一论文同时报告客观指标和主观指标，必须拆成多行，不使用“混合”作为评价性质。

## A. 通用问答、数学、分类与推理

### A.1 数据集定义

| ID | 数据集/版本 | 任务描述 | 代表例 |
|---|---|---|---|
| A01 | GSM8K | 8.5K 小学多步数学文字题 | 买入和送出若干物品后还剩多少 |
| A02 | MATH | 12.5K 竞赛数学题，含完整推导 | 求代数方程或证明几何结论 |
| A03 | AIME（2020–2026 各年份） | AIME 竞赛题，答案通常为 000–999 整数 | 组合计数题求三位数答案 |
| A04 | MultiArith / SVAMP / AddSub / AQuA-RAT / SingleEq | 算术文字题族 | 根据若干数量关系求未知数 |
| A05 | BBH / BIG-Bench 子任务 | BIG-Bench 中 23 个困难任务及若干原始子任务 | 追踪物体交换、判断形式谬误、单词排序 |
| A06 | Instruction Induction / BBII | 由少量输入输出示例归纳隐藏自然语言指令 | 由大小写转换样例猜任务 |
| A07 | HotpotQA | 多跳问答，需要组合多个 Wikipedia 证据 | 先找人物所属机构，再问机构所在地 |
| A08 | 2WikiMultiHopQA | 跨两篇 Wikipedia 的多跳问答 | 比较两个人物的出生地 |
| A09 | MuSiQue | 组合式、多跳问答，强调不可捷径推理 | 沿实体关系链查最终答案 |
| A10 | DROP | 段落上的离散推理阅读理解 | 从比赛描述计算分差 |
| A11 | MMLU / MMLU-Pro | 多学科选择题；Pro 为更难、多选项版本 | 大学物理概念题 |
| A12 | GPQA / GPQA-Diamond | 研究生级“Google-proof”科学选择题 | 高级化学机理判断 |
| A13 | TruthfulQA | 针对常见误解与虚假前提的问答 | 某个广泛流传的健康说法是否真实 |
| A14 | HLE / Humanity's Last Exam | 专家级跨学科题 | 需要专业知识与推理的生物医学问题 |
| A15 | GAIA | 真实通用助手任务，常需网页、文件与工具 | 下载表格、计算并回答 |
| A16 | LawBench（刑事罪名预测） | 中文法律文本分类 | 根据案情预测罪名 |
| A17 | FiNER | XBRL 财报 token 级金融实体识别 | 标注 monetary amount/entity 类型 |
| A18 | USPTO-50k | 给定反应产物预测反应物/前体 | 由目标 SMILES 反推 reactants |
| A19 | Symptom2Disease | 由症状文本预测 22 类疾病 | 发热、咳嗽等描述映射到疾病 |
| A20 | AEGIS2 | 安全/违规类别分类 | 判断用户提示安全与否并识别违规类型 |
| A21 | ETHOS | 仇恨言论二分类 | 判断一句话是否仇恨 |
| A22 | LIAR / Arabic Sarcasm | LIAR 为政治陈述真假分类；Arabic Sarcasm 为讽刺检测。 | — |
| A23 | SST-2/SST-5、CR、MR、AG News、TREC、Subj、CB、MPQA | 情感、新闻主题、问题类型、主观性、文本蕴含等标准分类集 | 将问题分到“人物/地点/数值” |
| A24 | SAMSum / ASSET | 对话摘要与文本简化 | 把聊天压缩为摘要、把复杂句简化 |
| A25 | HoVer / IFBench / PUPA / LiveBench-Math | HoVer 为证据检索验证；其余分别评指令遵循、提示优化或动态数学。 | — |
| A26 | PubMedQA | 生物医学文献 yes/no/maybe 问答 | 依据摘要判断研究问题 |
| A27 | SearchQA / Bamboogle / WebWalkerQA / DeepSearchQA / xBench-DeepSearch / FinSearchComp | 搜索增强或深度网页检索问答族 | 跨多个页面找到并综合短答案 |
| A28 | OfficeQA | 约 89K 页美国财政部公报上的长文档问答 | 查询某年某项财政数值 |
| A29 | SealQA / BrowseComp | 噪声检索下的搜索问答与难搜索事实问答 | 从多个网页找唯一实体 |
| A30 | DocVQA | 文档图像问答 | 从扫描表单/票据读取字段 |
| A31 | WikiTableQuestions / HiTab | 自然语言表格问答；HiTab 含层级表头 | 计算表中两年的差值 |

### A.2 论文使用记录

| 数据集 ID | 使用论文 | 实验设置/切分 | 评价指标 | 评价性质 | 判定依据 | 评分器/执行方式 |
|---|---|---|---|---|---|---|
| A01 | OPRO、Promptbreeder、PE2、TextGrad、Trace-OptoPrime、REVOLVE、EvoFlow、FLEX、AFlow | — | 最终答案 accuracy/solve rate。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A02 | CRAFT、TroVE、AgentOptimizer、Symbolic-Learning、AFlow、MASS、EvoFlow | algebra 881；7 学科；L5 617；难题 617 | answer accuracy/solve rate。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A03 | Dynamic-Cheatsheet | — | functionally-correct accuracy | 客观 | 可执行规则、约束或环境终态 | 检查答案是否满足题目约束；允许与参考答案不同的等价表示 |
| A03 | GEPA | — | AIME-2025 score | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A03 | Training-Free-GRPO | — | AIME24/25 Mean@32 | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A03 | FLEX | — | AIME25 accuracy | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A03 | ShinkaEvolve | — | AIME23/24/25 accuracy | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A03 | Trace2Skill | AIME-2026 | avg@8 | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A04 | OPRO、Promptbreeder、PE2、EvoFlow | MultiArith transfer；全族；MultiArith；MultiArith | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A05 | APE | BBII 21 个任务 | accuracy / normalized score | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A05 | LATM | 4 个 BIG-Bench 子任务 | accuracy | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A05 | Deep Language Networks | 4 个 BBH 子任务及其余 BIG-Bench | accuracy | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A05 | OPRO、EvoPrompt、Promptbreeder、AutoLongPrompt、PE2、TextGrad、Trace-OptoPrime、REVOLVE | — | accuracy/归一化分。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A06 | APE | — | zero-shot execution accuracy、IQM，log-likelihood | 客观 | 标准答案或参考答案；可量化目标值或过程记录 | 标准答案、参考标签或容差匹配；连续目标或过程/资源统计 |
| A06 | Promptbreeder、PE2 | — | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A07 | MIPRO | HotpotQA | EM | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| A07 | Symbolic-Learning | HotpotQA-hard | F1；EM | 客观 | 标准答案或参考答案 | 标准答案/答案 token 重叠 |
| A07 | AFlow | 1000 samples | F1 | 客观 | 标准答案或参考答案 | 标准答案 token 重叠 |
| A07 | MASS | HotpotQA | F1 | 客观 | 标准答案或参考答案 | 标准答案 token 重叠 |
| A07 | GEPA、Feedback Descent | HotpotQA | 原生 QA score | 客观 | 标准答案或参考答案 | 基准标准答案 scorer |
| A07 | AutoAgent | — | EM | 客观 | 标准答案 | exact match scorer |
| A07 | AutoAgent | — | faithfulness、completeness | 主观 | 忠实性与完整性评分量规 | LLM judge |
| A07 | POLCA | — | Pass@1/test score。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A08 | MASS | — | F1 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A08 | AutoAgent | — | EM | 客观 | 标准答案 | exact match scorer |
| A08 | AutoAgent | — | faithfulness、completeness | 主观 | 忠实性与完整性评分量规 | LLM judge |
| A09 | MASS | — | F1 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A09 | AutoAgent | — | EM | 客观 | 标准答案 | exact match scorer |
| A09 | AutoAgent | — | faithfulness、completeness | 主观 | 忠实性与完整性评分量规 | LLM judge |
| A10 | ADAS、Gödel Agent、AFlow、MASS | — | F1。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A11 | Deep Language Networks、TextGrad、ADAS、Gödel Agent、REVOLVE | ML/Physics；ML/Physics | accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A11 | Dynamic-Cheatsheet | — | MMLU-Pro Engineering/Physics soft-match accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A12 | TextGrad、ADAS、Gödel Agent、REVOLVE | — | accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A12 | Dynamic-Cheatsheet | — | soft-match accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A13 | APE | 生成式回答 | truthfulness、informativeness 百分比 | 客观 | TruthfulQA 的正确/错误参考回答与信息性标签 | GPT-judge / GPT-info 分类器 |
| A14 | STELLA | 生物医学 50 | gold accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A14 | Alita-G、YunjueAgent、AutoAgent、Memento-Skills | Alita-G 抽样 100；其余见各论文 | accuracy / pass@k | 客观 | 标准答案或参考答案 | LLM grader、官方 grader 或标准答案；各论文协议不同 |
| A15 | AgentOptimizer、OS-Copilot、Alita-G、MemEvolve、Memento-Skills | 各论文选用的 GAIA split | success / accuracy / pass@k | 客观 | 参考答案与明确任务完成条件 | 官方、人工或 LLM grader；各实现不同 |
| A15 | AutoAgent | GAIA | pass@1；average steps | 客观 | 参考答案与明确任务完成条件；步数为过程记录 | o3-mini judge；步数直接统计 |
| A16 | MetaContextEngineering、Meta-Harness | — | micro-F1 / test accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A17 | ACE、MetaContextEngineering、Meta-Harness | — | exact/prediction accuracy 或 pass@1。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A18 | ACE、MetaContextEngineering、Meta-Harness、FLEX | — | exact-match/pass@1 accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A19 | MetaContextEngineering、Meta-Harness | — | prediction/test accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A20 | MetaContextEngineering | — | F1。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A21 | ProTeGi | — | test F1 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A21 | Promptbreeder | — | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A22 | ProTeGi | — | 各自 test F1。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A23 | EvoPrompt、Deep Language Networks、PromptAgent | — | accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A23 | PromptAgent | NCBI | F1 | 客观 | 标准答案或参考答案 | 参考实体标签匹配 |
| A24 | EvoPrompt | SAMSum / ASSET | ROUGE-1/2/L；SARI | 客观 | 标准答案或参考答案 | 参考文本自动指标；不等价于人工偏好 |
| A25 | MIPRO | — | HoVer Recall@21 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A25 | GEPA、Feedback Descent | HotpotQA / IFBench / HoVer / LiveBench-Math；PUPA 的泄漏项 | 原生 score/aggregate | 客观 | 标准答案、输出约束、gold documents 或 PII 泄漏条件 | 各基准原生规则、答案或约束检查器 |
| A25 | GEPA、Feedback Descent | PUPA 的回答质量项 | response-quality score | 主观 | 回答质量评分量规 | PUPA 原生质量 evaluator |
| A26 | SkillGen | — | native accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A27 | SkillOpt | SearchQA | hard/EM | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A27 | AutoAgent | Bamboogle | EM | 客观 | 标准答案 | exact match scorer |
| A27 | AutoAgent | Bamboogle | faithfulness、completeness | 主观 | 忠实性与完整性评分量规 | LLM judge |
| A27 | Training-Free-GRPO、MemEvolve | WebWalkerQA | Pass@k | 客观 | 参考答案 | 基准官方/语义 grader |
| A27 | YunjueAgent | 后三者 | LLM-judge accuracy。 | 客观 | 参考答案的语义等价性 | LLM/模型裁判 |
| A28 | EvoSkill | — | 五级容差 fuzzy score 与 exact accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A28 | SkillOpt、WikiSkill | — | native hard/EM accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A29 | EvoSkill | SealQA；BrowseComp transfer | accuracy | 客观 | 参考答案的语义等价性 | 原基准 LLM auto-grader / 语义 grader |
| A29 | WikiSkill | SealQA | average accuracy。 | 客观 | 参考答案的语义等价性 | LLM/模型裁判 |
| A30 | Trace2Skill | DocVQA | ANLS；Accuracy(ANLS≥0.5) | 客观 | 标准答案或参考答案 | 参考答案的归一化编辑相似度 |
| A30 | SkillOpt | — | native hard score。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A31 | TROVE | WTQ/HiTab | accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A31 | Trace2Skill | WikiTQ/HiTab | denotation/accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| A31 | SkillGrad | WikiTQ | denotation accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |

## B. Agent、网页、办公与交互环境

### B.1 数据集定义

| ID | 数据集/版本 | 任务描述 | 代表例 |
|---|---|---|---|
| B01 | ALFWorld | 文本化家居具身环境，6 类任务 | 清洁并加热某物后放到指定位置 |
| B02 | ScienceWorld / SciWorld | 文本科学实验环境 | 通过多步操作加热、混合或测量物体 |
| B03 | TravelPlanner | 带日期、预算、交通、餐饮等约束的行程规划 | 生成三日跨城行程且满足预算 |
| B04 | WebShop | 模拟购物网站任务 | 购买满足颜色、功能、价格条件的商品 |
| B05 | WebArena | 自托管真实风格网站（购物、论坛、GitLab、地图等） | 在论坛发布满足条件的帖子 |
| B06 | VisualWebArena | 在 WebArena 类网站上以截图为主要观测 | 根据视觉界面完成分类信息操作 |
| B07 | WebVoyager | 15 个真实网站、643 个浏览任务 | 在航空网站查指定日期航班 |
| B08 | Mind2Web / Online-Mind2Web | 从网页交互轨迹构建的任务；Online 版在真实网站执行 | 搜索并筛选一个商品 |
| B09 | AppWorld | 多个模拟 app 及 API 的组合任务 | 根据邮件创建日程并更新联系人 |
| B10 | SpreadsheetBench / SpreadsheetBench-Verified | 真实电子表格操作 | 修复公式、填充单元格并保存工作簿 |
| B11 | SheetCopilot-20 | 20 个电子表格自动化任务 | 创建公式或图表 |
| B12 | SkillsBench | 配套 SKILL.md 的跨领域 agent 任务与确定性 verifier | 使用技能完成文件/代码/办公任务 |
| B13 | SkillLearnBench | 20 类技能学习任务、100 个已验证实例 | 创建并复用技能完成后续任务 |
| B14 | SkillCraft benchmark | 改编 Toolathlon、AgentCompany、WebArena、M3ToolEval，并加入 API/文件/数据任务 | 把原子工具组合成可复用技能 |
| B15 | Terminal-Bench 2 | 在隔离终端/容器内完成长程系统任务 | 安装、配置并修复服务 |
| B16 | SWE-bench（Verified/Lite/Pro/Multilingual） | 真实 GitHub issue 驱动的软件修复 | 修改仓库代码并通过隐藏测试 |
| B17 | BFCL（V3/V4） | 函数调用选择、参数填写与多轮工具使用 | 为天气请求选择函数并填地点 |
| B18 | TextArena / Mastermind | 145 个单/双人文本游戏；Mastermind 是猜隐藏序列。 | — |
| B19 | MiniWoB++ | 浏览器小任务环境 | 点击指定按钮、填写表单 |
| B20 | MineDojo/Minecraft / MCU | 开放 Minecraft 与长程任务 | 从木器逐步制作钻石装备 |
| B21 | Pokémon/PokeAgent Challenge | Pokémon Red/Emerald 等游戏与里程碑 | 以较少按键获得徽章 |
| B22 | Science/Tool environments：M3Tool、M3ToolEval、MCPBench | 多工具选择与组合调用 | 从大量工具中选正确 API 并完成任务 |
| B23 | SocialMaze | 多种社会推理/交互子任务（FTS、UPI、HRD、REFT、RDP、SGA） | 在隐藏意图与规则下完成交互目标 |
| B24 | τ-bench retail | 零售客服工具调用和数据库状态任务 | 按政策取消订单或退货 |
| B25 | SOPBench | 134 个银行 SOP 遵循任务（40 val/94 test） | 按规定流程处理银行服务请求 |
| B26 | WildClawBench | 60 个真实多模态工具任务、六能力域 | 读取 Slack 完整消息并生成带期限的任务 |
| B27 | TheAgentCompany / AgentCompany | 模拟公司内跨应用长程任务 | 依据工单修改代码并沟通结果 |
| B28 | PDDL / RLCard / NetHack / Jericho | 规划、棋牌、地牢、文本冒险环境 | 规划动作序列、玩 Blackjack、探索 Zork |
| B29 | VisualToolBench / TIR-Bench / MMSearch-Plus / MMBrowseComp / AgentVista | 多模态工具推理、图像处理、搜索与浏览任务 | 旋转/裁剪图像后识别小目标 |
| B30 | SkillFlow（FE/OS/HLS/GS/DDI） | 五领域跨域迁移任务套件 | 把一个领域形成的 artifact 迁移到另一领域 |
| B31 | OfficeBench-DOCX / VAREX / TSBench | 办公文档、视觉/任务执行与工具技能迁移评测 | 按要求修改 DOCX 并保存 |
| B32 | 自建真实任务 Batch 1/2 | 30 个网页检索、可视化、浏览器自动化、音频任务 | 处理音频并汇总结果 |
| B33 | 云技术支持内部工单 | Account/Domain/DNS/OSS/ECS，1883 工单/3737 任务 | 参考历史解决方案诊断 DNS 问题 |

### B.2 论文使用记录

| 数据集 ID | 使用论文 | 实验设置/切分 | 评价指标 | 评价性质 | 判定依据 | 评分器/执行方式 |
|---|---|---|---|---|---|---|
| B01 | AutoManual、AgentSquare、EvoFlow、Memp、AutoRefine、Skill-Pro、AutoAgent、SkillGen、SkillOpt、WikiSkill | unseen 134；Train/OOD | success rate | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B01 | Memp、AutoAgent | ALFWorld | steps；path similarity | 客观 | 可量化目标值或过程记录 | 轨迹与近优示范的距离/相似度统计 |
| B02 | SSO | — | reward/score | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| B02 | AgentSquare、EvoAgent、AutoRefine、SkillGen、OpenSkill | — | native success/score。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B03 | EvoAgent | — | delivery/common-sense/hard-constraint/final pass | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B03 | AgentSquare、AutoRefine | — | native success | 客观 | 可执行规则、约束或环境终态 | 行程约束与任务完成条件检查 |
| B03 | Memp | TravelPlanner | #CS、#HC；steps | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 常识/硬约束检查器；步数直接统计 |
| B04 | AgentSquare | — | task-specific success/score。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B05 | AgentSquare、AutoManual、ASI、SkillWeaver、WALT、PolySkill、WebXSkill | Reddit | task success；通常另报 steps。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B06 | WALT | Classifieds / Shopping / Reddit | 分域与加权 success；steps | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 基准 evaluator function 客观检查任务完成；步数直接统计 |
| B07 | WebCoach、WebXSkill | — | task success（基于 WebVoyager LLM/视觉 evaluator）；time/steps。 | 客观 | 预先给定的网页任务意图与可观察完成状态；time/steps 为过程记录 | LLM/视觉 evaluator 判断是否完成任务；时间与步数直接统计 |
| B08 | PolySkill | Mind2Web | success；steps；skill reuse | 客观 | 预先给定的任务意图与人类轨迹信息；steps/reuse 为过程记录 | GPT-4.1 自动裁判判断任务是否完成；步数与复用次数直接统计 |
| B08 | SkillWeaver、WebXSkill | Online | success；WebXSkill 明确用 GPT-4.1/GPT-5.1/WebJudge 决策 | 客观 | 预先给定的在线网页任务意图与可观察完成状态 | GPT-4.1/GPT-5.1/WebJudge 判断任务是否完成 |
| B08 | SkillGen | Mind2Web | native accuracy | 客观 | Mind2Web 任务完成条件 | 论文配置的任务级 evaluator 判定成功 |
| B09 | ACE | — | TGC/SGC | 客观 | 可执行规则、约束或环境终态 | AppWorld 官方终态与测试验证 |
| B09 | ReMe | — | Avg@4/Pass@4 | 客观 | 可执行规则、约束或环境终态 | AppWorld 官方终态与测试验证 |
| B09 | A-Evolve | — | TGC/APT 与成本 Pareto | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B09 | Self-Harness | AppWorld 180（held-in/out 各 90） | Pass | 客观 | 可执行规则、约束或环境终态 | 数据库终态与测试验证 |
| B10 | AutoRefine | — | task success | 客观 | 可执行规则、约束或环境终态 | 文件与单元格验证器 |
| B10 | Trace2Skill | — | Vrf/Soft/Hard | 客观 | 可执行规则、约束或环境终态 | SpreadsheetBench-Verified 分级验证器 |
| B10 | SkillOpt | — | hard score | 客观 | 可执行规则、约束或环境终态 | SpreadsheetBench 的 hard validator |
| B10 | SkillGrad | — | hard accuracy | 客观 | 可执行规则、约束或环境终态 | SpreadsheetBench 的 hard validator |
| B10 | WikiSkill | SpreadsheetBench test | average accuracy | 客观 | 可执行规则、约束或环境终态 | 文件/单元格验证器 |
| B11 | OS-Copilot | — | Pass@1。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B12 | SkillReducer、Co-EvoSkills、SkillMOO、MUSE-Autoskill、OpenSkill | 87；85；软件工程 16；75；11 域 | pass/accuracy/reward | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B12 | SkillReducer、SkillMOO | SkillsBench | compression；cost；hypervolume | 客观 | 可量化目标值或过程记录 | 文本长度、美元成本与 Pareto 统计 |
| B13 | MUSE-Autoskill | — | verifier reward/accuracy；token/latency/turns。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B14 | SkillCraft | — | Success/Exec；Reusing/turns/tool calls/token | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 人工编写的任务规则与技能执行结果；调用次数、轮次和 token 直接统计 |
| B14 | AutoRefine | — | native task success | 客观 | 可执行规则、约束或环境终态 | 基准任务验证器 |
| B15 | Meta-Harness、Agentic Harness Engineering、Self-Harness | 89；89；64 | pass/pass@1；AHE 另报 tokens/trial。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B16 | SICA、DGM、Huxley-Gödel Machine、Live-SWE-Agent、Agentic Harness Engineering、Self-Harness | — | resolved/accuracy/pass@1 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B16 | SICA、Huxley-Gödel Machine、Live-SWE-Agent、AgenticHarnessEngineering | 各自 SWE-bench 实验 | 成本、CPU-hours、工具数、token | 客观 | 可量化目标值或过程记录 | 过程/资源统计 |
| B17 | ReMe | BFCL-V3 | Avg@4/Pass@4 | 客观 | 可执行规则、约束或环境终态 | 函数选择、参数与调用结果由 BFCL 规则验证 |
| B17 | Skill-Pro | 附录 BFCL-v4 | 原生 function-call score。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B18 | AutoHarness | 16+16 游戏 | legal-action rate、单人 reward、双人 W/D/L | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 游戏引擎检查动作合法性与对局结果；reward 为环境目标值 |
| B18 | Skill-Pro | Mastermind v0/Hard/Extreme | average reward。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B19 | AutoManual | — | 9 个带反馈任务与全部 53 类 success、error steps。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B20 | Voyager | — | items、map coverage、科技树成功/提示迭代 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B20 | Steve-Evolving | MCU 70 个任务 | Easy / Hard / Overall success | 客观 | 可执行规则、约束或环境终态 | Minecraft 游戏状态与物品里程碑 |
| B21 | Continual-Harness | — | milestone keypress、达成率–成本 Pareto、Dijkstra path gap | 客观 | 游戏里程碑、按键成本和最短路径 | 游戏状态检查、按键统计与 Dijkstra oracle |
| B21 | Continual-Harness | — | PRM reward；tool-format/actionable/grounding；Blue/Yellow/Crystal 定性案例 | 主观 | 过程质量评分量规与定性案例判断 | 模型 PRM/judge |
| B22 | AgentSquare | M3Tool | native accuracy/success | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B22 | SkillCraft | M3ToolEval 来源任务 | Success/Exec | 客观 | 可执行规则、约束或环境终态 | 人工编写的输出匹配规则与技能执行结果 |
| B22 | SkillGen | MCPBench All/Single tool | native accuracy。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B23 | SkillGen、OpenSkill | FTS/UPI；六子任务 | hidden-ground-truth reward/pass。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B24 | POLCA、SkillGen | — | test score/Pass@1/native accuracy。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B25 | ABSTRAL | — | pass rate（5 个布尔条件的 deterministic oracle）；round efficiency/search tokens。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B26 | SkillClaw | WildClawBench 60 tasks | 每任务 3–27 指标聚合；critical error 归零；类别 score/gain | 客观 | 每项任务预先定义的完成指标和硬约束 | 硬约束验证器；语义/ORM 模型按既定任务条件判定 |
| B27 | MUSE | — | TAC 175 及 continual/hard 子集的 partial、checkpoint、full completion | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B27 | SkillCraft | AgentCompany 改编任务 | Success | 客观 | 预先定义的任务完成条件 | 任务验证器；语义输出沿用基准任务成功协议 |
| B28 | AgentSquare | PDDL | native success | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B28 | Agent-Pro | RLCard | win rate/chips | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B28 | SSO | NetHack/MiniHack | score | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| B28 | EvoTest | Jericho 六游戏 | episode score AUC。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| B29 | XSkill | — | success；Average@4/Pass@4 | 客观 | 各基准 ground truth、标准答案或工具执行结果 | TIR/工具任务用执行或答案验证；搜索、浏览与视觉任务由 MLLM 对 ground truth 判定 |
| B30 | AutoRefine | SkillFlow 五领域 | task success；signed degradation；artifact-use rate；turns；McNemar | 客观 | 可执行任务的成功条件；过程与统计检验结果 | SkillFlow 任务 evaluator；过程统计 |
| B31 | Trace2Skill | OfficeBench-DOCX / VAREX / TSBench | native task pass / accuracy | 客观 | 各任务的精确本地验证规则 | 文件、结构化抽取或演示文稿任务的本地 verifier |
| B32 | AgentFactory | — | 仅 orchestrator 输出 token/task；未报告独立正确率/成功率，因而不能由表中结果判断质量。 | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| B33 | SkillForge | held-out 工单；三次重复 | Strict CR；Lenient CR | 客观 | 专家参考回复与工单最终解决结果 | LLM 对照专家回复；人工专家只用于验证 judge 一致性 |

## C. 代码、软件工程、形式化验证与硬件

### C.1 数据集定义

| ID | 数据集/版本 | 任务描述 | 代表例 |
|---|---|---|---|
| C01 | HumanEval / HumanEval+ | Python 函数生成及隐藏单测；“+”含更强测试 | 实现一个列表处理函数 |
| C02 | MBPP / MBPP+ | 短 Python 编程题及单测 | 实现字符串/数字处理函数 |
| C03 | LiveCodeBench | 持续更新、低污染的编程评测 | 完成竞赛式函数或预测程序输出 |
| C04 | LeetCode-Hard | 困难在线编程题 | 实现高复杂度算法并通过测试 |
| C05 | PIE / CodeNet | Python/C++ 性能优化，公开样例+AlphaCode 私测 | 保持正确性并加速已有程序 |
| C06 | Polyglot coding benchmark | C++、Rust、Python 等多语言仓库/编程任务 | 修复不同语言实现 |
| C07 | ParEval / PolyBench（HPC） | 并行科学编码与数值 kernel | 并行化矩阵/数值循环 |
| C08 | KernelBench | GPU kernel 生成与性能评测 | 写 CUDA/Triton 矩阵运算 kernel |
| C09 | NKIBench / FlashInfer-Bench | AWS Trainium NKI 与 H100 Triton kernel | 优化 GQA、LoRA 或 Mamba block |
| C10 | Gemmini / Trainium nki-samples / TinyMPC | 不同 AI 加速器工作负载 | 优化 ResNet GEMM 或 MPC 线性代数 |
| C11 | VeriBench | 代码翻译/验证基准 | 把一种语言实现翻译后编译 |
| C12 | TM-Bench | 自建 15 个跨学科工具实现任务、124 单测 | 生成一个可复用数值计算工具 |
| C13 | RTLRewriter Benchmark | 短 RTL、FSM、CPU/CNN/FFT 等工业设计 | 等价优化 FFT RTL 的 PPA |
| C14 | TSVC | 149 个含控制流、归约、数据依赖的向量化循环 | 把标量循环改写为 SIMD |
| C15 | miniF2F | 488 个 Isabelle/Lean 形式化竞赛数学定理 | 形式证明代数不等式 |
| C16 | REGEX / CLEVR / LOGO 程序归纳 | 从例子合成正则、视觉推理程序或绘图程序 | 合成能画目标图形的 LOGO 代码 |
| C17 | 合成文件编辑/代码导航 | 自动生成的文件修改、符号定位和仓库导航任务 | 找到函数定义并正确修改 |
| C18 | ALE-Bench Lite / AtCoder | 10 个竞赛编程问题 | 生成可提交程序获得 AtCoder 分数 |
| C19 | Game of 24 / Math Equation Balancer | 用四数得到 24、平衡方程式等可执行数学任务 | 输出合法运算表达式 |

### C.2 论文使用记录

| 数据集 ID | 使用论文 | 实验设置/切分 | 评价指标 | 评价性质 | 判定依据 | 评分器/执行方式 |
|---|---|---|---|---|---|---|
| C01 | QDAIF、Symbolic-Learning、AFlow、MASS、EvoFlow、LessonL | 附录 #88 | Pass@1/completion/correctness。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C02 | AFlow、MASS、EvoFlow、LessonL | — | pass@1/correctness。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C03 | SICA、SkillGen | — | hidden-test accuracy/pass | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C03 | MASS | LiveCodeBench output-prediction | exact accuracy | 客观 | 标准答案或参考答案 | 标准输出匹配 |
| C04 | TextGrad、REVOLVE | — | completion rate。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C05 | SBLLM | PIE Python/C++ | Percent Optimized；Speedup / Top-5 speedup | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 私有测试验证正确性；运行时测量 |
| C06 | DGM、Huxley-Gödel Machine | — | task resolved/pass@1。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C07 | LessonL | — | geometric-mean speedup、correctness、>2× 比例、Pass@1。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| C08 | GEPA | — | fast_p | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| C08 | Autocomp | KernelBench Level 1 | latency；speedup；functional correctness | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 单测/数值校验；硬件运行时 |
| C08 | POLCA | — | 16 个 matmul fast_p。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| C09 | AccelOpt | — | % peak throughput、geomean speedup、cumulative Fast@p、USD cost。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| C10 | Autocomp | — | cycles/latency、speedup、functional correctness、scratchpad/accumulator utilization、schedule-reuse gain。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| C11 | POLCA | — | compilation rate；注意论文此处只报告编译通过，不能等同完整语义正确。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C12 | ToolMaker | — | task correct proportion、unit-test pass、API cost、self-correction iterations。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| C13 | RTLRewriter | — | wires/cells、area/delay、验证/综合时间、H@K/MAP@K、pattern P/R、PPA ratio | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| C13 | SymRTLO | 短电路 / FSM / 复杂算法 | Pass@1/5/10；power；time；area | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 功能仿真/等价检查；PPA 工具测量 |
| C14 | LLM-Vectorizer | TSVC 149 loops | checksum pass@1/10/100；Alive2 correctness；runtime speedup | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | checksum 测试与 Alive2 形式验证 |
| C15 | LEGO-Prover | — | valid/test 100 次尝试内证明通过率 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C15 | LEGO-Prover | 引入人工非形式化证明的 LEGO-Prover* | cumulative pass rate | 客观 | 可执行规则、约束或环境终态 | Isabelle 证明检查器 |
| C16 | LILO | — | train/test task solved rate；search time–solve curve | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 执行合成程序检查是否解决任务；搜索时间直接统计 |
| C17 | SICA | — | benchmark accuracy | 客观 | 可执行规则、约束或环境终态 | 文件编辑、符号定位、SWE-bench 与 LiveCodeBench 各自的可执行验证器 |
| C17 | SICA | 综合效用实验 | utility U | 客观 | 可量化目标值或过程记录 | 基准得分、美元成本与耗时的加权函数 |
| C18 | ShinkaEvolve | — | AtCoder score。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| C19 | Dynamic-Cheatsheet | — | functionally-correct accuracy | 客观 | 可执行规则、约束或环境终态 | 执行表达式并检查是否满足任务约束 |
| C19 | Gödel Agent | Game of 24 案例研究 | functionally correct | 客观 | 可执行规则、约束或环境终态 | 执行表达式并检查等于 24 |

## D. 视觉、表格、医学与科学数据

### D.1 数据集定义

| ID | 数据集/版本 | 任务描述 | 代表例 |
|---|---|---|---|
| D01 | GQA / OK-VQA / A-OKVQA | 图像场景关系与外部知识视觉问答 | 图中某物与另一物的空间关系 |
| D02 | MMMU | 大学多学科、多模态选择题 | 根据图表回答专业问题 |
| D03 | PathVQA | 病理图像问答 | 依据病理切片回答组织学问题 |
| D04 | LAB-Bench DBQA / LitQA | 实验数据库与科学文献问答 | 根据论文判断实验结论 |
| D05 | TabMWP | 带表格的数学应用题 | 从表中读取数量再计算 |
| D06 | DDXPlus / Formula / BIRD-SQL | 诊断分类、公式任务与文本到 SQL | 根据症状预测鉴别诊断，或把问题转成 SQL |
| D07 | ProteinGym | 蛋白变体效应预测 | 预测突变对功能/适应度的影响 |
| D08 | DOCKSTRING | 蛋白–配体 docking 基准 | 优化分子对指定靶点的 Vina score |
| D09 | PMO / TDC docking / ZINC-250K | 分子属性、再发现和 docking 优化 | 寻找兼顾 JNK3 活性与 QED 的分子 |
| D10 | MoSciBench | 六个科学数据分析数据集 | 写代码完成科学预测/分析 |
| D11 | MERFISH developing human heart | 空间转录组细胞标注 | 把细胞映射到 8 个主要类型 |
| D12 | TMS FACS scRNA-seq + height GWAS | 单细胞数据与 GWAS 统计，用于 scDRS 工作流 | 找与身高相关的细胞类型 |
| D13 | SciBench / SciEval / SciEvo | 科学推理；SciEvo 自建 1590 题并配 925 个演化工具 | 求材料/化学数值并生成工具 |
| D14 | SciSkillBench | 116 个材料与化学工具任务 | 计算/检索材料性质 |
| D15 | CASCADE 领域实验组 | 压电判断、CHGNet/MLIP 误差、AlabOS/A-Lab 合成/表征/EIS、SevenNet 电压复现。 | — |
| D16 | 放疗计划（前列腺癌） | 优化剂量分布 | 覆盖靶区同时降低器官剂量 |
| D17 | Omni3D-Bench / SpatialScore-Hard | 3D 空间推理（3DSR、SpatialSense、VG） | 判断两个物体前后/左右关系 |

### D.2 论文使用记录

| 数据集 ID | 使用论文 | 实验设置/切分 | 评价指标 | 评价性质 | 判定依据 | 评分器/执行方式 |
|---|---|---|---|---|---|---|
| D01 | CRAFT | — | soft accuracy/F1 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D01 | TROVE | GQA | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D02 | EvoAgent | 847 | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D03 | Alita-G | 100 | pass@1/pass@3 accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D04 | STELLA | 各 12.5% | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D05 | CRAFT、TroVE、AgentOptimizer | — | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D06 | ACE | — | DDXPlus/Formula exact-match accuracy | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D06 | ACE | — | LLM-as-judge。 | 客观 | 参考 SQL、预期查询语义或结果 | LLM/模型裁判 |
| D07 | FLEX | ProteinGym | Spearman correlation | 客观 | 可量化目标值或过程记录 | 与 gold 变体效应值计算秩相关 |
| D08 | TextGrad | 58 靶点 | Vina+QED | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| D08 | Feedback Descent | 6 靶点 | composite score+percentile。 | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| D09 | MOLLEO | — | Top-10 oracle AUC、multi-objective AUC、Pareto hypervolume。 | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| D10 | SkillFoundry | — | Repo-Acc、Paper-Acc、execution success | 客观 | 标准答案或参考答案；可执行规则、约束或环境终态 | 与仓库/论文参考结果比对，并检查代码执行成功 |
| D11 | SkillFoundry | — | coverage、与 harmonized ground truth 的 accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D12 | SkillFoundry | — | cell-level score RMSE | 客观 | 预测值与数值真值 | RMSE 公式计算 |
| D12 | SkillFoundry | — | 0–7 完整性评分 | 主观 | 科学工作流完整性评分量规 | 人工专家评分 |
| D13 | Beyond-Static-Tools | — | accuracy 由 GPT-4.1-nano judge；TRR@k、TRR_evol/trans。 | 客观 | 数值容差、规范化符号答案；TRR 为过程统计 | LLM/模型裁判；连续目标或过程/资源统计 |
| D14 | CASCADE | SciSkillBench 116 任务 | success；Pass@1/2/3；runtime；分难度结果 | 客观 | 基准正确答案或可执行科学任务结果；runtime 为过程记录 | 答案/执行结果验证与运行时统计 |
| D15 | CASCADE | — | success/Pass@k、runtime，并与物理预测或发表结果比较。 | 客观 | 可执行规则、物理数值或发表参考结果；runtime 为过程记录 | 程序/环境验证器、数值比较与运行时统计 |
| D16 | TextGrad | — | mean dose、D95 等临床规划量。 | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| D17 | TVP | — | Yes/No、MC、counting EM；mean relative accuracy；float ±10% | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| D17 | TVP | Omni3D/SpatialScore-Hard 汇总 | overall accuracy | 客观 | 标准答案或参考答案 | 标准答案/容差匹配 |

## E. 优化、数据科学、开放研究与论文自建任务

### E.1 数据集定义

| ID | 数据集/版本 | 任务描述 | 代表例 |
|---|---|---|---|
| E01 | TSP / CVRP / OP / MKP / BPP / FSSP / DPP | 旅行商、车辆路径、定向、背包、装箱、流水调度、去耦电容布局 | 最短路线或最小 makespan |
| E02 | FunSearch 数学构造 | cap set、corners、cycle graph Shannon capacity | 构造更大的无三项等差集合 |
| E03 | Language-Model-Crossover 五演化域 | bit-string、符号回归、情感改写、Stable Diffusion 提示、Sodaracer | 演化让机器人走更远的程序 |
| E04 | STOP 元优化任务 | LPN；String Grid Distance、Modular QAP、3-SAT、MaxCut、Parity | 生成更好的 3-SAT 求解器 |
| E05 | Trace 数值/交通/机器人任务 | 合成连续优化、UXSim 四路口、Meta-World Reach/Pick-place/Push | 调交通信号降低延迟 |
| E06 | AlphaEvolve 发现任务 | 14 组张量分解、50+开放数学问题、Borg 调度模拟、TPU Pallas kernel | 发现更低秩矩阵乘法分解 |
| E07 | AI-Scientist 三模板 | tiny-diffusion、NanoGPT、grokking | 提出、执行并写出一个小型语言模型实验 |
| E08 | QDAIF 创意 archive | Opinions、Stories、Poetry | 写满足主题槽位且质量高的诗 |
| E09 | Rainbow-Teaming 对抗 archive | 安全“风险×攻击风格”、QA topic archive、MITRE tactic×长度 | 生成新的越狱攻击提示 |
| E10 | SVG 视觉设计 | 根据文字生成 SVG 并做成对比较 | 画一张满足布局/颜色要求的图 |
| E11 | Kaggle / MLE-Bench / Weco-Kaggle / RE-Bench | 真实机器学习竞赛与研究工程任务 | 端到端训练并提交一个表格分类模型 |
| E12 | Agent Laboratory 研究题模板 | 5 个自主研究问题，动态从 HuggingFace 获取数据 | 完成实验并写研究报告 |
| E13 | DS-Agent 30 数据科学任务 | 文本、时序、表格 | 预测时序或完成表格分类 |
| E14 | ATLASS 六领域任务 | 数学、数据分析、可视化、预测、NLP、API 信息抽取 | 自动选择/创建工具画图 |
| E15 | ICE/XAgent-ToolLLM 任务 | 40 个人工多工具任务（20 train/20 test） | 组合 API 检索并整理结果 |
| E16 | Dynamic-Cheatsheet 自建 Equation Balancer | 250 题 | 生成满足等式约束的表达式 |
| E17 | DAPO-Math / AFM | 数学训练题与 Chain-of-Agents 数据 | 用少量训练例构造 test-time 策略 |
| E18 | OlympiadBench / Omni-MATH / IMO-AnswerBench / IMO-ProofBench / ArXivMath / LiveMathematicianBench | 高难数学答案或证明 | 奥赛证明题或动态数学题 |
| E19 | FineWeb + MoE / 常识下游 | Web 预训练语料与 7 个常识推理基准 | 优化 MoE 架构后评估困惑度和下游准确率 |
| E20 | Circle Packing | 单位正方形内放置 26 圆 | 最大化半径和且不重叠 |
| E21 | PolyBench（预测市场，不是 HPC PolyBench） | 5075 个事件预测任务 | 预测事件是否发生并模拟收益 |
| E22 | CTF-Dojo | 261 个隔离安全竞赛挑战 | 利用漏洞取得 flag |
| E23 | FutureX | 503 个未来事件预测问题 | 判断某事件是否在截止日前发生 |
| E24 | Wild / SkillHub / Community 技能语料 | 55,315 个 GitHub 技能、100 个市场技能、620 个社区技能 | 压缩 SKILL.md 同时保留指令 |
| E25 | SkillHub / SkillSMP 新颖性库 | 已有技能库，用于判断新挖掘技能是否重复。 | — |
| E26 | 2D/3D 软件小游戏开发 | Flappy Bird、Tank、2048、Snake、Brick Breaker | 生成可运行的 2048 |
| E27 | 内部生产多标签分类 | 未公开的生产提示分类任务 | 为输入分配多个业务标签 |
| E28 | Counterfactual Evaluation | 反事实提示/任务集 | 改变世界规则后仍按新规则回答 |
| E29 | xBench-ScienceQA | 科学问答/推理基准 | 需要专业科学知识与计算的问题 |
| E30 | AutoRefine longitudinal stream | TravelPlanner 持续学习流及 artifact 使用记录 | 技能更新后观察后续任务是否退化 |
| E31 | OpenSkill 虚拟验证器审计集 | 用隐藏真值检查自动生成 verifier | 验证 verifier 是否覆盖真实意图 |
| E32 | Memento-Skills 路由评测集 | 从 GAIA/HLE 技能库构造路由正负样本 | 给任务检索应使用的技能 |
| E33 | AgentFactory 任务流 | 两批各 15 个真实任务，以 Batch 1 创建子智能体、Batch 2 测复用。 | — |

### E.2 论文使用记录

| 数据集 ID | 使用论文 | 实验设置/切分 | 评价指标 | 评价性质 | 判定依据 | 评分器/执行方式 |
|---|---|---|---|---|---|---|
| E01 | OPRO | TSP | path length | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| E01 | EoH | 装箱/TSP/FSSP | excess-bin、optimality/makespan gap | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| E01 | ReEvo | 六类+TSPLIB | optimality gap、runtime、best objective | 客观 | 可量化目标值或过程记录 | 连续目标或过程/资源统计 |
| E01 | FunSearch | 装箱 | excess bins。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| E02 | FunSearch | cap set / corners / Shannon capacity | 构造规模；容量下界 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序检查约束；目标值直接计算 |
| E03 | Language-Model-Crossover | 五个演化域 | valid/novel offspring、R²、embedding distance、sentiment/color score、walking distance、morphology diversity | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 可执行模拟器或连续代理目标 |
| E04 | STOP | — | meta-utility、迭代曲线、沙箱绕过频率 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 运行改写器所得效用与沙箱行为；指标由程序直接统计 |
| E05 | Trace-OptoPrime | — | absolute error、traffic delay、robot-task accuracy、time/token。 | 客观 | 标准答案或参考答案；可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；标准答案、参考标签或容差匹配；连续目标或过程/资源统计 |
| E06 | AlphaEvolve | — | rank、匹配/超越 SOTA 比例、可恢复资源、硬件 runtime。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| E07 | AI-Scientist | — | ideas、experiments、papers 数量；cost | 客观 | 产出数量与资源消耗记录 | 程序/日志统计 |
| E07 | AI-Scientist | — | novel-idea 数量；自动审稿 mean/max score | 主观 | 新颖性与 NeurIPS 审稿评分量规 | LLM reviewer/judge |
| E08 | QDAIF | Opinions/Stories/Poetry | QD score、LLM Likert、Human QD、一致率、Mann–Whitney U | 主观 | 评分量规（rubric）或开放偏好 | LLM 与人工评价 |
| E09 | Rainbow-Teaming | 安全/QA/网络安全 archive | coverage、Self-BLEU | 客观 | archive 覆盖和文本相似度 | 自动覆盖率与 Self-BLEU 计算 |
| E09 | Rainbow-Teaming | 安全/QA/网络安全 archive | attack success、mean fitness、人工一致率 | 主观 | 攻击是否成功及风险/质量评分标准 | GPT-4/Llama Guard 判断；人工标注用于一致性核验 |
| E10 | Feedback Descent | SVG 视觉设计 | pairwise win rate | 主观 | 评分量规（rubric）或开放偏好 | LLM 成对比较 |
| E11 | Agent Laboratory | MLE 10 | medal、超过人类中位数 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| E11 | Agent K | 81 竞赛 | Elo-MMR、人类百分位、私榜 quantile、奖牌 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | Kaggle 私榜成绩与参赛者排名统计；不含人工主观打分 |
| E11 | AIDE | Weco 63/Lite16、MLE、RE | exceeds humans、above median、valid submission、medal。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| E12 | Agent Laboratory | 5 个自主研究题 | 时间、成本 | 客观 | 运行时间与资源消耗 | 日志与账单统计 |
| E12 | Agent Laboratory | 5 个自主研究题 | 实验质量、报告质量、有用性、NeurIPS rubric score | 主观 | 研究质量和论文审稿评分量规 | 人工研究者/审稿人评分 |
| E13 | DSAgent | 30 个数据科学任务 | MCRMSE、RMSE、Accuracy、MSE、RMSLE、MAE、AUROC、NLL、MedAE | 客观 | 标准答案或参考答案 | 标签/数值真值与任务专属 scorer |
| E13 | DSAgent | 开发/部署阶段 | success、one-pass、rank、cost | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 任务 scorer；过程/资源统计 |
| E14 | ATLASS | 六领域自建任务 | tool-selection correctness、tool-generation coverage、token、USD | 客观 | 工具选择/生成结果、验证集通过情况与资源记录 | 验证集执行、覆盖率、token 与费用统计 |
| E15 | ICE | 20 train / 20 test | API/工具调用数、subtask completion、plan revision、workflow reuse | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 子任务/工具执行记录 |
| E16 | Dynamic-Cheatsheet | 250 个自建 Equation Balancer | functionally-correct accuracy | 客观 | 可执行规则、约束或环境终态 | 执行表达式并检查等式 |
| E17 | Trace2Skill | DAPO D-Test | pass rate | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| E18 | Meta-Harness | 答案题 | source/search 后在 IMO/ArXivMath 的 pass@1 | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| E18 | Meta-Harness | 证明题 | source/search 后在 IMO-ProofBench 的 pass@1 | 主观 | 证明正确性评分量规（rubric） | 按证明基准的 rubric/judge 判定 |
| E18 | SkillOpt | LiveMath；OlympiadBench 到 Omni-MATH transfer | hard score；avg@8 | 客观 | 标准答案或参考答案 | 标准答案匹配 |
| E18 | WikiSkill | — | LiveMath average accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| E19 | ShinkaEvolve | — | cross-entropy+load imbalance fitness、perplexity、downstream accuracy。 | 客观 | 标准答案或参考答案；可量化目标值或过程记录 | 标准答案、参考标签或容差匹配；连续目标或过程/资源统计 |
| E20 | ShinkaEvolve | — | radius sum，经几何约束检查。 | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 程序、规则或环境验证器；连续目标或过程/资源统计 |
| E21 | AdaptiveAutoHarness | — | accuracy 、return。 | 客观 | 标准答案或参考答案；可量化目标值或过程记录 | 标准答案、参考标签或容差匹配；连续目标或过程/资源统计 |
| E22 | AdaptiveAutoHarness | — | Pass@1，flag/环境验证。 | 客观 | 可执行规则、约束或环境终态 | 程序、规则或环境验证器 |
| E23 | AdaptiveAutoHarness | — | Pass@1，以事后结果/标准答案核验。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| E24 | SkillReducer | 600 技能；另在 SkillsBench 87 题外部验证 | description/body compression；代码任务 fidelity/retention/improvement；SkillsBench pass | 客观 | 文本长度、代码断言与 SkillsBench 测试 | 52.3% Gate 2 任务用代码断言；SkillsBench 用确定性 pytest |
| E24 | SkillReducer | 600 技能中的 rubric 任务 | fidelity、retention、improvement | 主观 | 从原技能正文抽取的必要条件评分量规 | 47.7% Gate 2 任务用 LLM rubric judge |
| E25 | SkillFoundry | SkillHub / SkillSMP 对照 | mined-skill novelty rate | 主观 | 新颖性与冗余性评分量规：主题、来源、适用范围和新增能力 | 语义审查与库内去重流程 |
| E26 | Symbolic-Learning | 5 个小游戏开发任务 | execution failure/success（1–2 分档） | 客观 | 软件是否能够实际运行 | 执行程序检查 |
| E26 | Symbolic-Learning | 5 个小游戏开发任务 | workflow conformance / flawless alignment（3–4 分档） | 主观 | 对预期工作流和整体符合度的等级评分量规 | 运行结果结合 rubric 评分 |
| E27 | PE2 | — | F1；因数据不公开，外部不可复验。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| E28 | PE2 | — | accuracy。 | 客观 | 标准答案或参考答案 | 标准答案、参考标签或容差匹配 |
| E29 | YunjueAgent | — | 三次运行 accuracy，由 LLM-as-judge；另报 token/cost/EGL。 | 客观 | 参考答案的语义等价性；token/cost/EGL 为过程统计 | LLM/模型裁判；连续目标或过程/资源统计 |
| E30 | AutoRefine | TravelPlanner longitudinal stream | signed degradation、artifact-use rate、turns、McNemar | 客观 | 可执行规则、约束或环境终态；可量化目标值或过程记录 | 任务验证器；过程统计 |
| E31 | OpenSkill | 虚拟验证器审计 | precision、recall、agreement、ground-truth intent coverage | 客观 | 标准答案或参考答案 | 隐藏真值标签 |
| E32 | Memento-Skills | GAIA/HLE 路由样本 | Recall@K、route hit、judge success | 客观 | 路由真值标签；GAIA/HLE 的参考答案或任务完成条件 | 路由标签；LLM judge |
| E33 | AgentFactory | Batch 1 创建 / Batch 2 复用 | average orchestrator output tokens/task | 客观 | 可量化目标值或过程记录 | token 统计；没有独立质量判定 |