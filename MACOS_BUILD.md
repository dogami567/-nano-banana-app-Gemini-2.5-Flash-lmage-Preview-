# 🍎 macOS 版本构建说明

## 系统要求
- macOS 10.14+ (Mojave或更新版本)
- Python 3.8+
- Xcode Command Line Tools

## 快速构建

### 方法1：自动化脚本 (推荐)

```bash
# 1. 下载项目到 macOS
# 2. 进入项目目录
cd nano-banana-app

# 3. 给脚本执行权限
chmod +x build_macos.sh

# 4. 运行构建脚本
./build_macos.sh
```

### 方法2：手动构建

```bash
# 1. 创建虚拟环境
python3 -m venv nano_env_mac

# 2. 激活虚拟环境
source nano_env_mac/bin/activate

# 3. 安装依赖
pip install Flask==2.3.3 pyinstaller

# 4. 打包应用
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
```

## 生成的文件

构建成功后会在 `dist/` 目录生成：
- `Nano-Banana.app` - macOS 应用包

## 使用方法

### 启动应用
```bash
# 方法1：双击启动
open dist/Nano-Banana.app

# 方法2：终端启动
./dist/Nano-Banana.app/Contents/MacOS/Nano-Banana
```

### 分发应用
```bash
# 创建压缩包用于分发
cd dist
zip -r Nano-Banana-macOS.zip Nano-Banana.app
```

## 高级选项

### 添加应用图标
1. 将图标文件转换为 `.icns` 格式
2. 在打包命令中添加 `--icon icon.icns`

### 创建DMG安装包
```bash
# 安装 create-dmg 工具
brew install create-dmg

# 创建DMG
create-dmg \
    --volname "Nano Banana" \
    --window-pos 200 120 \
    --window-size 600 300 \
    --icon-size 100 \
    --icon "Nano-Banana.app" 175 120 \
    --hide-extension "Nano-Banana.app" \
    --app-drop-link 425 120 \
    "Nano-Banana-macOS.dmg" \
    "dist/"
```

### 应用签名和公证 (可选)
```bash
# 签名应用（需要开发者证书）
codesign --force --deep --sign "Developer ID Application: Your Name" dist/Nano-Banana.app

# 公证应用（需要Apple Developer账户）
xcrun altool --notarize-app \
    --primary-bundle-id "com.yourcompany.nano-banana" \
    --username "your-apple-id@example.com" \
    --password "@keychain:AC_PASSWORD" \
    --file Nano-Banana-macOS.dmg
```

## 预期文件大小
- macOS版本预计 **8-15MB**（比Windows版本小，因为没有额外的Windows库）

## 故障排除

### 权限问题
```bash
# 如果遇到权限错误
sudo xattr -rd com.apple.quarantine dist/Nano-Banana.app
```

### Python版本问题
```bash
# 确认Python版本
python3 --version

# 如果版本太旧，使用Homebrew更新
brew install python@3.11
```

### 依赖问题
```bash
# 清理并重新安装
rm -rf nano_env_mac
python3 -m venv nano_env_mac
source nano_env_mac/bin/activate
pip install --upgrade pip
pip install Flask==2.3.3 pyinstaller
```

## 测试
构建完成后，建议在干净的macOS系统上测试：
1. 双击 `Nano-Banana.app` 启动
2. 确认浏览器自动打开
3. 测试上传图片功能
4. 测试API调用功能

---

**注意**: 此版本需要在 macOS 系统上构建，无法在 Windows 或 Linux 上创建 macOS 应用。