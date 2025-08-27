# 🖥️ 在Windows上使用macOS虚拟机构建

## ⚠️ 免责声明
本文档仅供学习研究，请遵守Apple软件许可协议。

## 方案概述
由于无法在Windows上直接构建macOS应用，可以使用虚拟机方式：

### 选项1: UTM (推荐 - Apple Silicon Mac)
```bash
# 在Apple Silicon Mac上
brew install utm
# 下载macOS镜像并安装
```

### 选项2: VMware Workstation Pro
1. 安装VMware Workstation Pro
2. 下载macOS镜像
3. 创建macOS虚拟机
4. 在虚拟机中构建应用

### 选项3: VirtualBox (免费但性能较低)
1. 安装VirtualBox
2. 配置macOS虚拟机
3. 在虚拟机中运行构建脚本

## 虚拟机中的构建流程

### 1. 系统要求
- 内存: 至少8GB (推荐16GB)
- 硬盘: 至少60GB可用空间
- CPU: 支持虚拟化的多核处理器

### 2. macOS虚拟机配置
```bash
# 在macOS虚拟机中安装必要工具
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install python@3.11
```

### 3. 构建应用
```bash
# 克隆项目
git clone [项目地址]
cd nano-banana-app

# 运行构建脚本
chmod +x build_macos.sh
./build_macos.sh
```

### 4. 从虚拟机导出文件
- 使用共享文件夹
- 或通过网络传输获取生成的.app文件

## 性能优化建议

### VMware配置优化
```
内存: 8-16GB
处理器: 4-8核
硬盘: SSD类型
3D加速: 启用
```

### 构建加速
```bash
# 使用本地缓存加速pip安装
pip install --cache-dir ~/.cache/pip Flask==2.3.3 pyinstaller

# 并行构建（如果支持）
export MAKEFLAGS="-j$(nproc)"
```

## 替代方案提醒

如果虚拟机方案复杂，建议考虑：
1. **GitHub Actions** - 完全免费的云端构建
2. **朋友的Mac** - 借用真实硬件
3. **云端Mac服务** - MacStadium, AWS Mac instances等

---

**注意**: 虚拟机方案需要大量系统资源和时间，GitHub Actions是更实用的选择。