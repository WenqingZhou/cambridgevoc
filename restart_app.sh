#!/bin/bash
# 剑桥少儿英语拼写练习应用完整启动脚本

echo "🌟 启动剑桥少儿英语拼写练习完整应用..."

# 检查后端是否已运行
BACKEND_PID_FILE="/home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend/backend.pid"
CURRENT_BACKEND_PID=$(ps aux | grep "uvicorn main:app" | grep -v grep | awk '{print $2}')

if [ ! -z "$CURRENT_BACKEND_PID" ]; then
    echo "✅ 后端服务已在运行 (PID: $CURRENT_BACKEND_PID)"
    # 将当前PID写入文件
    echo $CURRENT_BACKEND_PID > $BACKEND_PID_FILE
else
    echo "🔄 启动后端服务..."
    cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend
    nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > backend.pid
    echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
fi

# 检查前端是否已运行
FRONTEND_PID_FILE="/home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/frontend.pid"
CURRENT_FRONTEND_PID=$(ps aux | grep "python3 start_server.py" | grep -v grep | awk '{print $2}')

if [ ! -z "$CURRENT_FRONTEND_PID" ]; then
    echo "✅ 前端服务已在运行 (PID: $CURRENT_FRONTEND_PID)"
    # 将当前PID写入文件
    echo $CURRENT_FRONTEND_PID > $FRONTEND_PID_FILE
else
    echo "🔄 启动前端服务..."
    cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend
    nohup python3 start_server.py > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > frontend.pid
    echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
fi

echo ""
echo "🎉 应用启动完成！"
echo ""
echo "🌐 访问地址: http://localhost:3000"
echo "🔌 API地址: http://localhost:8000"
echo ""
echo "📋 当前运行状态:"
BACKEND_PID=$(cat /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend/backend.pid)
echo "  后端 (API): 运行中 PID:$BACKEND_PID 端口:8000"
FRONTEND_PID=$(cat /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/frontend.pid)
echo "  前端 (UI): 运行中 PID:$FRONTEND_PID 端口:3000"
echo ""
echo "💡 提示: 如果访问有问题，请确认以下几点:"
echo "  1. 您正在访问 http://localhost:3000"
echo "  2. 后端服务正在端口8000运行"
echo "  3. 没有防火墙阻止本地连接"
echo ""
echo "🔧 若需停止服务，请运行: /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/stop.sh"