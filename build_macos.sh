#!/bin/bash
# macOS 专用打包脚本

echo "🍎 开始为 macOS 构建 Nano Banana..."

# 检查是否在macOS上
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 错误：此脚本只能在 macOS 上运行"
    exit 1
fi

# 创建虚拟环境
echo "📦 创建 macOS 虚拟环境..."
python3 -m venv nano_env_mac

# 激活虚拟环境
source nano_env_mac/bin/activate

# 安装依赖
echo "⬇️  安装依赖..."
pip install Flask==2.3.3 pyinstaller

# 构建应用
echo "🔨 开始打包..."
pyinstaller \
    --onefile \
    --windowed \
    --add-data "index.html:." \
    --add-data "script.js:." \
    --add-data "api.js:." \
    --add-data "utils.js:." \
    --add-data "styles.css:." \
    --add-data "CLAUDE.md:." \
    --name "Nano-Banana" \
    --clean \
    app.py

if [ $? -eq 0 ]; then
    echo "✅ macOS 版本构建成功！"
    echo "📍 应用位置: dist/Nano-Banana.app"
    
    # 显示文件大小
    if [ -f "dist/Nano-Banana.app" ]; then
        size=$(du -sh dist/Nano-Banana.app | cut -f1)
        echo "📊 文件大小: $size"
    fi
    
    echo ""
    echo "🚀 使用方法："
    echo "   双击 dist/Nano-Banana.app 启动应用"
    echo "   或在终端运行: open dist/Nano-Banana.app"
    
else
    echo "❌ 构建失败"
    exit 1
fi