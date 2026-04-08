#!/bin/bash
# 清理前端服务进程

echo "🧹 清理前端服务进程..."

# 查找并杀掉所有相关的Python进程
pids=$(ps aux | grep "start_server.py\|socketserver\|http.server" | grep -v grep | awk '{print $2}')

if [ -n "$pids" ]; then
    for pid in $pids; do
        echo "终止进程 $pid"
        kill -9 $pid 2>/dev/null || true
    done
else
    echo "未找到相关进程"
fi

sleep 2

echo "✅ 清理完成"