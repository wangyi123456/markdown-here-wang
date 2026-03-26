<div align="center">

<img src="src/common/images/icon128.png" width="80" height="80" alt="MD快速排版图标"/>

# MD快速排版

**在邮件、公众号、论坛里用 Markdown 写作，一键渲染成精美排版。**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](./LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wangyi123456/markdown-here-wang/pulls)

</div>

---

## ✨ 特色功能

| 功能 | 说明 |
|---|---|
| 🎨 **三套主题** | 温柔风 · 严谨风 · 科技风，右键菜单即可切换 |
| ⌨️ **快捷键** | `Alt+Shift+M` 一键渲染 / 撤销 |
| 🖌️ **自定义 CSS** | 基于主题微调，精确控制每处样式 |
| 🔤 **代码高亮** | 内置 Highlight.js，支持百余种语言 |
| 📐 **TeX 公式** | 支持 `$...$` 语法，通过 CodeCogs 渲染 |
| 🌐 **全中文界面** | 选项页、右键菜单全部汉化 |
| 🔄 **一键撤销** | 渲染后可随时撤销，还原原始 Markdown |

---

## 📸 效果预览

> 在选项页中，点击「▶ Markdown 转换」按钮即可实时预览三种主题效果。

---

## 📦 安装

### 方法一：开发者模式加载（推荐）

1. 克隆本仓库：
   ```bash
   git clone https://github.com/wangyi123456/markdown-here-wang.git
   ```
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角 **「开发者模式」**
4. 点击 **「加载已解压的扩展程序」**，选择项目中的 `src` 目录
5. ✅ 完成！刷新邮箱页面即可开始使用

### 方法二：构建打包

```bash
cd utils
node build.js
```

产物输出至 `dist/chrome.zip`。

---

## 🚀 使用方法

```
1. 打开富文本编辑器（Gmail、公众号后台等）
2. 用 Markdown 语法写好内容
3. 点击工具栏 icon 或按  Alt+Shift+M
4. ✨ 内容立刻渲染为精美 HTML！
```

### 切换渲染风格

- **方式 A**：在编辑区 **右键** → 「切换渲染风格」
- **方式 B**：进入插件 **选项页**，点选主题卡片

### 局部转换 / 撤销

- **选中部分文字**后点击按钮 → 仅转换选中区域
- 在已渲染区域内 **右键** → 「Markdown 转换」→ 撤销渲染

---

## ⚙️ 选项说明

在 Chrome 扩展管理页点击 MD快速排版 的「选项」进入设置页：

| 选项 | 说明 |
|---|---|
| 渲染风格 | 三选一：温柔风 / 严谨风 / 科技风 |
| 微调 CSS | 基于当前主题，直接编辑覆盖样式 |
| 语法高亮主题 | 下拉选择代码块色彩主题 |
| GFM 换行 | 单换行符即换行（GitHub 风格） |
| 自动标题锚点 | 为每个标题自动生成跳转锚点 |
| TeX 数学公式 | 开启后支持 `$...$` 公式渲染 |
| 忘记转换检查 | 发邮件前检测是否遗漏渲染 |

---

## 🗂️ 项目结构

```
markdown-here-wang/
├── src/
│   ├── manifest.json            # Chrome 扩展配置
│   ├── _locales/                # 多语言支持（默认 zh_CN）
│   │   └── zh_CN/messages.json
│   ├── common/
│   │   ├── options.html         # 选项页 UI
│   │   ├── options.js           # 选项页逻辑
│   │   ├── options-store.js     # 配置存储（chrome.storage）
│   │   ├── options-iframe.html  # 实时预览区
│   │   ├── markdown-here.js     # 核心渲染调度
│   │   ├── markdown-render.js   # Markdown 渲染引擎
│   │   ├── common-logic.js      # 公共逻辑
│   │   ├── utils.js             # 工具函数
│   │   ├── marked.js            # Markdown 解析器（marked.js）
│   │   ├── default.css          # 默认主题 CSS（温柔风）
│   │   ├── styles/              # 三种主题 CSS 文件
│   │   │   ├── style-gentle.css
│   │   │   ├── style-formal.css
│   │   │   └── style-tech.css
│   │   ├── highlightjs/         # 语法高亮库
│   │   ├── images/              # 图标资源
│   │   └── vendor/              # 第三方库（DOMPurify 等）
│   └── chrome/
│       ├── backgroundscript.js  # 后台脚本（右键菜单）
│       └── contentscript.js     # 内容脚本（页面注入）
├── utils/
│   └── build.js                 # 打包脚本
├── Makefile                     # 构建快捷命令
├── LICENSE
└── README.md
```

---

## 🎨 新增主题

1. 在 `src/common/styles/` 中创建新的 CSS 文件（如 `style-ocean.css`）
2. 在 `src/common/options.html` 的 `.themes` 区域添加一个主题卡片
3. 在 `src/common/options.js` 的 `selectTheme()` 函数 `themeMap` 中添加映射
4. 在 `src/chrome/backgroundscript.js` 的 `onInstalled` 中添加右键菜单项

---

## 📋 兼容性

| 平台 | 状态 |
|---|---|
| Gmail | ✅ 完全支持 |
| 微信公众号后台 | ✅ 支持 |
| Outlook.com | ✅ 支持 |
| Yahoo Mail | ✅ 支持 |
| Evernote Web | ✅ 支持 |
| Blogger | ✅ 支持 |
| Google Groups | ✅ 支持 |

---

## 🤝 贡献

欢迎提交 PR 或 Issue！

1. Fork 本仓库
2. 创建你的功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 发起 Pull Request

---

## 🙏 致谢与声明

本项目基于 [adam-p/markdown-here](https://github.com/adam-p/markdown-here) 开发，核心渲染引擎代码来自原项目，在此致谢！

| 依赖 / 来源 | 说明 |
|---|---|
| [adam-p/markdown-here](https://github.com/adam-p/markdown-here) | 原始扩展框架与核心逻辑 |
| [chjj/marked](https://github.com/chjj/marked) | Markdown → HTML 解析器 |
| [isagalaev/highlight.js](https://github.com/isagalaev/highlight.js) | 代码语法高亮 |
| [mtrimpe/jsHtmlToText](https://github.com/mtrimpe/jsHtmlToText) | HTML → 纯文本转换 |
| [cure53/DOMPurify](https://github.com/cure53/DOMPurify) | HTML 安全净化 |

---

## 📄 许可证

[MIT License](./LICENSE) · Copyright (c) 2026 词元why

> 原始项目 Markdown Here 由 Adam Pritchard 创作，同样采用 MIT 协议。
