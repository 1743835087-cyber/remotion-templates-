# Remotion 动效项目规范与维护指南 (AGENTS.md)

本项目为长期维护的多动效 Remotion 工程工作区。遵循“单仓库共享基础、多特效独立子包”的模块化架构规范。

---

## 1. 项目目录架构

```text
动画测试/
├── effects/                      # 核心动效目录：所有独立动画均在此创建独立子文件夹
│   ├── test-animation/           # 环境自检与最小化验证动画
│   │   └── index.tsx
│   └── cpe-terminal/             # 5G 路由终端（宽带替代品）商业演示动效
│       └── index.tsx
├── public/                       # 静态资源共享目录
│   ├── cpe_device.png            # 硬件实拍图片资源
│   └── fonts/                    # 阿里巴巴普惠体 3.0 离线字体文件 (Heavy/Bold/Medium/Regular)
├── src/                          # 全局入口与共享组件
│   ├── Root.tsx                  # Remotion Composition 统一注册中心（按 Folder 分类注册）
│   ├── index.ts                  # Remotion 入口
│   ├── components/               # 跨特效共享的基础组件与模型 (Background, DeviceModel 等)
│   └── styles/                   # 全局样式与字体加载器 (loadFonts.ts)
├── out/                          # 渲染成果输出目录 (MP4 / PNG)
├── remotion.config.ts            # Remotion CLI 核心配置
├── tsconfig.json                 # TypeScript 编译配置
└── package.json                  # 全局依赖管理（所有动效共享）
```

---

## 2. 依赖管理规范

1. **版本精确锁定**：
   - 所有 `remotion` 和 `@remotion/*` 依赖包必须严格保持相同精确版本（当前固定为 `4.0.539`）。
   - 严禁随意执行升级操作（如 `npm update` 或引入带 `^` 的不兼容大版本）。
2. **共享依赖模式**：
   - 严禁在 `effects/` 子目录中执行 `npm init` 或单独安装 `node_modules`。
   - 3D (`@remotion/three`, `three`)、音频处理、图表等额外依赖，统一按需在根目录下安装。

---

## 3. 系统环境基线

| 运行时 / 工具 | 当前版本 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v26.13.0` | 已配置并就绪 | 系统主运行环境 |
| **npm** | `11.20.0` | 已配置并就绪 | ExecutionPolicy 设置为 `RemoteSigned` |
| **FFmpeg** | `v8.0` | 已配置并就绪 | 已加入 User PATH，具备硬件编解码支持 |
| **FFprobe** | `v8.0` | 已配置并就绪 | 已加入 User PATH，多媒体分析就绪 |
| **Headless Shell** | `v157.0.8080.0` | 已就绪 | 存放于 `node_modules\.remotion\chrome-headless-shell` |
| **阿里巴巴普惠体** | `3.0 全量` | 已就绪 | 本地静态引入，无外网依赖风险 |

---

## 4. 常见问题排查与解决手记（避免盲目重装）

### Q1: PowerShell 运行 npm 报错 `UnauthorizedAccess`
- **根因**：Windows 默认禁止执行无签名脚本（ExecutionPolicy 为 Restricted）。
- **解法**：在 PowerShell 中执行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` 即可永久解决，无需改用管理员权限或重装 Node。

### Q2: 渲染时报错 `Old Headless mode has been removed from the Chrome binary`
- **根因**：系统 Chrome/Edge (>=132) 移除了传统的 `--headless=old` 模式，直接将 `browserExecutable` 指向日常浏览器会导致 Chromium 拒绝启动。
- **解法**：切勿将 `remotion.config.ts` 中的 `browserExecutable` 指向系统日常使用的 Chrome；必须使用 Remotion 官方适配的独立 `chrome-headless-shell.exe`，并在对应目录放置 `VERSION` 校验文件。

### Q3: CSS 中引入本地字体报错 `Module not found`
- **根因**：Webpack 遇到 CSS 中的 `url('/fonts/...')` 会尝试将其当做 npm 模块解析，而非 public 静态路径。
- **解法**：使用 `@remotion/fonts` 的 `loadFont({ family: '...', url: staticFile('fonts/...') })` 机制加载，既保证离线可用，又避免 Webpack 报错。

### Q4: 找不到 `ffmpeg` / `ffprobe` 命令
- **根因**：系统中已存在编译好的 FFmpeg（如 Topaz Video 或专业视频软件附带目录），但路径未写入系统或用户 `PATH` 变量。
- **解法**：定位已有程序目录（`C:\Program Files\Topaz Labs LLC\Topaz Video`）并将其追加至 User PATH 环境变量即可，切勿盲目重复下载。

---

## 5. 常用研发与渲染指令

```powershell
# 1. 启动 Studio 交互式工作台
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion studio

# 2. 验证环境自检动画 (渲染静态图 / MP4)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion still TestAnimation out/test-still.png --frame=45
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render TestAnimation out/test-animation.mp4

# 3. 渲染 5G CPE 终端动画
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render CpeTerminal out/cpe-terminal.mp4
```
