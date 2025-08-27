const { app, BrowserWindow, Menu } = require('electron');
const express = require('express');
const path = require('path');

let mainWindow;
let server;

// Express 服务器
function createServer() {
    const expressApp = express();
    const PORT = 3000;
    
    // 静态文件服务
    expressApp.use(express.static(__dirname));
    
    // 默认路由
    expressApp.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    server = expressApp.listen(PORT, 'localhost', () => {
        console.log(`🍌 Nano Banana 服务器已启动: http://localhost:${PORT}`);
    });
    
    return `http://localhost:${PORT}`;
}

// 创建主窗口
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'icon.png'), // 如果有图标的话
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        show: false, // 先不显示，等页面加载完再显示
        titleBarStyle: 'default',
        autoHideMenuBar: false
    });

    // 设置菜单
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '重新加载',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => mainWindow.reload()
                },
                {
                    label: '开发者工具',
                    accelerator: 'F12',
                    click: () => mainWindow.webContents.openDevTools()
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于 Nano Banana',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于 Nano Banana',
                            message: 'Nano Banana v1.0.0',
                            detail: '基于 Gemini 2.5 Flash Image 的双图合成工具\n\n由 Claude Code 制作'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // 启动服务器并加载页面
    const serverUrl = createServer();
    
    // 等待服务器启动
    setTimeout(() => {
        mainWindow.loadURL(serverUrl);
    }, 1000);

    // 页面加载完成后显示窗口
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        if (process.env.NODE_ENV === 'development') {
            mainWindow.webContents.openDevTools();
        }
    });

    // 窗口关闭事件
    mainWindow.on('closed', () => {
        mainWindow = null;
        if (server) {
            server.close();
        }
    });

    // 防止外部链接在应用内打开
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

// 应用准备就绪
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 所有窗口关闭时退出应用 (macOS 除外)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 应用退出前清理
app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});