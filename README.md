# 剑桥少儿英语拼写练习应用

## 功能说明
为剑桥 Pre A1 Starters、A1 Movers 和 A2 Flyers 级别学生设计的单词拼写练习 Web 应用。采用中文提示+字母键盘输入的方式进行拼写练习。

## 主要特性
- 🎯 中文意思提示 + 虚拟字母键盘
- ✅ 拼写结果验证 + 错误高亮显示
- 📊 学习进度统计（localStorage 存储）
- 🎨 游戏化学习体验，适合儿童
- ⚡ 纯静态文件，无需后端服务
- 📱 支持移动端响应式布局

## 词汇级别
| 级别 | 词汇量 | 适用人群 |
|------|--------|----------|
| Pre A1 Starters | 277词 | 英语入门学习者 |
| A1 Movers | 229词 | 初级英语学习者 |
| A2 Flyers | 306词 | 中级英语学习者 |

**总计：812 个剑桥官方词汇**

## 项目结构
```
frontend/public/
├── index.html        # 入口页面（重定向）
├── practice.html     # 主练习页面
├── vocabulary.js     # 词汇库（812词）
├── css/
│   └── practice.css  # 样式文件
└── js/
    └── practice.js   # 交互逻辑
```

## 运行方式
```bash
cd 项目/剑桥少儿英语拼写练习
./quick_start.sh
```

访问 `http://localhost:8001` 开始练习。

## 技术栈
- 前端：纯 HTML + CSS + JavaScript（无框架依赖）
- 存储：浏览器 localStorage
- 服务：Python 内置 http.server

## 优化记录
- 2026-04-09：删除废弃后端代码，模块化 CSS/JS，清理冗余文件