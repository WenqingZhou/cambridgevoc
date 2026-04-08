#!/bin/bash
# 启动脚本

echo "🚀 启动剑桥少儿英语拼写练习应用..."

# 启动后端服务
echo "🔌 启动后端API服务..."
cd backend
pip install -r requirements.txt
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# 启动前端服务
echo "🌐 启动前端服务..."
cd ../frontend
npm install
nohup npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

echo "✅ 应用已启动！"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "访问地址: http://localhost:3000"

# 保存PID以便停止脚本使用
echo "$BACKEND_PID $FRONTEND_PID" > app.pid