#!/usr/bin/env python3
"""
跨平台构建管理脚本
自动检测系统并执行相应的构建流程
"""

import platform
import subprocess
import sys
import os

def get_system_info():
    """获取系统信息"""
    system = platform.system()
    architecture = platform.machine()
    python_version = platform.python_version()
    
    print(f"🖥️  系统: {system}")
    print(f"🏗️  架构: {architecture}")
    print(f"🐍 Python: {python_version}")
    print("-" * 40)
    
    return system

def build_windows():
    """Windows 构建流程"""
    print("🪟 开始 Windows 构建...")
    
    commands = [
        # 创建虚拟环境
        [sys.executable, "-m", "venv", "nano_env_win"],
        
        # 安装依赖 (Windows路径)
        ["nano_env_win\\Scripts\\pip", "install", "-r", "requirements.txt"],
        
        # 打包
        ["nano_env_win\\Scripts\\pyinstaller", 
         "--onefile", "--console",
         "--add-data", "index.html;.",
         "--add-data", "script.js;.",
         "--add-data", "api.js;.",
         "--add-data", "utils.js;.",
         "--add-data", "styles.css;.",
         "--add-data", "CLAUDE.md;.",
         "--name", "Nano-Banana-Windows",
         "app.py"]
    ]
    
    for cmd in commands:
        try:
            print(f"执行: {' '.join(cmd)}")
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ 构建失败: {e}")
            return False
    
    print("✅ Windows 版本构建完成: dist/Nano-Banana-Windows.exe")
    return True

def build_macos():
    """macOS 构建流程"""
    print("🍎 开始 macOS 构建...")
    
    commands = [
        # 创建虚拟环境
        [sys.executable, "-m", "venv", "nano_env_mac"],
        
        # 安装依赖 (Unix路径)
        ["nano_env_mac/bin/pip", "install", "-r", "requirements_macos.txt"],
        
        # 打包
        ["nano_env_mac/bin/pyinstaller",
         "--onefile", "--windowed",
         "--add-data", "index.html:.",
         "--add-data", "script.js:.",
         "--add-data", "api.js:.",
         "--add-data", "utils.js:.",
         "--add-data", "styles.css:.",
         "--add-data", "CLAUDE.md:.",
         "--name", "Nano-Banana-macOS",
         "app.py"]
    ]
    
    for cmd in commands:
        try:
            print(f"执行: {' '.join(cmd)}")
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ 构建失败: {e}")
            return False
    
    print("✅ macOS 版本构建完成: dist/Nano-Banana-macOS.app")
    return True

def build_linux():
    """Linux 构建流程"""
    print("🐧 开始 Linux 构建...")
    
    commands = [
        # 创建虚拟环境
        [sys.executable, "-m", "venv", "nano_env_linux"],
        
        # 安装依赖
        ["nano_env_linux/bin/pip", "install", "-r", "requirements.txt"],
        
        # 打包
        ["nano_env_linux/bin/pyinstaller",
         "--onefile", "--console",
         "--add-data", "index.html:.",
         "--add-data", "script.js:.",
         "--add-data", "api.js:.",
         "--add-data", "utils.js:.",
         "--add-data", "styles.css:.",
         "--add-data", "CLAUDE.md:.",
         "--name", "Nano-Banana-Linux",
         "app.py"]
    ]
    
    for cmd in commands:
        try:
            print(f"执行: {' '.join(cmd)}")
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ 构建失败: {e}")
            return False
    
    print("✅ Linux 版本构建完成: dist/Nano-Banana-Linux")
    return True

def main():
    """主函数"""
    print("🚀 Nano Banana 跨平台构建工具")
    print("=" * 40)
    
    system = get_system_info()
    
    # 根据系统选择构建方式
    if system == "Windows":
        success = build_windows()
        if success:
            print("\n🎉 构建成功！启动方式:")
            print("   双击 dist/Nano-Banana-Windows.exe")
            
    elif system == "Darwin":  # macOS
        success = build_macos()
        if success:
            print("\n🎉 构建成功！启动方式:")
            print("   双击 dist/Nano-Banana-macOS.app")
            print("   或运行: open dist/Nano-Banana-macOS.app")
            
    elif system == "Linux":
        success = build_linux()
        if success:
            print("\n🎉 构建成功！启动方式:")
            print("   运行: ./dist/Nano-Banana-Linux")
            
    else:
        print(f"❌ 不支持的系统: {system}")
        sys.exit(1)
    
    if not success:
        print("\n💡 构建失败，请检查:")
        print("1. Python 版本是否 >= 3.8")
        print("2. 网络连接是否正常")
        print("3. 磁盘空间是否充足")
        sys.exit(1)

if __name__ == "__main__":
    main()