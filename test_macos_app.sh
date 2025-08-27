#!/bin/bash
# macOS应用测试脚本
# 在macOS虚拟机中运行此脚本来测试构建的应用

echo "🍎 Nano Banana macOS 应用测试"
echo "=============================="

# 检查应用文件是否存在
APP_PATH="dist/Nano-Banana.app"
if [ ! -d "$APP_PATH" ]; then
    echo "❌ 错误: 找不到应用文件 $APP_PATH"
    echo "请先运行构建脚本: ./build_macos.sh"
    exit 1
fi

echo "✅ 找到应用文件: $APP_PATH"

# 检查应用结构
echo ""
echo "📁 检查应用结构..."
if [ -f "$APP_PATH/Contents/MacOS/Nano-Banana" ]; then
    echo "✅ 可执行文件存在"
else
    echo "❌ 可执行文件缺失"
fi

if [ -f "$APP_PATH/Contents/Info.plist" ]; then
    echo "✅ Info.plist 存在"
else
    echo "❌ Info.plist 缺失"
fi

# 检查文件权限
echo ""
echo "🔐 检查文件权限..."
EXEC_FILE="$APP_PATH/Contents/MacOS/Nano-Banana"
if [ -x "$EXEC_FILE" ]; then
    echo "✅ 可执行权限正常"
else
    echo "⚠️  修复可执行权限..."
    chmod +x "$EXEC_FILE"
fi

# 显示应用信息
echo ""
echo "ℹ️  应用信息:"
echo "   大小: $(du -sh "$APP_PATH" | cut -f1)"
echo "   路径: $(pwd)/$APP_PATH"

# 启动测试
echo ""
echo "🚀 启动应用测试..."
echo "   正在启动应用..."
echo "   浏览器应该会自动打开"
echo ""

# 后台启动应用
open "$APP_PATH" &
APP_PID=$!

# 等待应用启动
sleep 5

# 检查进程是否运行
if ps -p $APP_PID > /dev/null; then
    echo "✅ 应用已启动 (PID: $APP_PID)"
else
    echo "❌ 应用启动失败"
    exit 1
fi

# 测试端口连接
echo ""
echo "🔌 检查服务器连接..."
sleep 2

# 尝试连接不同端口
for port in {3000..3010} {8000..8010} {5000..5010}; do
    if nc -z localhost $port 2>/dev/null; then
        echo "✅ 发现服务器运行在端口: $port"
        SERVER_PORT=$port
        break
    fi
done

if [ -z "$SERVER_PORT" ]; then
    echo "⚠️  未检测到服务器端口，可能仍在启动中..."
else
    echo "🌐 测试HTTP连接..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$SERVER_PORT)
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ HTTP服务正常 (状态码: $HTTP_STATUS)"
    else
        echo "⚠️  HTTP服务状态: $HTTP_STATUS"
    fi
fi

# 功能测试清单
echo ""
echo "📋 手动测试清单:"
echo "=================="
echo "请在浏览器中完成以下测试:"
echo ""
echo "基础功能:"
echo "  □ 页面正常显示"
echo "  □ 左右图片上传区域可见"
echo "  □ API配置区域正常"
echo "  □ 提示词输入框正常"
echo ""
echo "上传功能:"
echo "  □ 点击上传按钮选择文件"
echo "  □ 拖拽图片到上传区域"
echo "  □ Ctrl+V 粘贴图片"
echo "  □ 清除按钮正常工作"
echo ""
echo "界面功能:"
echo "  □ 历史记录侧边栏"
echo "  □ 响应式设计 (调整窗口大小)"
echo "  □ 按钮动画效果"
echo ""
echo "高级功能:"
echo "  □ 输入API Key"
echo "  □ 选择模型"
echo "  □ 生成图片 (需要有效API)"
echo ""

# 提供停止指令
echo "停止测试:"
echo "========="
echo "完成测试后，可以:"
echo "1. 在浏览器中关闭标签页"
echo "2. 在Dock中右键应用选择'退出'"
echo "3. 或运行: kill $APP_PID"
echo ""

# 等待用户输入
read -p "按回车键停止应用并退出测试..."

# 停止应用
if ps -p $APP_PID > /dev/null; then
    echo "🛑 正在停止应用..."
    kill $APP_PID
    sleep 2
    if ps -p $APP_PID > /dev/null; then
        echo "⚠️  强制停止应用..."
        kill -9 $APP_PID
    fi
    echo "✅ 应用已停止"
else
    echo "ℹ️  应用已经停止"
fi

echo ""
echo "🎉 测试完成！"
echo ""
echo "如果一切正常，你的macOS版本就可以分发了："
echo "  文件位置: $APP_PATH"
echo "  压缩命令: zip -r Nano-Banana-macOS.zip \"$APP_PATH\""