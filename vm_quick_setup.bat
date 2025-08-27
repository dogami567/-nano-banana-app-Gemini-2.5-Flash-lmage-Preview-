@echo off
chcp 65001 >nul
title macOS虚拟机快速设置助手

echo.
echo 🖥️  macOS 虚拟机设置助手
echo ================================
echo.

echo [INFO] 检查系统要求...

REM 检查内存
for /f "tokens=2 delims==" %%i in ('wmic OS get TotalVisibleMemorySize /value') do set mem=%%i
set /a mem_gb=%mem%/1024/1024
echo [CHECK] 系统内存: %mem_gb%GB

if %mem_gb% LSS 12 (
    echo [WARNING] 内存不足12GB，可能影响虚拟机性能
) else (
    echo [OK] 内存充足
)

REM 检查CPU
for /f "tokens=2 delims==" %%i in ('wmic cpu get NumberOfCores /value') do set cores=%%i
echo [CHECK] CPU核心: %cores%核

if %cores% LSS 4 (
    echo [WARNING] CPU核心不足4个，可能影响性能
) else (
    echo [OK] CPU性能充足
)

REM 检查磁盘空间
for /f "tokens=3" %%i in ('dir /-c %SystemDrive%\ 2^>nul ^|find "bytes free"') do set free=%%i
set /a free_gb=%free%/1024/1024/1024
echo [CHECK] 可用磁盘空间: %free_gb%GB

if %free_gb% LSS 100 (
    echo [WARNING] 磁盘空间不足100GB，需要清理空间
) else (
    echo [OK] 磁盘空间充足
)

echo.
echo 📋 安装清单:
echo ============
echo.
echo 1. VMware Workstation Pro (试用版30天)
echo    下载地址: https://www.vmware.com/products/workstation-pro/
echo.
echo 2. macOS 镜像文件 (需要自行获取)
echo    推荐: macOS Monterey 或 Ventura
echo.
echo 3. 虚拟机配置建议:
echo    - 内存: 8GB
echo    - CPU: 4核心  
echo    - 硬盘: 80GB SSD
echo    - 网络: NAT模式
echo.

set /p choice="是否继续查看详细设置步骤? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo 🛠️  详细设置步骤:
    echo ================
    echo.
    echo 步骤1: 安装VMware Workstation Pro
    echo        - 下载并安装VMware Workstation Pro
    echo        - 重启计算机
    echo        - 在BIOS中启用虚拟化支持 (Intel VT-x/AMD-V)
    echo.
    echo 步骤2: 创建macOS虚拟机
    echo        - 新建虚拟机，选择"稍后安装操作系统"
    echo        - 操作系统选择"Apple Mac OS X (64-bit)"
    echo        - 分配8GB内存，4个CPU核心
    echo        - 创建80GB虚拟硬盘
    echo.
    echo 步骤3: 修改虚拟机配置
    echo        - 关闭虚拟机后，编辑.vmx文件
    echo        - 添加macOS兼容性参数 (详见VM_SETUP_GUIDE.md)
    echo.
    echo 步骤4: 安装macOS
    echo        - 从macOS镜像启动虚拟机
    echo        - 使用磁盘工具格式化硬盘为APFS
    echo        - 运行macOS安装程序
    echo.
    echo 步骤5: 构建Nano Banana
    echo        - 安装Homebrew和Python
    echo        - 运行 ./build_macos.sh
    echo        - 测试生成的.app文件
    echo.
    echo 💡 完整指南请查看: VM_SETUP_GUIDE.md
    echo.
)

echo 🎯 预估时间:
echo ==========
echo - VMware安装: 30分钟
echo - macOS安装: 2-3小时  
echo - 环境配置: 30分钟
echo - 应用构建: 15分钟
echo - 功能测试: 15分钟
echo --------------
echo   总计: 4-5小时
echo.

set /p open_guide="是否打开详细指南文档? (y/n): "
if /i "%open_guide%"=="y" (
    start VM_SETUP_GUIDE.md
)

echo.
echo 🚀 准备好了就开始吧！祝你构建顺利！
echo.
pause