# 🍌 Nano Banana - Gemini 2.5 Flash Image Preview 图像合成工具

基于 Google Gemini 2.5 Flash Image Preview API 的强大图像合成应用，支持双图融合和单图增强处理。

## ✨ 核心功能

### 🎨 图像处理模式
- **双图合成**: 上传左右两张图片进行智能合成
- **单图增强**: 单张图片的智能处理和优化
- **拖拽上传**: 支持拖拽文件到指定区域
- **剪贴板支持**: Ctrl+V 快速粘贴图片

### 🔧 API 集成
- **Gemini 2.5 Flash Image Preview** 官方API支持
- **多模型选择**: 支持不同的Gemini模型
- **实时进度**: 生成过程可视化进度指示
- **错误处理**: 完善的API错误处理和用户提示

### 💾 历史管理
- **生成历史**: 侧边栏显示所有生成记录
- **提示词回顾**: 可滚动查看历史提示词
- **本地存储**: 使用 localStorage 持久化数据

### 🚀 用户体验
- **响应式设计**: 支持桌面和移动端
- **实时预览**: 图片上传即时预览
- **快捷操作**: 右键复制、一键保存
- **清爽界面**: 现代化UI设计

## 📦 安装使用

### 方式一: 直接下载 (推荐)
1. 下载最新版本的 `Nano-Banana.exe`
2. 双击运行，自动打开浏览器界面
3. 输入你的 Gemini API Key 开始使用

### 方式二: 从源码运行
```bash
# 克隆仓库
git clone https://github.com/dogami567/-nano-banana-app-Gemini-2.5-Flash-lmage-Preview-.git
cd nano-banana-app-Gemini-2.5-Flash-lmage-Preview-

# 安装Python依赖
pip install -r requirements.txt

# 运行应用
python app.py
```

## 🔑 API Key 获取

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录你的Google账户
3. 创建新的API Key
4. 在应用中输入你的API Key

**注意**: API Key存储在你的浏览器本地，不会上传到任何服务器。

## 🖥️ 支持平台

### Windows
- ✅ 直接下载 `.exe` 文件运行
- ✅ 支持 Windows 10/11

### macOS
- 📝 需要从源码构建 (详见 [MACOS_BUILD.md](MACOS_BUILD.md))
- 🖥️ 支持虚拟机构建 (详见 [VM_SETUP_GUIDE.md](VM_SETUP_GUIDE.md))

### Linux
- 🐍 从源码运行 (支持所有发行版)

## 🔒 安全说明

- **无硬编码密钥**: 代码中不包含任何API Key
- **用户控制**: API Key由用户输入并本地存储
- **隐私保护**: 所有数据仅在本地处理，不上传服务器
- **开源透明**: 完整源码公开，可审计安全性

详细安全分析请查看 [SECURITY_GUIDE.md](SECURITY_GUIDE.md)

## 🛠️ 技术架构

### 前端
- **原生 JavaScript** - 轻量级，无框架依赖
- **CSS Grid + Flexbox** - 响应式布局
- **Canvas API** - 图像处理
- **FileReader API** - 文件上传处理

### 后端
- **Python 3.11** - 核心运行环境
- **Flask** - 轻量级Web框架
- **PyInstaller** - 可执行文件打包

### API集成
- **Gemini 2.5 Flash Image Preview** - Google官方图像API
- **Base64编码** - 图像数据传输
- **流式响应** - 支持实时API响应

## 📁 项目结构

```
nano-banana-app/
├── app.py              # Python Flask 服务器
├── index.html          # 主界面HTML
├── script.js           # 核心JavaScript逻辑
├── api.js              # API通信模块
├── utils.js            # 工具函数库
├── styles.css          # 样式表
├── requirements.txt    # Python依赖
└── docs/
    ├── SECURITY_GUIDE.md    # 安全指南
    ├── MACOS_BUILD.md       # macOS构建指南
    └── VM_SETUP_GUIDE.md    # 虚拟机设置指南
```

## 🚀 构建说明

### Windows 构建
```bash
# 创建虚拟环境
python -m venv nano_env
nano_env\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 打包可执行文件
pyinstaller --onefile --add-data "index.html;." --add-data "script.js;." --add-data "api.js;." --add-data "utils.js;." --add-data "styles.css;." app.py
```

### macOS 构建
详细步骤请参考 [MACOS_BUILD.md](MACOS_BUILD.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 开源协议

本项目采用 MIT 协议开源。详见 [LICENSE](LICENSE) 文件。

## 🙋 常见问题

### Q: API调用失败怎么办？
A: 请检查：
- API Key是否正确
- 网络连接是否正常
- 是否达到API配额限制

### Q: 生成速度慢？
A: Gemini API通常需要8-15秒处理时间，这是正常现象。

### Q: 支持哪些图片格式？
A: 支持 JPG、PNG、GIF、BMP 等常见格式。

### Q: 可以离线使用吗？
A: 应用本身可以离线运行，但需要网络连接调用Gemini API。

## 🌟 更新日志

### v1.2.0 (最新)
- ✨ 添加历史记录侧边栏
- 🔧 修复剪贴板粘贴bug
- 🛡️ 完善安全机制
- 📱 优化移动端体验

### v1.1.0
- ✨ 单图处理模式
- 📋 剪贴板粘贴支持
- 🔄 API响应优化

### v1.0.0
- 🎉 首次发布
- 🎨 双图合成功能
- 🔑 API集成完成

---

**Made with ❤️ by developers, powered by Gemini 2.5 Flash Image Preview**

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！
