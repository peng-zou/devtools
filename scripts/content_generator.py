#!/usr/bin/env python3
"""知乎内容生成器 — 调用 DeepSeek API 生成文章到 output/ 目录"""

import os
import sys
from datetime import date
from openai import OpenAI

# DeepSeek API 配置
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"
API_KEY = os.environ.get("ANTHROPIC_AUTH_TOKEN", "")

# 工具站链接
TOOL_SITE_URL = "https://devtools-xi-ecru.vercel.app"

# 四种内容类型
CONTENT_TYPES = [
    ("tool_tutorial", "工具教程"),
    ("programming_tip", "编程技巧"),
    ("ai_topic", "AI热点"),
    ("qa_hijack", "问答截流"),
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPTS_DIR = os.path.join(BASE_DIR, "prompts")
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "output")


def load_prompt(name: str) -> str:
    """读取提示词模板"""
    path = os.path.join(PROMPTS_DIR, f"{name}.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def generate_article(client: OpenAI, prompt: str) -> str:
    """调用 DeepSeek API 生成单篇文章"""
    response = client.chat.completions.create(
        model=DEEPSEEK_MODEL,
        messages=[
            {"role": "system", "content": "你是一个资深程序员和知乎博主，擅长写实用、接地气的技术文章。你的文章有干货、有观点、有温度。"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=2000,
    )
    return response.choices[0].message.content or ""


def save_article(content: str, content_type: str, today: str) -> str:
    """保存文章到 output/ 目录"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"{today}-{content_type}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    return filepath


def main():
    if not API_KEY:
        print("错误：请设置 ANTHROPIC_AUTH_TOKEN 环境变量（DeepSeek API Key）")
        sys.exit(1)

    client = OpenAI(api_key=API_KEY, base_url=DEEPSEEK_BASE_URL)
    today = date.today().isoformat()

    print(f"=== 知乎内容生成器 ===\n")
    print(f"日期: {today}")
    print(f"输出目录: {OUTPUT_DIR}\n")

    for content_type, label in CONTENT_TYPES:
        print(f">>> 正在生成: {label} ({content_type})")

        try:
            prompt = load_prompt(content_type)
            article = generate_article(client, prompt)
            filepath = save_article(article, content_type, today)

            # 统计字数
            word_count = len(article.replace("\n", "").replace(" ", ""))
            # 统计中文字符
            chinese_chars = sum(1 for c in article if "一" <= c <= "鿿")

            print(f"    已保存: {filepath}")
            print(f"    总字符: {word_count} | 中文字符: {chinese_chars}\n")

        except Exception as e:
            print(f"    生成失败: {e}\n")
            continue

    print(f"=== 完成！共生成 {len(CONTENT_TYPES)} 篇文章 ===")
    print(f"请审核 output/ 目录下的文件，然后运行 zhihu_publisher.py 发布。")


if __name__ == "__main__":
    main()
