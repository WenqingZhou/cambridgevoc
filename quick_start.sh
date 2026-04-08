#!/bin/bash
# 启动剑桥少儿英语拼写练习应用

echo "🚀 启动剑桥少儿英语拼写练习应用..."

# 启动后端服务
echo "🔌 启动后端API服务..."
cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/backend
pip3 install --user -r requirements.txt > /dev/null 2>&1
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &

BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

echo "✅ 后端服务已在8000端口启动 (PID: $BACKEND_PID)"

echo ""
echo "📋 使用说明:"
echo "1. 后端API已启动: http://localhost:8000"
echo "2. API端点:"
echo "   - GET /words/random - 获取随机单词"
echo "   - POST /words/check - 检查拼写"
echo "3. 前端需要单独启动 (进入frontend目录执行: npm start)"
echo ""
echo " 若要停止服务，请运行: ./stop.sh"