#!/usr/bin/env python3
"""知乎自动发布器 — 使用 Playwright 自动发布 output/ 目录下的文章到知乎"""

import os
import sys
import json
import time
import glob
import argparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "output")
PUBLISHED_DIR = os.path.join(OUTPUT_DIR, "published")
COOKIES_FILE = os.path.join(BASE_DIR, "..", ".zhihu_cookies.json")
ZHIHU_WRITE_URL = "https://zhuanlan.zhihu.com/write"


def load_cookies():
    if not os.path.exists(COOKIES_FILE):
        return None
    with open(COOKIES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_cookies(cookies):
    with open(COOKIES_FILE, "w", encoding="utf-8") as f:
        json.dump(cookies, f, ensure_ascii=False, indent=2)
    print(f"  Cookie 已保存到 {COOKIES_FILE}")


def get_unpublished():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    files = glob.glob(os.path.join(OUTPUT_DIR, "*.md"))
    files.sort()
    return files


def parse_article(filepath: str):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    lines = content.split("\n")
    title = ""
    body_start = 0
    for i, line in enumerate(lines):
        s = line.strip()
        if s.startswith("# ") and not title:
            title = s[2:].strip()
            body_start = i + 1
            break
    if not title:
        for i, line in enumerate(lines):
            if line.strip():
                title = line.strip()
                body_start = i + 1
                break
    body = "\n".join(lines[body_start:]).strip()
    return title, body


def paste_into_editor(page, text: str):
    """将文本粘贴到知乎编辑器中 — 使用 JS 设置剪贴板后 Ctrl+V"""
    # 先用 JS 把内容放入剪贴板
    page.evaluate(
        """
        (text) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    """,
        text,
    )
    time.sleep(0.3)
    # 找到编辑器并聚焦
    editor = page.locator('[contenteditable="true"]').first
    editor.click()
    time.sleep(0.3)
    # 全选 + 粘贴
    page.keyboard.press("Control+a")
    time.sleep(0.2)
    page.keyboard.press("Control+v")
    time.sleep(0.5)


def title_from_filename(filename: str) -> str:
    """从文件名提取文章类型标签"""
    parts = filename.replace(".md", "").split("-")
    type_map = {
        "tool_tutorial": "工具教程",
        "programming_tip": "编程技巧",
        "ai_topic": "AI热点",
        "qa_hijack": "问答截流",
    }
    return type_map.get(parts[-1], "")


def main():
    parser = argparse.ArgumentParser(description="知乎文章自动发布器")
    parser.add_argument("--no-headless", action="store_true", help="显示浏览器窗口")
    parser.add_argument("--dry-run", action="store_true", help="只显示待发布列表，不实际发布")
    parser.add_argument("--single", type=str, help="只发布指定文件")
    args = parser.parse_args()

    from playwright.sync_api import sync_playwright

    if args.single:
        articles = [os.path.join(OUTPUT_DIR, args.single) if not os.path.isabs(args.single) else args.single]
    else:
        articles = get_unpublished()

    if not articles:
        print("没有待发布的文章。")
        return

    print(f"\n{'[预览模式] ' if args.dry_run else ''}待发布 {len(articles)} 篇:\n")
    for i, a in enumerate(articles):
        title, body = parse_article(a)
        print(f"  {i + 1}. [{title_from_filename(os.path.basename(a))}] {title} ({len(body)} 字)")

    if args.dry_run:
        return

    print(f"\n启动浏览器...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not args.no_headless)
        context = browser.new_context()
        cookies = load_cookies()
        if cookies:
            context.add_cookies(cookies)

        page = context.new_page()
        page.goto("https://www.zhihu.com", wait_until="domcontentloaded", timeout=15000)
        time.sleep(2)

        # 检测登录状态
        if page.locator('text="登录"').first.is_visible():
            print("\n⚠️  需要登录！正在打开登录窗口...")
            browser.close()
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            page.goto("https://www.zhihu.com/signin", wait_until="domcontentloaded")
            print("请在浏览器中登录知乎，登录完成后回到终端按 Enter...")
            input()
            save_cookies(context.cookies())
        else:
            print("Cookie 有效，已登录 ✓")

        # 逐篇发布
        for i, filepath in enumerate(articles):
            filename = os.path.basename(filepath)
            title, body = parse_article(filepath)
            tag = title_from_filename(filename)

            print(f"\n[{i + 1}/{len(articles)}] [{tag}] {title}")
            print(f"  正文字符: {len(body)}")

            page.goto(ZHIHU_WRITE_URL, wait_until="domcontentloaded", timeout=15000)
            time.sleep(3)

            # 填入标题
            title_area = page.locator('textarea[placeholder*="标题"]').first
            if not title_area.is_visible(timeout=3000):
                title_area = page.locator('textarea').first
            title_area.click()
            title_area.fill("")
            title_area.type(title, delay=20)
            time.sleep(1)

            # 粘贴正文
            paste_into_editor(page, body)
            time.sleep(2)

            # 发布
            publish_btn = page.locator('button:has-text("发布")').last
            if publish_btn.is_visible(timeout=3000):
                publish_btn.click()
                time.sleep(3)
                print(f"  ✅ 已发布")

                os.makedirs(PUBLISHED_DIR, exist_ok=True)
                os.rename(filepath, os.path.join(PUBLISHED_DIR, filename))
            else:
                print(f"  ⚠️  未找到发布按钮，截图保存")
                page.screenshot(path=os.path.join(OUTPUT_DIR, f"debug_{filename}.png"))

            # 间隔
            if i < len(articles) - 1:
                wait = 150
                print(f"  等待 {wait} 秒...")
                time.sleep(wait)

        browser.close()
    print("\n=== 全部完成 ===")


if __name__ == "__main__":
    main()
