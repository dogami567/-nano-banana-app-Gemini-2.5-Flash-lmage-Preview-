#!/usr/bin/env python3
"""
macOS 版本构建脚本
在macOS系统上运行此脚本来创建.app应用包
"""

import subprocess
import os
import sys

def build_for_macos():
    """为macOS构建应用"""
    print("🍎 构建 Nano Banana macOS版本...")
    
    # macOS PyInstaller命令
    cmd = [
        "pyinstaller",
        "--onefile",
        "--windowed",  # macOS上使用windowed而不是console
        "--add-data", "index.html:.",
        "--add-data", "script.js:.",
        "--add-data", "api.js:.",
        "--add-data", "utils.js:.",
        "--add-data", "styles.css:.",
        "--add-data", "CLAUDE.md:.",
        "--name", "Nano-Banana",
        "--icon", "icon.icns",  # macOS图标格式
        "app.py"
    ]
    
    try:
        result = subprocess.run(cmd, check=True)
        print("✅ macOS版本构建成功！")
        print("📦 生成文件：dist/Nano-Banana.app")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 构建失败: {e}")

def build_dmg():
    """创建macOS安装包"""
    print("📦 创建DMG安装包...")
    
    # 使用create-dmg工具（需要先安装：brew install create-dmg）
    cmd = [
        "create-dmg",
        "--volname", "Nano Banana",
        "--volicon", "icon.icns",
        "--window-pos", "200", "120",
        "--window-size", "600", "300",
        "--icon-size", "100",
        "--icon", "Nano-Banana.app", "175", "120",
        "--hide-extension", "Nano-Banana.app",
        "--app-drop-link", "425", "120",
        "dist/Nano-Banana.dmg",
        "dist/"
    ]
    
    try:
        result = subprocess.run(cmd, check=True)
        print("✅ DMG安装包创建成功！")
        
    except subprocess.CalledProcessError as e:
        print(f"⚠️  DMG创建失败（需要安装create-dmg）: {e}")

if __name__ == "__main__":
    if sys.platform != "darwin":
        print("❌ 此脚本只能在macOS上运行")
        sys.exit(1)
    
    build_for_macos()
    build_dmg()