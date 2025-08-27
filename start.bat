@echo off
echo 🍌 正在启动 Nano Banana...
echo.

REM 检查是否安装了 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 启动应用
echo 🚀 正在启动服务器...
echo 浏览器将自动打开，如果没有请手动访问: http://localhost:3000
echo.
echo 按 Ctrl+C 可以停止服务器
echo.

node server.js

pause