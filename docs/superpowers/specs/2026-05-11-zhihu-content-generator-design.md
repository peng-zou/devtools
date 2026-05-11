# 知乎内容自动生成器 设计方案

## 概述

开发一个 Python 脚本，调用 DeepSeek API 自动生成知乎文章，覆盖 4 种内容类型。每篇文章嵌入工具站链接（devtools-xi-ecru.vercel.app）引流。用户审核后手动发布。

## 架构

```
scripts/
├── content_generator.py    # 主脚本：调用 API，生成文章
└── prompts/                # 提示词模板目录
    ├── tool_tutorial.txt   # 工具教程提示词
    ├── programming_tip.txt # 编程技巧提示词
    ├── ai_topic.txt        # AI 热点提示词
    └── qa_hijack.txt       # 问答截流提示词

output/                     # 文章输出目录
└── 2026-05-11-*.md
```

## 四种内容类型

| 类型 | 目的 | 典型方向 |
|------|------|---------|
| 工具教程 | 直接引流 | 推荐工具 + 使用教程，文中嵌入 devtools-xi-ecru.vercel.app |
| 编程技巧 | 涨粉 + SEO | JSON/正则/Base64 等话题实战，文末推荐工具站 |
| AI 热点 | 快速涨粉 | Claude Code/Cursor 等 AI 工具使用经验 |
| 问答截流 | 长尾流量 | 针对「XXX在线工具」等搜索词回答问题 |

## 技术选型

- 语言：Python 3
- API：DeepSeek Chat API（openai Python SDK 兼容模式）
- 输出：Markdown 格式 .md 文件

## 工作流程

1. 运行 `python scripts/content_generator.py`
2. 脚本依次调用 DeepSeek API，生成 4 篇文章
3. 每篇保存为独立 `.md` 文件到 `output/` 目录
4. 用户审核后手动发布到知乎

## 文章规格

- 长度：800-1200 字
- 格式：Markdown（支持知乎粘贴）
- 必须包含：工具站链接、至少一个代码示例或实操步骤

## API 配置

- 端点：DeepSeek Chat API
- 模型：deepseek-chat
- 预估成本：每周 ¥1.5-2（4 篇 × ¥0.3-0.5/篇）

## 输出目录结构

```
output/
├── 2026-05-11-tool-tutorial.md
├── 2026-05-11-programming-tip.md
├── 2026-05-11-ai-topic.md
└── 2026-05-11-qa-hijack.md
```
