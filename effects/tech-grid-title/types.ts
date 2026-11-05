export interface TechGridTitleProps {
  /** 顶部小标题/分类标签（如 "iPhone 18 Pro 系列 机模上手体验"） */
  tagText?: string;
  /** 核心大标题文字（逐字掉落动效，如 "网络与基带芯片"） */
  mainText?: string;
  /** 每个字符掉落的间隔帧数（60fps 下推荐 4 帧 = 约 0.067s/字） */
  staggerDelay?: number;
  /** 框体宽度 (px，默认 1460) */
  boxWidth?: number;
  /** 框体高度 (px，默认 224) */
  boxHeight?: number;
  /** 主标题字号 (px，默认 126) */
  fontSize?: number;
  /** 框内半透明磨砂背景的深色浓度 (0.4 ~ 0.95，默认 0.82) */
  boxBgOpacity?: number;
  /** 垂直位置偏移 (px，默认 0 居中；若放口播画面下方可设 +280) */
  verticalOffset?: number;
  /** 
   * 是否在预览中显示底层机模实景背景（用于 Studio 或生成演示效果观察；
   * 导出给剪映/PR用作透明通道叠加层时请保持 false）
   */
  previewFootageBackground?: boolean;
}

export const defaultTechGridTitleProps: TechGridTitleProps = {
  tagText: "iPhone 18 Pro 系列 机模上手体验",
  mainText: "网络与基带芯片",
  staggerDelay: 4,
  boxWidth: 1460,
  boxHeight: 224,
  fontSize: 126,
  boxBgOpacity: 0.82,
  verticalOffset: 0,
  previewFootageBackground: false,
};
