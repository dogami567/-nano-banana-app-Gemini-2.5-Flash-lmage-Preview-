; Nano Banana NSIS 安装脚本

!define APPNAME "Nano Banana"
!define COMPANYNAME "Claude Code"
!define DESCRIPTION "基于 Gemini 2.5 Flash Image 的双图合成工具"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0

RequestExecutionLevel admin

InstallDir "$PROGRAMFILES\${APPNAME}"

Name "${APPNAME}"
Icon "icon.ico"
outFile "Nano-Banana-Setup.exe"

!include LogicLib.nsh

page components
page directory
page instfiles

!macro VerifyUserIsAdmin
UserInfo::GetAccountType
pop $0
${If} $0 != "admin" 
    messageBox mb_iconstop "需要管理员权限才能安装此应用程序。"
    setErrorLevel 740
    quit
${EndIf}
!macroend

function .onInit
    !insertmacro VerifyUserIsAdmin
functionEnd

section "安装 ${APPNAME}"
    setOutPath $INSTDIR
    
    # 复制所有文件
    file "server.js"
    file "index.html" 
    file "script.js"
    file "api.js"
    file "utils.js"
    file "styles.css"
    file "CLAUDE.md"
    file "package.json"
    file "启动 Nano Banana.bat"
    file "start.bat"
    file "Nano-Banana.ps1"
    file ".gitignore"
    
    # 复制node_modules目录
    file /r "node_modules"
    
    # 创建桌面快捷方式
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\启动 Nano Banana.bat" "" "$INSTDIR\icon.ico"
    
    # 创建开始菜单快捷方式
    createDirectory "$SMPROGRAMS\${COMPANYNAME}"
    createShortCut "$SMPROGRAMS\${COMPANYNAME}\${APPNAME}.lnk" "$INSTDIR\启动 Nano Banana.bat" "" "$INSTDIR\icon.ico"
    createShortCut "$SMPROGRAMS\${COMPANYNAME}\卸载 ${APPNAME}.lnk" "$INSTDIR\uninstall.exe"
    
    # 写入注册表
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayName" "${APPNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "QuietUninstallString" "$\"$INSTDIR\uninstall.exe$\" /S"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "InstallLocation" "$\"$INSTDIR$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayIcon" "$\"$INSTDIR\icon.ico$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "Publisher" "${COMPANYNAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "DisplayVersion" "${VERSIONMAJOR}.${VERSIONMINOR}.${VERSIONBUILD}"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "VersionMajor" ${VERSIONMAJOR}
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}" "VersionMinor" ${VERSIONMINOR}
    
    # 创建卸载程序
    writeUninstaller "$INSTDIR\uninstall.exe"
sectionEnd

section "卸载"
    # 删除安装的文件
    delete "$INSTDIR\server.js"
    delete "$INSTDIR\index.html"
    delete "$INSTDIR\script.js"
    delete "$INSTDIR\api.js"
    delete "$INSTDIR\utils.js"
    delete "$INSTDIR\styles.css"
    delete "$INSTDIR\CLAUDE.md"
    delete "$INSTDIR\package.json"
    delete "$INSTDIR\启动 Nano Banana.bat"
    delete "$INSTDIR\start.bat"
    delete "$INSTDIR\Nano-Banana.ps1"
    delete "$INSTDIR\.gitignore"
    delete "$INSTDIR\icon.ico"
    
    # 删除node_modules目录
    rmDir /r "$INSTDIR\node_modules"
    
    # 删除快捷方式
    delete "$DESKTOP\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${COMPANYNAME}\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${COMPANYNAME}\卸载 ${APPNAME}.lnk"
    rmDir "$SMPROGRAMS\${COMPANYNAME}"
    
    # 删除注册表项
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${COMPANYNAME} ${APPNAME}"
    
    # 删除卸载程序
    delete $INSTDIR\uninstall.exe
    
    # 删除安装目录
    rmDir $INSTDIR
sectionEnd