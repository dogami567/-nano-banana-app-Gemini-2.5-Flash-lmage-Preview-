# -*- mode: python ; coding: utf-8 -*-
# macOS测试构建专用spec文件

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('index.html', '.'),
        ('script.js', '.'), 
        ('api.js', '.'),
        ('utils.js', '.'),
        ('styles.css', '.')
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['tkinter', 'matplotlib', 'numpy', 'pandas', 'scipy', 'PIL'],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    exclude_binaries=True,
    name='Nano-Banana-Test',
    debug=False,
    bootloader_ignore_signals=False,
    strip=True,
    upx=False,  # macOS上UPX可能有问题
    console=False,  # macOS GUI应用
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=True,
    upx=False,
    upx_exclude=[],
    name='Nano-Banana-Test',
)

app = BUNDLE(
    coll,
    name='Nano-Banana-Test.app',
    icon=None,
    bundle_identifier='com.nanobanan.test',
    version='1.0.0',
    info_plist={
        'CFBundleDisplayName': 'Nano Banana Test',
        'CFBundleName': 'Nano Banana Test',
        'CFBundleVersion': '1.0.0',
        'CFBundleShortVersionString': '1.0.0',
        'NSHighResolutionCapable': True,
        'LSApplicationCategoryType': 'public.app-category.graphics-design',
    },
)