# Claude Code 开发原则和行为准则

## Core Development Principles

**作为资深开发者，请严格遵守以下原则生成代码：**

1. **KISS原则**：保持代码简单，避免复杂设计
2. **YAGNI原则**：仅实现当前需要的功能，避免添加未来猜测的功能  
3. **SOLID原则**：遵守单一职责、开放封闭、里氏替换、接口隔离和依赖倒置原则
4. **⚠️ 完整实现原则**：**写代码时一定要按照最初的功能预期去写，不能用简化或者占位替代**

**请生成高质量、易维护且性能良好的代码。**

**❌ 禁止的做法：**
```javascript
// 错误示例 - 使用占位符
function processData(data) {
  // TODO: 实现处理逻辑
  console.log('功能待实现')
  return null
}

// 错误示例 - 简化替代
function initializeService() {
  return { status: 'mock' } // 临时返回
}
```

**✅ 正确的做法：**
```javascript
// 正确示例 - 完整实现
function processData(data) {
  const processor = new DataProcessor()
  const validatedData = processor.validate(data)
  const result = processor.transform(validatedData)
  return result
}
```

## Behavior Guidelines

**保持文件夹干净的开发行为准则：**

1. **每个小项写完需要测试** - 为每个功能模块创建对应测试文件
2. **测试完删除测试文件** - 功能稳定后删除临时测试文件，保持项目整洁
3. **Git描写修改内容** - 每次提交都要详细描述修改内容和原因

**Standard Workflow:**
```bash
# 1. 实现功能 + 创建测试
# 2. 运行测试验证功能
# 3. 功能稳定后删除测试文件  
# 4. Git提交并详细描述修改
git add .
git commit -m "feat(module): 详细描述功能实现和测试结果"
```

## Nano Banana App 项目特定原则

**本项目使用 Gemini 2.5 Flash Image API 开发图像处理应用，额外遵循：**

1. **API优化原则**：
   - 合理使用API调用，避免不必要的重复请求
   - 实现适当的缓存机制
   - 处理API限制和错误情况

2. **图像处理原则**：
   - 支持多种图像格式和尺寸
   - 实现图像质量优化和放大功能
   - 提供清晰的用户反馈和进度指示

3. **用户体验原则**：
   - 响应时间控制在合理范围(10-15秒)
   - 提供预览和编辑功能
   - 简洁直观的界面设计

**API使用规范：**
```javascript
// 正确的API调用方式
const geminiRequest = {
  contents: [{
    parts: [
      { text: prompt },
      { inline_data: { mime_type: "image/jpeg", data: base64Data }}
    ]
  }]
}
```

## 推荐技术栈

- **前端框架**：React/Vue.js 或原生JavaScript
- **后端处理**：Node.js + Express
- **图像处理**：Canvas API + PIL/OpenCV for upscaling
- **状态管理**：Context API 或简单状态管理
- **构建工具**：Vite 或 Webpack

---

**开发提醒**：每次开始开发任务时，请确保按照上述四大原则（KISS、YAGNI、SOLID、完整实现原则）和行为准则开发，确保代码简洁、只实现必要功能、完整实现不用占位符，测试完成后删除测试文件。