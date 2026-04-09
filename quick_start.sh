#!/bin/bash
# 启动剑桥少儿英语拼写练习应用（静态文件服务）

echo "🚀 启动剑桥少儿英语拼写练习应用..."

cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/public

# 使用 Python 内置 HTTP 服务器
PORT=8001
echo "📡 启动静态文件服务器..."
echo "📍 服务地址: http://localhost:$PORT"
echo ""
echo "📋 使用说明:"
echo "  - 访问 http://localhost:$PORT 进入练习页面"
echo "  - 按 Ctrl+C 停止服务"
echo ""

python3 -m http.server $PORT