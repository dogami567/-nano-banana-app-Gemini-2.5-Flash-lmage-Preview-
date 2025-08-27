@echo off
chcp 65001 >nul
title Nano Banana - Gemini 图像合成工具

echo.
echo ████████╗   ██╗ █████╗ ███╗   ██╗ ██████╗ 
echo ╚══██╔══╝   ██║██╔══██╗████╗  ██║██╔═══██╗
echo    ██║█████╗██║███████║██╔██╗ ██║██║   ██║
echo    ██║╚════╝██║██╔══██║██║╚██╗██║██║   ██║
echo    ██║      ██║██║  ██║██║ ╚████║╚██████╔╝
echo    ╚═╝      ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
echo.
echo    🍌 BANANA - Gemini 图像合成工具 v1.0.0
echo    ═══════════════════════════════════════
echo.

REM 检查 Node.js
echo [INFO] 检查系统环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js！
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo 建议安装 LTS 版本
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%v in ('node --version') do echo [OK] Node.js 版本: %%v
)

REM 检查依赖
echo [INFO] 检查项目依赖...
if not exist "node_modules" (
    echo [INFO] 首次运行，正在安装依赖...
    echo.
    call npm install --production
    if %errorlevel% neq 0 (
        echo [ERROR] 依赖安装失败！请检查网络连接
        pause
        exit /b 1
    )
    echo [OK] 依赖安装完成
) else (
    echo [OK] 依赖已存在
)

echo.
echo [INFO] 正在启动 Nano Banana...
echo [INFO] 服务地址: http://localhost:3000
echo [INFO] 浏览器将自动打开，如未打开请手动访问上述地址
echo [INFO] 按 Ctrl+C 可以停止服务器
echo.
echo ═══════════════════════════════════════════════════════
echo.

REM 启动服务器
node server.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] 服务器启动失败！
    pause
)