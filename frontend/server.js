const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 所有路由都返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`前端应用运行在 http://localhost:${PORT}`);
});