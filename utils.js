/**
 * 工具函数模块
 * 遵循KISS原则，提供简单实用的工具函数
 */

/**
 * 将文件转换为Base64编码
 * @param {File} file - 要转换的文件
 * @returns {Promise<string>} Base64字符串
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // 移除data:image/...;base64,前缀
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 获取文件的MIME类型
 * @param {File} file - 文件对象
 * @returns {string} MIME类型
 */
function getFileMimeType(file) {
    if (!file) {
        return 'image/jpeg';
    }
    return file.type || 'image/jpeg';
}

/**
 * 验证文件是否为图片
 * @param {File} file - 要验证的文件
 * @returns {boolean} 是否为有效图片
 */
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('请选择有效的图片文件 (JPG, PNG, WebP, GIF)', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('文件大小不能超过10MB', 'error');
        return false;
    }
    
    return true;
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 1rem;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加动画样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 从Base64创建下载链接
 * @param {string} base64Data - Base64数据
 * @param {string} mimeType - MIME类型
 * @returns {string} Blob URL
 */
function createDownloadUrl(base64Data, mimeType = 'image/jpeg') {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    return URL.createObjectURL(blob);
}

/**
 * 复制图片到剪贴板
 * @param {string} imageUrl - 图片URL或Base64
 */
async function copyImageToClipboard(imageUrl) {
    try {
        // 如果是base64，需要转换为blob
        let blob;
        if (imageUrl.startsWith('data:')) {
            const response = await fetch(imageUrl);
            blob = await response.blob();
        } else {
            const response = await fetch(imageUrl);
            blob = await response.blob();
        }
        
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        showNotification('图片已复制到剪贴板', 'success');
    } catch (error) {
        console.error('复制失败:', error);
        showNotification('复制失败，请手动保存', 'error');
    }
}

/**
 * 生成当前时间戳文件名
 * @param {string} prefix - 文件名前缀
 * @param {string} extension - 文件扩展名
 * @returns {string} 生成的文件名
 */
function generateTimestampFilename(prefix = 'nano-banana', extension = 'jpg') {
    const now = new Date();
    const timestamp = now.toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .substring(0, 19);
    
    return `${prefix}_${timestamp}.${extension}`;
}