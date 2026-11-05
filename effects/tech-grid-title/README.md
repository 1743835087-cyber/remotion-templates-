# TechGridTitle (科技取景器网格逐字下砸标题卡片模板)

专为数码测评、科技口播、开箱实测视频定制的取景器级动态标题卡片组件。

---

## 🌟 核心视觉特性

1. **60 FPS 极速动力学**：
   - 字符以 $260\ \text{stiffness}$ 高重力加速度依次下砸（间隔 4 帧 = 0.067s/字）。
   - 包含物理快门动态运动模糊（Motion Blur），落地微弹瞬间速度归零，即刻恢复 100% 锐利。
2. **两段式机械展开**：
   - 激光中心线向两侧飞速拉开，随后上下阻尼撑开成立体半透明取景器框体。
   - 4 个顶角工程方块向外伸出 CAD 准星延伸线。
3. **半透明毛玻璃 + 框内锁定网格**：
   - 框体背景为 `rgba(10, 15, 26, 0.82)` 配合 `backdrop-filter: blur(16px)`，底层口播人物或产品画面自然透出。
   - 正交工程网格与十字准星**严格锁定在框体内**，框外画布 **100% 绝对纯透明**。
4. **精钢冷银质感**：
   - 字身冷银（`#D0D9E6`）+ 极细纯白微描边（`1.6px #FFFFFF`）+ 深度软阴影，彻底告别假荧光。

---

## ⚙️ 参数配置表 (Props)

| 属性名 | 类型 | 默认值 | 作用说明 |
| :--- | :--- | :--- | :--- |
| `tagText` | `string` | `"iPhone 18 Pro 系列 机模上手体验"` | 顶部小标题（自动将英文/数字产品名与中文副标分级排版） |
| `mainText` | `string` | `"网络与基带芯片"` | 核心大标题文字（逐字掉落动效） |
| `staggerDelay` | `number` | `4` | 字符下砸间隔帧数（60fps 下推荐 3~5 帧） |
| `boxWidth` | `number` | `1460` | 卡片宽度 (px) |
| `boxHeight` | `number` | `224` | 卡片高度 (px) |
| `fontSize` | `number` | `126` | 主标题字号 (px) |
| `boxBgOpacity` | `number` | `0.82` | 框内半透明磨砂背景浓度 (0.4 ~ 0.95) |
| `verticalOffset` | `number` | `0` | 垂直位移（居中为 0；若置于口播画面下三分之一可设 `+280`） |
| `previewFootageBackground` | `boolean` | `false` | 是否开启机模实景背景（导出透明视频时务必为 `false`） |

---

## 🚀 渲染与导出指南（彻底解决 MOV 体积过大问题）

### 💡 为什么 ProRes 4444 MOV 会很大？
Apple ProRes 4444 是广播级**全帧内无损编码**（每秒码率高达 200~300Mbps），一个 3.5 秒的透明视频即可达 **95 MB**，虽兼容性好但极占空间。

### ⚡ 最佳解决方案对比

| 方案 | 格式 / 模式 | 体积大小 | 压缩率 | 适用软件与用法 |
| :--- | :--- | :--- | :--- | :--- |
| **方案 1 (最推荐)** | **WebM (VP9 + Alpha 通道)** | **860 KB** | **体积骤降 99.1%** | **剪映专业版、PR、达芬奇、网页、OBS 全面支持**。直接拖入轨道置顶即可，保留完整透明度与毛玻璃暗部！ |
| **方案 2 (零门槛)** | **MP4 (H.264) + 混合模式** | **600 KB** | **体积骤降 99.4%** | 导出黑底 MP4，在剪映中将视频混合模式设为【滤色 (Screen)】，黑色瞬间变透明，手机电脑全兼容！ |
| **方案 3 (广播级)** | **ProRes 4444 MOV** | **95 MB** | 原生无损 | 传统 PR / Final Cut Pro 工业制作流程。 |

---

### 💻 命令行渲染指令

```powershell
# 1. 导出轻量级透明通道视频 (推荐：WebM 格式，仅 860KB)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render TechGridTitle out/tech-grid-title-alpha.webm --codec=vp9 --pixel-format=yuva420p

# 2. 导出剪映滤色专用黑底 MP4 (仅 600KB，全平台支持)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render TechGridTitle out/tech-grid-title-screen.mp4

# 3. 导出传统 ProRes 4444 透明通道 MOV (95MB)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render TechGridTitle out/tech-grid-title-alpha.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le

# 4. 导出带实景机模背板对比的 60FPS 演示 MP4
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npx remotion render TechGridTitlePreview out/tech-grid-title-preview.mp4
```
