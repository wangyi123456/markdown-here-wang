# ![Markdown Here 图标](https://raw.github.com/adam-p/markdown-here/master/src/common/images/icon48.png) Markdown Here

> 用 Markdown 写邮件，一键渲染为精美排版。

## ✨ 功能特色

- **一键转换**：在任意富文本编辑器中用 Markdown 写作，点击按钮即刻渲染为 HTML
- **多种渲染风格**：内置 🌸温柔风、📐严谨风、💻科技风 三种主题，右键菜单可快速切换
- **语法高亮**：在代码块中指定语言即可获得漂亮的语法着色
- **TeX 数学公式**：支持 `$...$` 语法渲染数学公式
- **全中文界面**：选项页、右键菜单、提示信息全部汉化

## 📦 安装方法

### Chrome（开发者模式加载）

1. 克隆或下载本仓库
2. 打开 Chrome，进入 `chrome://extensions/`
3. 开启右上角「开发者模式」
4. 点击「加载已解压的扩展程序」，选择本仓库的 `src` 目录
5. 完成！刷新你的邮箱页面即可开始使用

### 构建打包

```bash
cd utils
node build.js
```

产物在 `dist/chrome.zip`。

## 🚀 使用方法

1. 在 Gmail、微信公众号后台等富文本编辑器中，用 **Markdown** 语法写内容
2. **点击**工具栏上的 Markdown Here 按钮（或按快捷键 `Alt+Shift+M`）
3. 内容立刻渲染为精美 HTML！再次点击可撤销渲染

### 切换渲染风格

- **方式一**：在编辑区**右键** → 「切换渲染风格」→ 选择温柔风/严谨风/科技风
- **方式二**：点击扩展「选项」页面，直接点选主题卡片

### 部分选区转换

选中一部分文字后点击按钮，只转换选中部分。选中已转换区域后再次点击可恢复原文。

### 撤销转换

在已转换的内容中右键 →「Markdown转换」，即可恢复为原始 Markdown。

## ⚙️ 选项说明

在 Chrome 扩展管理页中点击 Markdown Here 的「选项」，可以访问设置页面：

- **渲染风格**：选择 温柔风/严谨风/科技风
- **自定义 CSS**：直接编辑渲染样式
- **语法高亮主题**：选择代码块的着色方案
- **TeX 数学公式**：开启/关闭公式渲染
- **忘记转换检查**：发送邮件前自动检测未渲染的 Markdown

## 🔧 二次开发

### 项目结构

```
src/
├── manifest.json        # Chrome 扩展配置
├── _locales/zh_CN/      # 中文翻译
├── common/
│   ├── default.css      # 默认 CSS（温柔风）
│   ├── styles/          # 三种主题 CSS
│   ├── options.html     # 选项页面
│   ├── options.js       # 选项页逻辑
│   ├── options-store.js # 配置存储
│   ├── markdown-here.js # 核心转换逻辑
│   ├── markdown-render.js # 渲染引擎
│   └── ...
├── chrome/
│   ├── backgroundscript.js # 后台脚本（含右键菜单）
│   └── contentscript.js    # 内容脚本
└── ...
```

### 新增主题

1. 在 `src/common/styles/` 中创建新 CSS 文件
2. 在 `options.html` 中的 `.theme-selector` 添加一个主题卡片
3. 在 `options.js` 的 `selectTheme()` 函数的 `themeMap` 中添加映射
4. 在 `backgroundscript.js` 的 `onInstalled` 中添加对应的上下文菜单项

## 📋 兼容性

支持在以下平台使用：

| 平台 | 状态 |
|------|------|
| Gmail | ✅ 完全支持 |
| 微信公众号后台 | ✅ 支持 |
| Outlook.com | ✅ 支持 |
| Google Groups | ✅ 支持 |
| Evernote | ✅ 支持 |
| Blogger | ✅ 支持 |
| WordPress | ✅ 支持 |

## 📝 致谢

- Markdown 转 HTML: [chjj/marked](https://github.com/chjj/marked)
- 语法高亮: [isagalaev/highlight.js](https://github.com/isagalaev/highlight.js)
- HTML 转文本: [mtrimpe/jsHtmlToText](https://github.com/mtrimpe/jsHtmlToText)
- 原项目: [adam-p/markdown-here](https://github.com/adam-p/markdown-here)

## 📄 许可证

MIT License: https://adampritchard.mit-license.org/
