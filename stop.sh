#!/bin/bash
# 停止脚本

echo "🛑 停止剑桥少儿英语拼写练习应用..."

# 停止后端服务
pkill -f "uvicorn main:app" 2>/dev/null
echo "✅ 已停止后端服务"

# 停止前端服务
pkill -f "python3 start_server.py" 2>/dev/null
echo "✅ 已停止前端服务"

# 清理PID文件
rm -f /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend/backend.pid
rm -f /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/frontend.pid

echo "✅ 应用已停止！"