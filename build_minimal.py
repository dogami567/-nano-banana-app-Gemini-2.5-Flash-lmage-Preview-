#!/usr/bin/env python3
"""
最小化打包脚本 - 进一步优化文件大小
"""

import subprocess
import os
import sys

def create_minimal_build():
    """创建最小化构建"""
    print("🔧 创建最小化PyInstaller构建...")
    
    # 使用更多排除选项
    cmd = [
        "nano_env/Scripts/pyinstaller", 
        "--onefile", 
        "--console",
        "--strip",  # 移除调试符号
        "--exclude-module", "tkinter",  # 排除GUI组件
        "--exclude-module", "matplotlib",
        "--exclude-module", "numpy", 
        "--exclude-module", "pandas",
        "--exclude-module", "scipy",
        "--exclude-module", "PIL",
        "--exclude-module", "sqlite3",
        "--exclude-module", "unittest",
        "--exclude-module", "test",
        "--exclude-module", "pydoc", 
        "--exclude-module", "doctest",
        "--exclude-module", "xmlrpc",
        "--exclude-module", "email",
        "--add-data", "index.html;.",
        "--add-data", "script.js;.",
        "--add-data", "api.js;.", 
        "--add-data", "utils.js;.",
        "--add-data", "styles.css;.",
        "--add-data", "CLAUDE.md;.",
        "--name", "Nano-Banana-Mini",
        "app.py"
    ]
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("✅ 最小化构建成功！")
        
        # 检查文件大小
        exe_path = "dist/Nano-Banana-Mini.exe"
        if os.path.exists(exe_path):
            size = os.path.getsize(exe_path)
            size_mb = size / (1024 * 1024)
            print(f"📦 最终文件大小: {size_mb:.1f}MB")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 构建失败: {e}")
        print(f"错误输出: {e.stderr}")

if __name__ == "__main__":
    create_minimal_build()