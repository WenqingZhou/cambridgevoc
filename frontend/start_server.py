import http.server
import socketserver
import os
import sys

# 切换到前端public目录
os.chdir('/home/admin/.openclaw/workspace/agents/代码虾/项目/剑桥少儿英语拼写练习/frontend/public')

PORT = 9090

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"前端应用运行在 http://localhost:{PORT}")
    print("后端API运行在 http://localhost:8000")
    print("按 Ctrl+C 停止服务")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已停止")