#!/bin/bash
# 简化版前端启动脚本

echo "🚀 启动剑桥少儿英语拼写练习前端..."

cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装前端依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 安装依赖失败"
        exit 1
    fi
else
    echo "✅ 依赖包已存在"
fi

echo "🎮 启动前端应用..."
echo "注意：如果在终端环境中，应用将在后台运行"
echo "请访问 http://localhost:3000 访问应用"

# 启动前端应用
nohup npm start > frontend.log 2>&1 &

FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"

echo ""
echo "📋 当前运行状态:"
echo "Backend: Running on PID $(cat /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend/backend.pid) (Port 8000)"
echo "Frontend: Running on PID $FRONTEND_PID (Port 3000)"
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
echo "若要停止服务，请运行: /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/stop.sh"