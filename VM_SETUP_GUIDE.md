# 🖥️ Windows上运行macOS虚拟机完整指南

## 🎯 目标
在Windows上搭建macOS虚拟机，用于构建和测试Nano Banana的macOS版本

## 📋 系统要求

### 硬件要求 (推荐)
- CPU: Intel i5/i7 或 AMD Ryzen 5/7 (8核心以上)
- 内存: 16GB+ (虚拟机分配8GB，主机保留8GB)
- 硬盘: 100GB+ 可用SSD空间
- 网络: 稳定的网络连接

### 软件要求
- Windows 10/11 Pro (需要Hyper-V支持)
- VMware Workstation Pro 17+ (推荐)
- macOS Big Sur/Monterey/Ventura 镜像文件

## 🛠️ 详细安装步骤

### 步骤1: 准备VMware Workstation Pro

#### 下载和安装
```batch
REM 1. 下载VMware Workstation Pro (试用版30天)
REM 官网: https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html

REM 2. 安装时选择完整安装
REM 3. 重启计算机
```

#### 启用虚拟化支持
```batch
REM 1. 进入BIOS设置
REM 2. 启用 Intel VT-x 或 AMD-V
REM 3. 启用 Intel VT-d 或 AMD IOMMU (如果有)
```

### 步骤2: 获取macOS镜像

#### 合法方式获取
```bash
# 在Mac上创建安装镜像 (如果有Mac的话)
sudo /Applications/Install\ macOS\ Monterey.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume

# 或从App Store下载macOS安装器
```

### 步骤3: 创建macOS虚拟机

#### VMware配置参数
```
虚拟机设置:
- 操作系统: Apple Mac OS X (64-bit)
- 版本: macOS 12
- 内存: 8192 MB (8GB)
- 处理器: 4核心
- 硬盘: 80GB (SSD类型)
- 网络: NAT
- 声卡: 启用
- USB: USB 3.1
- 3D图形: 启用，显存2GB
```

#### 虚拟机配置文件修改
```vmx
# 在虚拟机的.vmx文件中添加以下行 (关闭虚拟机后编辑)
smc.version = "0"
cpuid.0.eax = "0000:0000:0000:0000:0000:0000:0000:1011"
cpuid.0.ebx = "0111:0101:0110:1110:0110:0101:0100:0111"
cpuid.0.ecx = "0110:1100:0110:0101:0111:0100:0110:1110"
cpuid.0.edx = "0100:1001:0110:0101:0110:1110:0110:1001"
cpuid.1.eax = "0000:0000:0000:0001:0000:0110:0111:0001"
cpuid.1.ebx = "0000:0010:0000:0001:0000:1000:0000:0000"
cpuid.1.ecx = "1000:0010:1001:1000:0010:0010:0000:0011"
cpuid.1.edx = "0000:1111:1010:1011:1111:1011:1111:1111"
smbios.reflectHost = "TRUE"
hw.model = "MacBookPro18,3"
board-id = "Mac-827FAC58A8FDFA22"
```

### 步骤4: 安装macOS

#### 安装流程
```bash
# 1. 启动虚拟机，从macOS镜像启动
# 2. 打开磁盘工具，格式化虚拟硬盘为APFS
# 3. 运行macOS安装器
# 4. 完成初始化设置
```

#### 初始化设置
```bash
# 系统设置建议
- 语言: 中文/English
- 账户: 创建本地账户 (不登录Apple ID)
- 网络: 配置网络连接
- 隐私: 最小化数据收集
```

## 🔧 优化虚拟机性能

### VMware工具安装
```bash
# 在macOS中安装VMware Tools (如果支持)
# 或手动配置分辨率和共享文件夹
```

### 性能优化设置
```bash
# 关闭不必要的视觉效果
System Preferences > Dock & Menu Bar > 取消动画
System Preferences > Accessibility > Display > 减少动画

# 关闭Spotlight索引
sudo mdutil -a -i off
```

### 共享文件夹设置
```vmx
# 在VMware中启用共享文件夹
# 共享Windows的项目目录到macOS
```

## 🍌 构建Nano Banana

### 在macOS虚拟机中操作

#### 1. 安装开发环境
```bash
# 安装Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Python
brew install python@3.11

# 验证安装
python3 --version
```

#### 2. 获取项目代码
```bash
# 方法1: 通过共享文件夹访问
cd /Volumes/共享文件夹/nano-banana-app

# 方法2: Git克隆
git clone <your-repo-url>
cd nano-banana-app
```

#### 3. 运行构建脚本
```bash
# 给脚本执行权限
chmod +x build_macos.sh

# 运行构建
./build_macos.sh
```

#### 4. 测试应用
```bash
# 直接运行测试
open dist/Nano-Banana.app

# 检查是否正常启动并打开浏览器
```

## 📱 测试checklist

### 功能测试
```bash
✅ 双击启动应用
✅ 浏览器自动打开
✅ 上传图片功能
✅ API调用功能  
✅ 历史记录功能
✅ 响应式界面
✅ 保存/复制功能
```

### 系统集成测试
```bash
✅ 应用图标显示
✅ 拖拽到应用程序文件夹
✅ Spotlight搜索可找到
✅ 右键菜单正常
✅ 退出应用正常
```

## 📤 导出构建结果

### 从虚拟机获取文件
```bash
# 方法1: 共享文件夹
cp -r dist/Nano-Banana.app /Volumes/共享文件夹/

# 方法2: 压缩传输
cd dist
zip -r Nano-Banana-macOS.zip Nano-Banana.app
# 通过网络或U盘传输到Windows
```

## 🎉 完成后的收获

构建完成后你将获得:
- ✅ 原生macOS应用包 (.app格式)
- ✅ 完整的功能测试验证
- ✅ 真实macOS环境下的用户体验
- ✅ 可直接分发给Mac用户的应用

## 💡 小贴士

### 性能优化
- 关闭虚拟机时保存状态，下次快速恢复
- 分配足够内存避免swap
- 使用SSD存储提升IO性能

### 故障排除
- 如果安装卡住，尝试重新启动安装
- 网络问题可以使用桥接模式
- 权限问题使用 `sudo` 解决

---

**预估时间**: 安装3-4小时，构建测试1小时，总计半天搞定！