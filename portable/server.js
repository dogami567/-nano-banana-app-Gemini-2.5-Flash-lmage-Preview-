const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 默认路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
const server = app.listen(PORT, 'localhost', () => {
    console.log(`🍌 Nano Banana 服务器已启动: http://localhost:${PORT}`);
    
    // 自动打开浏览器
    const url = `http://localhost:${PORT}`;
    
    // 根据操作系统选择命令
    let command;
    switch (process.platform) {
        case 'darwin': // macOS
            command = `open "${url}"`;
            break;
        case 'win32': // Windows
            command = `start "" "${url}"`;
            break;
        default: // Linux
            command = `xdg-open "${url}"`;
    }
    
    exec(command, (error) => {
        if (error) {
            console.log('请手动打开浏览器访问:', url);
        }
    });
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});