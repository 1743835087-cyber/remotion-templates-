# 灵动岛卡片 (`effects/灵动岛卡片`)

专为 **Remotion 人物口播视频原生叠加** 设计的暗黑科技感灵动岛动效组件。
无需绿幕抠像，直接叠在 `<OffthreadVideo>` 上即可保留完整的**底部电光冰蓝外发光**与**液态弹簧变形**。

## 在口播视频里直接调用

```tsx
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { 灵动岛卡片 } from "../effects/灵动岛卡片";

export const MyTalkingHeadVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 底层：人物口播实拍画面 */}
      <OffthreadVideo src={staticFile("talking-head.mp4")} />

      {/* 上层：按口播时间点叠加灵动岛卡片（自动适配 30/60fps 与任意停留时长） */}
      <Sequence from={90} durationInFrames={180}>
        <灵动岛卡片
          leftText="实测"
          highlightNumber={108}
          unitText="台"
          rightBoldText="随身"
          rightLightText="WiFi"
          position="bottom"
          scale={0.88}
          accentColor="#58b4ff"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## 核心参数

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `leftText` | `string` | `"实测"` | 左侧引导词 |
| `highlightNumber` | `number` | `108` | 中央超大高亮数字（支持整数与小数） |
| `countUp` | `boolean` | `true` | 是否启用 `0 → 目标值` 冲刺计数 |
| `highlightText` | `string` | `undefined` | 传此项时改为纯文字高亮，不计数 |
| `unitText` | `string` | `"台"` | 数字右下角单位 |
| `rightBoldText` | `string` | `"随身"` | 右侧粗体主词 |
| `rightLightText` | `string` | `"WiFi"` | 右侧极细发光词 |
| `position` | `"center" \| "bottom" \| "top" \| "lower-left" \| "lower-right"` | `"bottom"` | 口播画面摆放位置 |
| `scale` | `number` | `0.88` | 整体缩放比例 |
| `accentColor` | `string` | `"#58b4ff"` | 底部霓虹流光颜色 |
| `previewBackground` | `boolean` | `false` | `false` 为原生透明叠层，`true` 显示暗黑点阵预览底 |
