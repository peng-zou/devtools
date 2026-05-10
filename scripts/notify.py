#!/usr/bin/env python3
# WxPusher 微信通知脚本
# 手动模式: python notify.py "摘要" "正文"
# 钩子模式: echo '{"tool_name":"Bash",...}' | python notify.py

import sys
import json
import urllib.request

APP_TOKEN = "AT_pOcBREGRNdRSyRjVFzkIzTGXD1R7iGR5"
USER_UID = "UID_FKkCruqr6YSXFUULfCa0inukRIv7"

def send(summary, content):
    data = json.dumps({
        "appToken": APP_TOKEN,
        "content": content,
        "summary": summary,
        "contentType": 1,
        "uids": [USER_UID]
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://wxpusher.zjiecode.com/api/send/message",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result.get("code") == 1000

# 尝试从 stdin 读取钩子传入的 JSON（非阻塞）
hook_data = None
try:
    import select
    if select.select([sys.stdin], [], [], 0.1)[0]:
        raw = sys.stdin.read()
        if raw.strip():
            hook_data = json.loads(raw)
except Exception:
    pass

if hook_data:
    # 钩子模式：从 JSON 提取任务信息
    tool = hook_data.get("tool_name", "未知工具")
    tool_input = hook_data.get("tool_input", {})

    if tool == "Bash":
        cmd = tool_input.get("command", "")
        desc = tool_input.get("description", cmd)
        summary = "任务完成"
        content = f"刚刚完成了：{desc}"
    else:
        summary = f"{tool} 完成"
        content = f"{tool} 操作已完成。"

    print(f"钩子模式: {summary}")
    ok = send(summary, content)
    if ok:
        print("通知发送成功")
    else:
        print("通知发送失败")

elif len(sys.argv) >= 2:
    # 手动模式
    summary = sys.argv[1]
    content = sys.argv[2] if len(sys.argv) > 2 else summary
    ok = send(summary, content)
    if ok:
        print("通知发送成功")
    else:
        print("通知发送失败")

else:
    print("用法: python notify.py \"摘要\" \"正文\"")
    print("或通过钩子 stdin 传入 JSON")
