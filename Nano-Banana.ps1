# Nano Banana 启动脚本
Write-Host "🍌 Nano Banana - Gemini 图像合成工具" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
Write-Host ""

# 获取脚本目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到 Node.js，请先安装: https://nodejs.org/" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}

# 启动服务器
Write-Host "🚀 正在启动 Nano Banana 服务器..." -ForegroundColor Green
Write-Host "浏览器将自动打开，如果没有请手动访问: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Gray
Write-Host ""

try {
    node server.js
} catch {
    Write-Host "❌ 服务器启动失败" -ForegroundColor Red
    Read-Host "按回车键退出"
}