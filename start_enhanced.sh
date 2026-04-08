#!/bin/bash
# 启动剑桥A1 Movers英语拼写练习增强版

echo "🚀 启动剑桥A1 Movers英语拼写练习增强版..."

cd /home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend

# 检查是否已有服务在运行
if pgrep -f start_server_new.py > /dev/null; then
    echo "⚠️  检测到已有服务在运行，正在停止..."
    pkill -f start_server_new.py
    sleep 2
fi

echo "🎮 启动前端服务..."
python3 start_server_new.py > frontend.log 2>&1 &

SERVER_PID=$!
echo $SERVER_PID > server.pid
echo "✅ 服务已启动 (PID: $SERVER_PID)"

echo ""
echo "🌟 剑桥A1 Movers英语拼写练习增强版"
echo "🌐 访问地址: http://localhost:8001/spelling_practice_enhanced.html"
echo ""
echo "📋 新增功能:"
echo "• 300+ 剑桥A1 Movers官方词汇"
echo "• 按主题分类练习 (动物/颜色/身体/衣服/食物等)"
echo "• 学习进度统计与可视化"
echo "• 保持原有卡通界面设计"
echo "• 完全离线使用能力"
echo ""
echo "💡 使用提示:"
echo "1. 打开浏览器访问上面的URL"
echo "2. 选择喜欢的主题开始练习"
echo "3. 查看中文提示，拼写对应英文单词"
echo "4. 点击提交按钮检查结果"
echo "5. 点击'下一个单词'继续练习"
echo ""
echo "🔧 如需停止服务，请运行:"
echo "   pkill -f start_server_new.py"
echo ""