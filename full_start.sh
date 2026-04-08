#!/bin/bash
# 完整启动脚本

echo "🌟 启动剑桥少儿英语拼写练习完整应用..."

# 检查后端是否已运行
BACKEND_PID_FILE="/home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend/backend.pid"
if [ -f "$BACKEND_PID_FILE" ]; then
    RUNNING_PID=$(cat "$BACKEND_PID_FILE")
    if ps -p $RUNNING_PID > /dev/null; then
        echo "✅ 后端服务已在运行 (PID: $RUNNING_PID)"
    else
        echo "🔄 启动后端服务..."
        cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend
        nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > backend.pid
        echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
    fi
else
    echo "🔄 启动后端服务..."
    cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend
    nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > backend.pid
    echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
fi

# 启动前端
FRONTEND_PID_FILE="/home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/frontend.pid"
if [ -f "$FRONTEND_PID_FILE" ]; then
    RUNNING_PID=$(cat "$FRONTEND_PID_FILE")
    if ps -p $RUNNING_PID > /dev/null; then
        echo "✅ 前端服务已在运行 (PID: $RUNNING_PID)"
    else
        echo "🔄 启动前端服务..."
        cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend
        
        # 检查是否已安装依赖
        if [ ! -d "node_modules" ]; then
            echo "📦 正在安装前端依赖包..."
            npm install > /dev/null 2>&1
            if [ $? -ne 0 ]; then
                echo "⚠️  npm install 未完成，将在后台继续..."
            fi
        fi
        
        nohup npm start > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > frontend.pid
        echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
    fi
else
    echo "🔄 启动前端服务..."
    cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend
    
    # 检查是否已安装依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 正在安装前端依赖包..."
        npm install > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo "⚠️  npm install 未完成，将在后台继续..."
        fi
    fi
    
    nohup npm start > frontend.log 2>&1 &
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
if [ -f "$FRONTEND_PID_FILE" ]; then
    FRONTEND_PID=$(cat /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/frontend.pid)
    echo "  前端 (UI): 运行中 PID:$FRONTEND_PID 端口:3000"
else
    echo "  前端 (UI): 启动中..."
fi
echo ""
echo "💡 提示: 如果前端尚未完全启动，请稍等片刻再访问"
echo "🔧 若需停止服务，请运行: /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/stop.sh"