@echo off
chcp 65001 >nul
echo 🍌 创建 Nano Banana 便携版

echo [INFO] 准备创建便携式应用包...

REM 创建便携版目录
if not exist "portable" mkdir portable
cd portable

REM 清空目录
if exist "*" del /q *.*
if exist "node_modules" rmdir /s /q node_modules

echo [INFO] 复制应用文件...

REM 复制核心文件
copy ..\server.js .
copy ..\index.html .
copy ..\script.js .
copy ..\api.js .
copy ..\utils.js .
copy ..\styles.css .
copy ..\package.json .
copy "..\启动 Nano Banana.bat" .
copy ..\CLAUDE.md .

REM 安装生产依赖
echo [INFO] 安装依赖包...
call npm install --production --silent

echo [INFO] 创建启动器...

REM 创建便携式启动器
(
echo @echo off
echo chcp 65001 ^>nul
echo title Nano Banana - 便携版
echo.
echo echo 🍌 Nano Banana 便携版
echo echo ==================
echo.
echo echo [INFO] 正在启动服务器...
echo echo [INFO] 浏览器将自动打开 http://localhost:3000
echo echo [INFO] 按 Ctrl+C 停止服务器
echo.
echo node server.js
echo.
echo pause
) > "Nano-Banana-便携版.bat"

echo [SUCCESS] 便携版创建完成！
echo.
echo 便携版位置: %CD%
echo 启动文件: Nano-Banana-便携版.bat
echo.
echo 这个文件夹可以复制到任何有Node.js的Windows电脑上运行
pause