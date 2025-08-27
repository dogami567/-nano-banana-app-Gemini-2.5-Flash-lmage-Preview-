@echo off
chcp 65001 >nul
echo 🍌 构建 Nano Banana 发布包

echo [INFO] 清理旧的构建文件...
if exist "release" rmdir /s /q release
mkdir release
mkdir release\nano-banana-v1.0.0

echo [INFO] 复制应用文件...
copy server.js release\nano-banana-v1.0.0\
copy index.html release\nano-banana-v1.0.0\
copy script.js release\nano-banana-v1.0.0\
copy api.js release\nano-banana-v1.0.0\
copy utils.js release\nano-banana-v1.0.0\
copy styles.css release\nano-banana-v1.0.0\
copy package.json release\nano-banana-v1.0.0\
copy CLAUDE.md release\nano-banana-v1.0.0\
copy "启动 Nano Banana.bat" release\nano-banana-v1.0.0\

echo [INFO] 创建说明文件...
(
echo # 🍌 Nano Banana v1.0.0
echo.
echo 基于 Gemini 2.5 Flash Image API 的双图合成工具
echo.
echo ## 系统要求
echo - Windows 10/11
echo - Node.js 16+ ^(https://nodejs.org/^)
echo.
echo ## 使用方法
echo 1. 解压此文件到任意目录
echo 2. 双击 "启动 Nano Banana.bat"
echo 3. 等待浏览器自动打开
echo.
echo ## 首次运行
echo 首次运行会自动安装依赖包，请确保网络连接正常
echo.
echo ## 功能特性
echo - 双图合成 + 单图处理
echo - 历史记录管理
echo - 拖拽上传 + 剪贴板粘贴
echo - 响应式设计
echo - 实时进度显示
echo.
echo 由 Claude Code 制作 🤖
) > release\nano-banana-v1.0.0\README.txt

echo [INFO] 打包为ZIP文件...
powershell -command "Compress-Archive -Path 'release\nano-banana-v1.0.0\*' -DestinationPath 'release\Nano-Banana-v1.0.0-Windows.zip' -Force"

echo [SUCCESS] 发布包构建完成！
echo.
echo 文件位置: release\Nano-Banana-v1.0.0-Windows.zip
echo.
pause