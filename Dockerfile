# 构建前端
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/ ./
RUN npm install
RUN npm run build

# 构建后端
FROM python:3.11-slim
WORKDIR /app

# 安装Python依赖
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ ./

# 复制前端构建产物
COPY --from=frontend-build /app/build ./static

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]