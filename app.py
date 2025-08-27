#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nano Banana - Gemini 图像合成工具
基于Flask的Python Web服务器版本
"""

import os
import sys
import threading
import webbrowser
from pathlib import Path
from flask import Flask, render_template, send_from_directory, jsonify
import socket
import time

# 获取应用目录
if getattr(sys, 'frozen', False):
    # 如果是打包的exe
    app_dir = Path(sys._MEIPASS)
    base_dir = Path(sys.executable).parent
else:
    # 如果是开发环境
    app_dir = Path(__file__).parent
    base_dir = app_dir

# Flask应用初始化
app = Flask(__name__, 
           template_folder=str(app_dir),
           static_folder=str(app_dir))

def find_free_port():
    """查找可用端口"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

def open_browser(url, delay=1.5):
    """延迟打开浏览器 - 跨平台兼容"""
    def _open():
        time.sleep(delay)
        try:
            import platform
            system = platform.system()
            
            if system == "Darwin":  # macOS
                os.system(f'open "{url}"')
            elif system == "Windows":
                os.system(f'start "" "{url}"')
            elif system == "Linux":
                os.system(f'xdg-open "{url}"')
            else:
                # 备用方案
                webbrowser.open(url)
                
        except Exception as e:
            print(f"无法自动打开浏览器: {e}")
            print(f"请手动访问: {url}")
    
    thread = threading.Thread(target=_open)
    thread.daemon = True
    thread.start()

@app.route('/')
def index():
    """主页"""
    return send_from_directory(app_dir, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """静态文件服务"""
    return send_from_directory(app_dir, filename)

@app.route('/health')
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'message': 'Nano Banana 服务器运行正常',
        'version': '1.0.0'
    })

def print_banner():
    """打印启动横幅"""
    banner = """
    ████████   ██  █████  ███    ██  ████████ 
    ╚══██╔══   ██ ██   ██ ████   ██ ██╔═══██╗
       ██║███████ ███████ ██╔██  ██ ██║   ██║
       ██║╚════██ ██   ██ ██║╚██ ██ ██║   ██║
       ██║     ██ ██   ██ ██║ ╚████ ╚██████╔╝
       ╚═╝     ╚═ ╚═   ╚═ ╚═╝  ╚═══  ╚═════╝ 

    * NANO BANANA - Gemini 图像合成工具 v1.0.0
    ============================================
    """
    print(banner)

def main():
    """主函数"""
    try:
        print_banner()
        
        # 检查核心文件
        required_files = ['index.html', 'script.js', 'api.js', 'utils.js', 'styles.css']
        missing_files = []
        
        for file in required_files:
            if not (app_dir / file).exists():
                missing_files.append(file)
        
        if missing_files:
            print(f"[ERROR] 缺少必要文件: {', '.join(missing_files)}")
            print("请确保所有web文件都在同一目录下")
            input("按回车键退出...")
            return 1
        
        # 查找可用端口
        port = find_free_port()
        url = f"http://localhost:{port}"
        
        print(f"[OK] 所有文件检查完成")
        print(f"[INFO] 正在启动服务器...")
        print(f"[URL] 服务地址: {url}")
        print(f"[BROWSER] 浏览器将自动打开")
        print(f"[STOP] 按 Ctrl+C 停止服务器")
        print("=" * 50)
        
        # 延迟打开浏览器
        open_browser(url)
        
        # 启动Flask服务器
        app.run(
            host='127.0.0.1',
            port=port,
            debug=False,
            threaded=True,
            use_reloader=False
        )
        
    except KeyboardInterrupt:
        print("\n[EXIT] 感谢使用 Nano Banana！")
        return 0
    except Exception as e:
        print(f"[ERROR] 服务器启动失败: {e}")
        input("按回车键退出...")
        return 1

if __name__ == '__main__':
    sys.exit(main())