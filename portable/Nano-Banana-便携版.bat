@echo off
chcp 65001 >nul
title Nano Banana - 便携版

echo.
echo 🍌 Nano Banana 便携版 v1.0.0
echo ================================
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js！
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo 或将此便携版放到已安装Node.js的电脑上运行
    echo.
    pause
    exit /b 1
)

REM 检查依赖
if not exist "node_modules" (
    echo [INFO] 首次运行，正在安装依赖...
    call npm install --production
    if %errorlevel% neq 0 (
        echo [ERROR] 依赖安装失败！
        pause
        exit /b 1
    )
)

echo [INFO] 正在启动 Nano Banana...
echo [INFO] 服务地址: http://localhost:3000
echo [INFO] 浏览器将自动打开
echo [INFO] 按 Ctrl+C 停止服务器
echo.

node server.js

pause