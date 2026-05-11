#!/usr/bin/env python3
"""知乎自动发布器 - 使用持久化浏览器上下文"""

import os
import sys
import json
import time
import glob
import argparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "output")
PUBLISHED_DIR = os.path.join(OUTPUT_DIR, "published")
USER_DATA_DIR = os.path.join(BASE_DIR, "..", ".zhihu_browser")
ZHIHU_WRITE = "https://www.zhihu.com/creator/write"


def get_unpublished():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    return sorted(glob.glob(os.path.join(OUTPUT_DIR, "*.md")))


def parse_article(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    lines = content.split("\n")
    title = body_start = 0
    for i, line in enumerate(lines):
        s = line.strip()
        if s.startswith("# ") and not title:
            title = i
            body_start = i + 1
            break
        elif line.strip() and not title:
            title = i
            body_start = i + 1
            break
    title_text = lines[title].strip().lstrip("# ").strip() if isinstance(title, int) else ""
    if not title_text:
        for line in lines:
            if line.strip():
                title_text = line.strip()
                break
    body = "\n".join(lines[body_start:]).strip()
    return title_text, body


def fill_editor(page, title, body):
    """用 JS 注入到知乎创作中心编辑器"""
    return page.evaluate(
        """
        ([title, body]) => {
            // 标题输入框
            const titleInput = document.querySelector(
                'input[placeholder*="标题"], textarea[placeholder*="标题"], ' +
                '[class*="title"] input, [class*="Title"] input, ' +
                '[class*="title"] textarea'
            );
            if (titleInput) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value'
                ).set;
                nativeInputValueSetter.call(titleInput, title);
                titleInput.dispatchEvent(new Event('input', { bubbles: true }));
                titleInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // 草稿编辑器 (知乎用 Draft.js / Slate)
            const editor = document.querySelector(
                '[contenteditable="true"], ' +
                '.public-DraftEditor-content, ' +
                '[data-slate-editor], ' +
                '.DraftEditor-root [contenteditable]'
            );
            if (editor) {
                editor.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, body);
            }
            return !!editor;
        }
    """,
        [title, body],
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    from playwright.sync_api import sync_playwright

    articles = get_unpublished()
    if not articles:
        print("No articles to publish.")
        return

    print(f"\n{'[DRY RUN] ' if args.dry_run else ''}{len(articles)} articles:\n")
    for i, a in enumerate(articles):
        t, b = parse_article(a)
        print(f"  {i + 1}. {t[:60]}... ({len(b)} chars)")

    if args.dry_run:
        return

    print(f"\nOpening browser (persistent session)...")
    print("Login once, and subsequent runs will remember you.\n")

    with sync_playwright() as p:
        # 持久化上下文 - 浏览器数据保存在 USER_DATA_DIR
        context = p.chromium.launch_persistent_context(
            USER_DATA_DIR,
            headless=False,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            args=["--disable-blink-features=AutomationControlled"],
        )

        page = context.new_page()
        page.goto(ZHIHU_WRITE, wait_until="domcontentloaded", timeout=15000)
        time.sleep(3)

        # 检查是否需要登录
        if "signin" in page.url.lower() or page.locator('text="登录"').first.is_visible():
            print("[!] Please log in to Zhihu in the browser window.")
            print("    After login, navigate to: https://www.zhihu.com/creator/write")
            print("    Then press Enter here to continue...")
            try:
                input()
            except EOFError:
                print("    (non-interactive mode - waiting 30s)")
                time.sleep(30)

        # 确保在写文章页面
        if "creator/write" not in page.url:
            page.goto(ZHIHU_WRITE, wait_until="domcontentloaded", timeout=15000)
            time.sleep(3)

        # 逐篇发布
        for i, filepath in enumerate(articles):
            filename = os.path.basename(filepath)
            title, body = parse_article(filepath)

            print(f"\n[{i + 1}/{len(articles)}] {title[:50]}...")

            if i > 0:
                page.goto(ZHIHU_WRITE, wait_until="domcontentloaded", timeout=15000)
                time.sleep(3)

            # 注入内容
            ok = fill_editor(page, title, body)
            print(f"  Editor filled: {ok}")
            time.sleep(2)

            # 找发布按钮
            published = False
            for sel in [
                'button:has-text("发布")',
                'button:has-text("发表")',
                '[class*="publish"] button',
                '[class*="Publish"] button',
                'button:has-text("发布文章")',
                'button:has-text("确认")',
            ]:
                try:
                    btn = page.locator(sel).last
                    if btn.is_visible(timeout=2000):
                        btn.click()
                        time.sleep(3)
                        published = True
                        print(f"  [OK] Published")
                        break
                except:
                    continue

            if not published:
                print("  [!] Button not found, screenshot saved")
                page.screenshot(path=os.path.join(OUTPUT_DIR, f"debug_{filename}.png"))

            if published:
                os.makedirs(PUBLISHED_DIR, exist_ok=True)
                os.rename(filepath, os.path.join(PUBLISHED_DIR, filename))

            if i < len(articles) - 1:
                wait = 150
                print(f"  Waiting {wait}s...")
                time.sleep(wait)

        context.close()
    print("\n=== Done ===")


if __name__ == "__main__":
    main()
