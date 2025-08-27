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
    resultImageData: null,
    isSidebarOpen: false,
    generationHistory: [],
    activeHistoryId: null
};

// DOM元素引用
const DOMElements = {
    leftImageInput: null,
    rightImageInput: null,
    leftImagePreview: null,
    rightImagePreview: null,
    leftImageBox: null,
    rightImageBox: null,
    clearLeftBtn: null,
    clearRightBtn: null,
    apiKeyInput: null,
    modelSelect: null,
    promptInput: null,
    generateBtn: null,
    progressSection: null,
    progressFill: null,
    progressText: null,
    resultSection: null,
    resultImage: null,
    historySidebar: null,
    historyList: null,
    historyCount: null,
    clearHistoryBtn: null
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
    DOMElements.clearLeftBtn = document.getElementById('clearLeftBtn');
    DOMElements.clearRightBtn = document.getElementById('clearRightBtn');
    DOMElements.apiKeyInput = document.getElementById('apiKey');
    DOMElements.modelSelect = document.getElementById('modelSelect');
    DOMElements.promptInput = document.getElementById('promptInput');
    DOMElements.generateBtn = document.getElementById('generateBtn');
    DOMElements.progressSection = document.getElementById('progressSection');
    DOMElements.progressFill = document.getElementById('progressFill');
    DOMElements.progressText = document.getElementById('progressText');
    DOMElements.resultSection = document.getElementById('resultSection');
    DOMElements.resultImage = document.getElementById('resultImage');
    DOMElements.historySidebar = document.getElementById('historySidebar');
    DOMElements.historyList = document.getElementById('historyList');
    DOMElements.historyCount = document.getElementById('historyCount');
    DOMElements.clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 检查生成按钮状态
    updateGenerateButtonState();
    
    // 从localStorage恢复API密钥和历史记录
    restoreApiKeyFromStorage();
    loadHistoryFromStorage();
    
    // 初始化历史记录显示
    updateHistoryDisplay();
    
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
    
    // 添加键盘粘贴事件监听
    document.addEventListener('paste', handlePasteEvent);
    
    // 添加键盘快捷键说明
    document.addEventListener('keydown', handleKeyboardShortcuts);
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
            DOMElements.clearLeftBtn.style.display = 'block';
        } else {
            AppState.rightImage = base64Data;
            AppState.rightImageFile = file;
            DOMElements.rightImagePreview.src = previewUrl;
            DOMElements.rightImagePreview.style.display = 'block';
            DOMElements.rightImageBox.querySelector('.upload-placeholder').style.display = 'none';
            DOMElements.clearRightBtn.style.display = 'block';
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
    // 支持单图或双图模式
    const hasImages = AppState.leftImage || AppState.rightImage;
    const hasApiKey = AppState.apiKey && AppState.apiKey.length > 0;
    const hasPrompt = DOMElements.promptInput.value.trim().length > 0;
    const isNotGenerating = !AppState.isGenerating;
    
    const canGenerate = hasImages && hasApiKey && hasPrompt && isNotGenerating;
    
    DOMElements.generateBtn.disabled = !canGenerate;
    
    // 显示当前模式
    const imageCount = (AppState.leftImage ? 1 : 0) + (AppState.rightImage ? 1 : 0);
    const modeText = imageCount === 1 ? '单图模式' : imageCount === 2 ? '双图模式' : '';
    
    if (!hasImages) {
        DOMElements.generateBtn.textContent = '🖼️ 请先上传图片';
    } else if (!hasApiKey) {
        DOMElements.generateBtn.textContent = '🔑 请输入API密钥';
    } else if (!hasPrompt) {
        DOMElements.generateBtn.textContent = '✍️ 请输入提示词';
    } else if (AppState.isGenerating) {
        DOMElements.generateBtn.textContent = '⏳ 生成中...';
    } else {
        DOMElements.generateBtn.textContent = `🚀 开始生成 (${modeText})`;
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
            leftImageMimeType: AppState.leftImageFile ? getFileMimeType(AppState.leftImageFile) : null,
            rightImageBase64: AppState.rightImage,
            rightImageMimeType: AppState.rightImageFile ? getFileMimeType(AppState.rightImageFile) : null,
            onProgress: updateProgress
        });
        
        // 显示结果
        AppState.resultImageData = resultBase64;
        
        // 保存到历史记录
        saveToHistory({
            prompt: prompt,
            leftImage: AppState.leftImage,
            rightImage: AppState.rightImage,
            resultImage: resultBase64,
            model: AppState.selectedModel,
            mode: (AppState.leftImage && AppState.rightImage) ? '双图模式' : '单图模式'
        });
        
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
    DOMElements.clearLeftBtn.style.display = 'none';
    DOMElements.clearRightBtn.style.display = 'none';
    DOMElements.promptInput.value = '';
    DOMElements.progressSection.style.display = 'none';
    DOMElements.resultSection.style.display = 'none';
    
    // 更新按钮状态
    updateGenerateButtonState();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showNotification('应用已重置', 'info');
}

/**
 * 清除指定位置的图片
 * @param {string} side - 'left' 或 'right'
 */
function clearImage(side) {
    if (side === 'left') {
        AppState.leftImage = null;
        AppState.leftImageFile = null;
        DOMElements.leftImageInput.value = '';
        DOMElements.leftImagePreview.style.display = 'none';
        DOMElements.leftImageBox.querySelector('.upload-placeholder').style.display = 'block';
        DOMElements.clearLeftBtn.style.display = 'none';
        showNotification('左图已清除', 'info');
    } else if (side === 'right') {
        AppState.rightImage = null;
        AppState.rightImageFile = null;
        DOMElements.rightImageInput.value = '';
        DOMElements.rightImagePreview.style.display = 'none';
        DOMElements.rightImageBox.querySelector('.upload-placeholder').style.display = 'block';
        DOMElements.clearRightBtn.style.display = 'none';
        showNotification('右图已清除', 'info');
    }
    
    updateGenerateButtonState();
}

/**
 * 处理键盘粘贴事件
 * @param {ClipboardEvent} event - 粘贴事件
 */
async function handlePasteEvent(event) {
    // 检查是否在输入框中
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return; // 在文本输入框中不处理图片粘贴
    }
    
    const items = event.clipboardData?.items;
    if (!items) return;
    
    // 查找图片项
    let imageFile = null;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
            imageFile = item.getAsFile();
            break;
        }
    }
    
    if (!imageFile) {
        return;
    }
    
    event.preventDefault();
    
    if (!validateImageFile(imageFile)) {
        return;
    }
    
    // 决定放置位置：按顺序优先放置
    let targetSide = null;
    if (!AppState.leftImage) {
        targetSide = 'left';
    } else if (!AppState.rightImage) {
        targetSide = 'right';
    } else {
        // 两个位置都有图片，询问用户要替换哪个
        const replaceLeft = confirm('左图和右图都已有内容，是否替换左图？\n点击"确定"替换左图，点击"取消"替换右图');
        targetSide = replaceLeft ? 'left' : 'right';
    }
    
    // 模拟文件上传事件
    const mockEvent = {
        target: { files: [imageFile] }
    };
    
    await handleImageUpload(mockEvent, targetSide);
    showNotification(`图片已通过粘贴添加到${targetSide === 'left' ? '左' : '右'}图位置`, 'success');
}

/**
 * 处理键盘快捷键
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleKeyboardShortcuts(event) {
    // Ctrl+V 粘贴提示（已在handlePasteEvent中处理）
    if (event.ctrlKey && event.key.toLowerCase() === 'v') {
        // 检查是否在输入框中
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            return; // 在文本输入框中不处理图片检测
        }
        
        // 显示粘贴提示（如果剪贴板中没有图片）
        setTimeout(() => {
            navigator.clipboard.read().then(items => {
                let hasImage = false;
                items.forEach(item => {
                    if (item.types.some(type => type.startsWith('image/'))) {
                        hasImage = true;
                    }
                });
                
                if (!hasImage) {
                    showNotification('剪贴板中没有图片，请先复制图片', 'info');
                }
            }).catch(() => {
                // 忽略剪贴板权限错误
            });
        }, 100);
    }
    
    // Escape 键重置应用
    if (event.key === 'Escape' && !AppState.isGenerating) {
        if (AppState.leftImage || AppState.rightImage || AppState.resultImageData) {
            if (confirm('确定要重置应用吗？这将清除所有内容。')) {
                resetApp();
            }
        }
    }
}

/**
 * 历史记录管理功能
 */

/**
 * 保存生成记录到历史
 * @param {Object} record - 生成记录
 */
function saveToHistory(record) {
    const historyItem = {
        id: generateUniqueId(),
        timestamp: new Date().toISOString(),
        ...record
    };
    
    // 添加到历史记录数组开头（最新的在前）
    AppState.generationHistory.unshift(historyItem);
    
    // 限制历史记录数量（最多保存50条）
    if (AppState.generationHistory.length > 50) {
        AppState.generationHistory = AppState.generationHistory.slice(0, 50);
    }
    
    // 保存到localStorage
    saveHistoryToStorage();
    
    // 更新显示
    updateHistoryDisplay();
    
    // 设置为当前激活的历史记录
    AppState.activeHistoryId = historyItem.id;
    
    showNotification('已保存到历史记录', 'success');
}

/**
 * 从localStorage加载历史记录
 */
function loadHistoryFromStorage() {
    try {
        const savedHistory = localStorage.getItem('nano-banana-history');
        if (savedHistory) {
            AppState.generationHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
        AppState.generationHistory = [];
    }
}

/**
 * 保存历史记录到localStorage
 */
function saveHistoryToStorage() {
    try {
        localStorage.setItem('nano-banana-history', JSON.stringify(AppState.generationHistory));
    } catch (error) {
        console.error('保存历史记录失败:', error);
    }
}

/**
 * 更新历史记录显示
 */
function updateHistoryDisplay() {
    const historyList = DOMElements.historyList;
    const historyCount = DOMElements.historyCount;
    const clearBtn = DOMElements.clearHistoryBtn;
    
    // 更新计数
    historyCount.textContent = `${AppState.generationHistory.length} 条记录`;
    
    // 更新清空按钮状态
    clearBtn.disabled = AppState.generationHistory.length === 0;
    
    // 清空列表
    historyList.innerHTML = '';
    
    if (AppState.generationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <p>🎨 还没有生成记录</p>
                <small>开始创作吧！</small>
            </div>
        `;
        return;
    }
    
    // 渲染历史记录项
    AppState.generationHistory.forEach((item, index) => {
        const historyItem = createHistoryItemElement(item, index);
        historyList.appendChild(historyItem);
    });
}

/**
 * 创建历史记录项元素
 * @param {Object} item - 历史记录项
 * @param {number} index - 索引
 * @returns {HTMLElement} 历史记录项元素
 */
function createHistoryItemElement(item, index) {
    const div = document.createElement('div');
    div.className = `history-item ${item.id === AppState.activeHistoryId ? 'active' : ''}`;
    div.setAttribute('data-history-id', item.id);
    
    const timeStr = formatHistoryTime(item.timestamp);
    const shortPrompt = item.prompt.length > 60 ? 
        item.prompt.substring(0, 60) + '...' : item.prompt;
    
    div.innerHTML = `
        <div class="history-preview">
            <img src="data:image/jpeg;base64,${item.resultImage}" alt="生成结果" />
        </div>
        <div class="history-info">
            <div class="history-prompt">${shortPrompt}</div>
            <div class="history-meta">
                <span class="history-time">${timeStr}</span>
                <span class="history-mode">${item.mode}</span>
            </div>
            <div class="history-actions">
                <button class="action-btn-small reuse" onclick="reuseHistory('${item.id}')">
                    🔄 复用
                </button>
                <button class="action-btn-small" onclick="viewHistory('${item.id}')">
                    👁️ 查看
                </button>
                <button class="action-btn-small delete" onclick="deleteHistory('${item.id}')">
                    🗑️ 删除
                </button>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * 格式化历史记录时间
 * @param {string} timestamp - ISO时间戳
 * @returns {string} 格式化后的时间
 */
function formatHistoryTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
        return `${Math.floor(diffHours)}小时前`;
    } else {
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 复用历史记录
 * @param {string} historyId - 历史记录ID
 */
function reuseHistory(historyId) {
    const item = AppState.generationHistory.find(h => h.id === historyId);
    if (!item) return;
    
    // 恢复输入状态
    DOMElements.promptInput.value = item.prompt;
    
    // 恢复图片（如果有的话）
    if (item.leftImage) {
        AppState.leftImage = item.leftImage;
        AppState.leftImageFile = { type: 'image/jpeg' }; // 模拟文件对象
        DOMElements.leftImagePreview.src = `data:image/jpeg;base64,${item.leftImage}`;
        DOMElements.leftImagePreview.style.display = 'block';
        DOMElements.leftImageBox.querySelector('.upload-placeholder').style.display = 'none';
        DOMElements.clearLeftBtn.style.display = 'block';
    } else {
        clearImage('left');
    }
    
    if (item.rightImage) {
        AppState.rightImage = item.rightImage;
        AppState.rightImageFile = { type: 'image/jpeg' };
        DOMElements.rightImagePreview.src = `data:image/jpeg;base64,${item.rightImage}`;
        DOMElements.rightImagePreview.style.display = 'block';
        DOMElements.rightImageBox.querySelector('.upload-placeholder').style.display = 'none';
        DOMElements.clearRightBtn.style.display = 'block';
    } else {
        clearImage('right');
    }
    
    updateGenerateButtonState();
    showNotification('已恢复历史记录的设置', 'success');
    
    // 关闭侧边栏（移动端）
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

/**
 * 查看历史记录详情
 * @param {string} historyId - 历史记录ID
 */
function viewHistory(historyId) {
    const item = AppState.generationHistory.find(h => h.id === historyId);
    if (!item) return;
    
    // 设置为激活状态
    AppState.activeHistoryId = historyId;
    
    // 显示结果
    AppState.resultImageData = item.resultImage;
    DOMElements.resultImage.src = `data:image/jpeg;base64,${item.resultImage}`;
    DOMElements.resultSection.style.display = 'block';
    
    // 更新历史记录显示
    updateHistoryDisplay();
    
    // 滚动到结果区域
    DOMElements.resultSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    showNotification('已加载历史记录', 'success');
}

/**
 * 删除历史记录
 * @param {string} historyId - 历史记录ID
 */
function deleteHistory(historyId) {
    if (!confirm('确定要删除这条历史记录吗？')) return;
    
    AppState.generationHistory = AppState.generationHistory.filter(h => h.id !== historyId);
    
    // 如果删除的是当前激活的记录
    if (AppState.activeHistoryId === historyId) {
        AppState.activeHistoryId = null;
    }
    
    saveHistoryToStorage();
    updateHistoryDisplay();
    showNotification('历史记录已删除', 'info');
}

/**
 * 清空所有历史记录
 */
function clearAllHistory() {
    if (AppState.generationHistory.length === 0) return;
    
    if (!confirm(`确定要清空所有 ${AppState.generationHistory.length} 条历史记录吗？`)) return;
    
    AppState.generationHistory = [];
    AppState.activeHistoryId = null;
    
    saveHistoryToStorage();
    updateHistoryDisplay();
    showNotification('所有历史记录已清空', 'info');
}

/**
 * 切换侧边栏显示
 */
function toggleSidebar() {
    AppState.isSidebarOpen = !AppState.isSidebarOpen;
    
    const sidebar = DOMElements.historySidebar;
    const mainContainer = document.querySelector('.main-container');
    
    if (AppState.isSidebarOpen) {
        sidebar.classList.add('open');
        if (window.innerWidth > 768) {
            mainContainer.classList.add('sidebar-open');
        }
    } else {
        sidebar.classList.remove('open');
        mainContainer.classList.remove('sidebar-open');
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initializeApp);