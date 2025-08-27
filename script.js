/**
 * 主应用程序脚本
 * 遵循SOLID原则和完整实现原则
 */

// 应用状态管理
const AppState = {
    leftImage: null,
    rightImage: null,
    leftImageFile: null,
    rightImageFile: null,
    apiKey: '',
    selectedModel: 'gemini-2.5-flash-image-preview',
    isGenerating: false,
    resultImageData: null
};

// DOM元素引用
const DOMElements = {
    leftImageInput: null,
    rightImageInput: null,
    leftImagePreview: null,
    rightImagePreview: null,
    leftImageBox: null,
    rightImageBox: null,
    apiKeyInput: null,
    modelSelect: null,
    promptInput: null,
    generateBtn: null,
    progressSection: null,
    progressFill: null,
    progressText: null,
    resultSection: null,
    resultImage: null
};

/**
 * 初始化应用程序
 */
function initializeApp() {
    // 获取DOM元素引用
    DOMElements.leftImageInput = document.getElementById('leftImageInput');
    DOMElements.rightImageInput = document.getElementById('rightImageInput');
    DOMElements.leftImagePreview = document.getElementById('leftImagePreview');
    DOMElements.rightImagePreview = document.getElementById('rightImagePreview');
    DOMElements.leftImageBox = document.getElementById('leftImageBox');
    DOMElements.rightImageBox = document.getElementById('rightImageBox');
    DOMElements.apiKeyInput = document.getElementById('apiKey');
    DOMElements.modelSelect = document.getElementById('modelSelect');
    DOMElements.promptInput = document.getElementById('promptInput');
    DOMElements.generateBtn = document.getElementById('generateBtn');
    DOMElements.progressSection = document.getElementById('progressSection');
    DOMElements.progressFill = document.getElementById('progressFill');
    DOMElements.progressText = document.getElementById('progressText');
    DOMElements.resultSection = document.getElementById('resultSection');
    DOMElements.resultImage = document.getElementById('resultImage');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 检查生成按钮状态
    updateGenerateButtonState();
    
    // 从localStorage恢复API密钥
    restoreApiKeyFromStorage();
    
    showNotification('应用初始化完成', 'success');
}

/**
 * 绑定所有事件监听器
 */
function bindEventListeners() {
    // API密钥输入事件
    DOMElements.apiKeyInput.addEventListener('input', debounce(handleApiKeyChange, 300));
    
    // 模型选择事件
    DOMElements.modelSelect.addEventListener('change', handleModelChange);
    
    // Prompt输入事件
    DOMElements.promptInput.addEventListener('input', debounce(updateGenerateButtonState, 300));
    
    // 添加拖拽区域点击事件
    document.querySelector('#leftImageBox .upload-area').addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            DOMElements.leftImageInput.click();
        }
    });
    
    document.querySelector('#rightImageBox .upload-area').addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            DOMElements.rightImageInput.click();
        }
    });
    
    // 阻止全局拖拽事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}

/**
 * 处理图片上传
 * @param {Event} event - 文件输入事件
 * @param {string} side - 'left' 或 'right'
 */
async function handleImageUpload(event, side) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!validateImageFile(file)) {
        return;
    }
    
    try {
        const base64Data = await fileToBase64(file);
        const previewUrl = URL.createObjectURL(file);
        
        if (side === 'left') {
            AppState.leftImage = base64Data;
            AppState.leftImageFile = file;
            DOMElements.leftImagePreview.src = previewUrl;
            DOMElements.leftImagePreview.style.display = 'block';
            DOMElements.leftImageBox.querySelector('.upload-placeholder').style.display = 'none';
        } else {
            AppState.rightImage = base64Data;
            AppState.rightImageFile = file;
            DOMElements.rightImagePreview.src = previewUrl;
            DOMElements.rightImagePreview.style.display = 'block';
            DOMElements.rightImageBox.querySelector('.upload-placeholder').style.display = 'none';
        }
        
        updateGenerateButtonState();
        showNotification(`${side === 'left' ? '左图' : '右图'}上传成功 (${formatFileSize(file.size)})`, 'success');
        
    } catch (error) {
        console.error('图片处理失败:', error);
        showNotification('图片处理失败，请重试', 'error');
    }
}

/**
 * 处理拖拽放置
 * @param {DragEvent} event - 拖拽事件
 * @param {string} side - 'left' 或 'right'
 */
function handleDrop(event, side) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = event.currentTarget;
    uploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    if (!validateImageFile(file)) {
        return;
    }
    
    // 模拟文件输入事件
    const mockEvent = {
        target: { files: [file] }
    };
    
    handleImageUpload(mockEvent, side);
}

/**
 * 处理拖拽悬停
 * @param {DragEvent} event - 拖拽事件
 */
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = event.currentTarget;
    uploadArea.classList.add('drag-over');
    
    // 拖拽离开时移除样式
    uploadArea.addEventListener('dragleave', function removeDragOver(e) {
        if (!uploadArea.contains(e.relatedTarget)) {
            uploadArea.classList.remove('drag-over');
            uploadArea.removeEventListener('dragleave', removeDragOver);
        }
    });
}

/**
 * 处理API密钥变化
 */
function handleApiKeyChange() {
    AppState.apiKey = DOMElements.apiKeyInput.value.trim();
    
    // 保存到localStorage
    if (AppState.apiKey) {
        localStorage.setItem('gemini-api-key', AppState.apiKey);
    }
    
    updateGenerateButtonState();
}

/**
 * 处理模型选择变化
 */
function handleModelChange() {
    AppState.selectedModel = DOMElements.modelSelect.value;
    updateGenerateButtonState();
}

/**
 * 从localStorage恢复API密钥
 */
function restoreApiKeyFromStorage() {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
        DOMElements.apiKeyInput.value = savedApiKey;
        AppState.apiKey = savedApiKey;
    }
}

/**
 * 刷新可用模型列表
 */
async function refreshModels() {
    if (!AppState.apiKey) {
        showNotification('请先输入API密钥', 'error');
        return;
    }
    
    const refreshBtn = document.getElementById('refreshModelsBtn');
    const originalText = refreshBtn.textContent;
    
    try {
        refreshBtn.textContent = '🔄 获取中...';
        refreshBtn.disabled = true;
        
        const models = await getAvailableModels(AppState.apiKey);
        
        // 清空现有选项
        DOMElements.modelSelect.innerHTML = '';
        
        // 添加新选项
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            DOMElements.modelSelect.appendChild(option);
        });
        
        // 恢复选择或选择第一个
        if (models.includes(AppState.selectedModel)) {
            DOMElements.modelSelect.value = AppState.selectedModel;
        } else {
            AppState.selectedModel = models[0];
            DOMElements.modelSelect.value = models[0];
        }
        
        showNotification(`成功获取${models.length}个可用模型`, 'success');
        
    } catch (error) {
        console.error('刷新模型失败:', error);
        showNotification(`获取模型失败: ${error.message}`, 'error');
    } finally {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
    }
}

/**
 * 更新生成按钮状态
 */
function updateGenerateButtonState() {
    const hasImages = AppState.leftImage && AppState.rightImage;
    const hasApiKey = AppState.apiKey && AppState.apiKey.length > 0;
    const hasPrompt = DOMElements.promptInput.value.trim().length > 0;
    const isNotGenerating = !AppState.isGenerating;
    
    const canGenerate = hasImages && hasApiKey && hasPrompt && isNotGenerating;
    
    DOMElements.generateBtn.disabled = !canGenerate;
    
    if (!hasImages) {
        DOMElements.generateBtn.textContent = '🖼️ 请先上传图片';
    } else if (!hasApiKey) {
        DOMElements.generateBtn.textContent = '🔑 请输入API密钥';
    } else if (!hasPrompt) {
        DOMElements.generateBtn.textContent = '✍️ 请输入提示词';
    } else if (AppState.isGenerating) {
        DOMElements.generateBtn.textContent = '⏳ 生成中...';
    } else {
        DOMElements.generateBtn.textContent = '🚀 开始生成';
    }
}

/**
 * 生成图像主函数
 */
async function generateImage() {
    if (AppState.isGenerating) return;
    
    try {
        AppState.isGenerating = true;
        updateGenerateButtonState();
        
        // 显示进度区域
        DOMElements.progressSection.style.display = 'block';
        DOMElements.resultSection.style.display = 'none';
        
        const prompt = DOMElements.promptInput.value.trim();
        
        // 调用API生成图像
        const resultBase64 = await generateImageWithGemini({
            apiKey: AppState.apiKey,
            model: AppState.selectedModel,
            prompt: prompt,
            leftImageBase64: AppState.leftImage,
            leftImageMimeType: getFileMimeType(AppState.leftImageFile),
            rightImageBase64: AppState.rightImage,
            rightImageMimeType: getFileMimeType(AppState.rightImageFile),
            onProgress: updateProgress
        });
        
        // 显示结果
        AppState.resultImageData = resultBase64;
        displayResult(resultBase64);
        
    } catch (error) {
        console.error('图像生成失败:', error);
        showNotification(`生成失败: ${error.message}`, 'error');
        
        // 隐藏进度区域
        DOMElements.progressSection.style.display = 'none';
        
    } finally {
        AppState.isGenerating = false;
        updateGenerateButtonState();
    }
}

/**
 * 更新进度显示
 * @param {number} percentage - 进度百分比 (0-100)
 * @param {string} message - 进度消息
 */
function updateProgress(percentage, message) {
    DOMElements.progressFill.style.width = `${percentage}%`;
    DOMElements.progressText.textContent = message;
}

/**
 * 显示生成结果
 * @param {string} base64Data - 图片的Base64数据
 */
function displayResult(base64Data) {
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;
    
    DOMElements.resultImage.src = imageUrl;
    DOMElements.resultImage.onload = () => {
        // 图片加载完成后显示结果区域
        DOMElements.progressSection.style.display = 'none';
        DOMElements.resultSection.style.display = 'block';
        
        // 滚动到结果区域
        DOMElements.resultSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        showNotification('图片生成完成！', 'success');
    };
}

/**
 * 保存图片到本地
 */
function saveImage() {
    if (!AppState.resultImageData) {
        showNotification('没有可保存的图片', 'error');
        return;
    }
    
    try {
        const downloadUrl = createDownloadUrl(AppState.resultImageData);
        const filename = generateTimestampFilename('nano-banana-result', 'jpg');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // 释放URL对象
        URL.revokeObjectURL(downloadUrl);
        
        showNotification('图片保存成功', 'success');
        
    } catch (error) {
        console.error('保存失败:', error);
        showNotification('保存失败，请重试', 'error');
    }
}

/**
 * 复制图片到剪贴板
 */
async function copyImage() {
    if (!AppState.resultImageData) {
        showNotification('没有可复制的图片', 'error');
        return;
    }
    
    const imageUrl = `data:image/jpeg;base64,${AppState.resultImageData}`;
    await copyImageToClipboard(imageUrl);
}

/**
 * 重置应用程序
 */
function resetApp() {
    // 重置状态
    AppState.leftImage = null;
    AppState.rightImage = null;
    AppState.leftImageFile = null;
    AppState.rightImageFile = null;
    AppState.resultImageData = null;
    
    // 重置UI
    DOMElements.leftImageInput.value = '';
    DOMElements.rightImageInput.value = '';
    DOMElements.leftImagePreview.style.display = 'none';
    DOMElements.rightImagePreview.style.display = 'none';
    DOMElements.leftImageBox.querySelector('.upload-placeholder').style.display = 'block';
    DOMElements.rightImageBox.querySelector('.upload-placeholder').style.display = 'block';
    DOMElements.promptInput.value = '';
    DOMElements.progressSection.style.display = 'none';
    DOMElements.resultSection.style.display = 'none';
    
    // 更新按钮状态
    updateGenerateButtonState();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('应用已重置', 'info');
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);