import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

// 60 FPS 主机级电影流畅度，总时长 3.5 秒 (210 帧 @ 60fps)
export const TECH_GRID_DROP_DURATION = 210;

export interface TechGridDropTitleProps {
  /** 顶部小标题/分类标签 */
  tagText?: string;
  /** 核心大标题文字（自动逐字掉落） */
  mainText?: string;
  /** 每个字符掉落的间隔帧数（60fps 下默认 4 帧 = 约 0.067s/字） */
  staggerDelay?: number;
  /** 框体宽度 (px，默认 1380) */
  boxWidth?: number;
  /** 框体高度 (px，默认 230) */
  boxHeight?: number;
  /** 主标题字号 (默认 136) */
  fontSize?: number;
  /** 框内半透明磨砂背景的深色浓度 (0.4 ~ 0.95，默认 0.78) */
  boxBgOpacity?: number;
  /** 垂直位置偏移 (px，默认 0 居中；若放口播画面下方可设 +250) */
  verticalOffset?: number;
  /** 
   * 是否在预览中显示底层口播测试视频背景（仅用于 Studio 效果观察；
   * 导出给剪映/PR用作透明通道叠加层时请保持 false）
   */
  previewFootageBackground?: boolean;
}

export const defaultTechGridDropProps: TechGridDropTitleProps = {
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

/**
 * 专为口播画面打造的科技 HUD 取景器文字卡片 (60 FPS 极速逐字掉落 + 动态运动模糊)
 */
export const TechGridDropTitle: React.FC<TechGridDropTitleProps> = ({
  tagText = defaultTechGridDropProps.tagText!,
  mainText = defaultTechGridDropProps.mainText!,
  staggerDelay = 4,
  boxWidth = 1380,
  boxHeight = 230,
  fontSize = 136,
  boxBgOpacity = 0.78,
  verticalOffset = 0,
  previewFootageBackground = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const handle = delayRender("Loading fonts for TechGridDropTitle");
    ensureFontsLoaded()
      .then(() => {
        if (isMounted) {
          setFontReady(true);
          continueRender(handle);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFontReady(true);
          continueRender(handle);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!fontReady) {
    return null;
  }

  // ========================================================
  // 1. 明显的边框展开动效（60 FPS 两段式：横向激光划线 -> 上下弹性撑开）
  // ========================================================

  // 阶段 A：中心线向两侧飞速拉开 (0 ~ 16 帧)
  const lineDrawProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  const currentLineWidth = interpolate(lineDrawProgress, [0, 1], [0, boxWidth]);
  const lineOpacity = interpolate(lineDrawProgress, [0, 0.2, 1], [0, 1, 1]);

  // 阶段 B：从横线向上下撑开成立体框体 (14 ~ 36 帧，高弹性 Spring)
  const boxUnfoldProgress = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const currentHeight = interpolate(boxUnfoldProgress, [0, 1], [3, boxHeight]);
  const boxContentOpacity = interpolate(boxUnfoldProgress, [0, 0.4, 1], [0, 0.7, 1]);

  // 阶段 B2：角标与 CAD 延伸线进入 (18 ~ 34 帧)
  const handleScale = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, stiffness: 220 },
  });
  const extensionLineProgress = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const currentExtLengthH = interpolate(extensionLineProgress, [0, 1], [0, 75]);
  const currentExtLengthV = interpolate(extensionLineProgress, [0, 1], [0, 48]);

  // 阶段 C：顶部小标题滑出 (24 ~ 44 帧)
  const tagEntrance = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const tagTranslateX = interpolate(tagEntrance, [0, 1], [-30, 0]);
  const tagOpacity = interpolate(tagEntrance, [0, 1], [0, 1]);

  // 阶段 D：出场收敛淡出 (最后 20 帧)
  const exitFrames = 20;
  const exitProgress = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
  );
  const globalOpacity = (1 - exitProgress);

  // 运镜极慢缓推
  const cameraDrift = interpolate(frame, [0, durationInFrames], [1.0, 1.02], {
    easing: Easing.out(Easing.quad),
  });

  const chars = Array.from(mainText);

  // 辅助函数：计算 60fps 下任意字符在当前帧与上一帧的高速位移差，生成逼真的物理垂直运动模糊
  const computeCharMotion = (index: number) => {
    // 边框撑开差不多时，大字从第 28 帧起依次间隔 staggerDelay 下砸
    const startFrame = 28 + index * staggerDelay;

    const calcY = (f: number) => {
      if (f < startFrame) return -140;
      const progress = spring({
        frame: f - startFrame,
        fps,
        config: {
          damping: 13.5, // 清脆弹性的触底阻尼
          stiffness: 260, // 极强的重力加速度
          mass: 0.85,
        },
      });
      return interpolate(progress, [0, 1], [-140, 0]);
    };

    const currentY = calcY(frame);
    const prevY = calcY(frame - 0.5); // 半帧位移速度探测
    const velocity = Math.abs(currentY - prevY);

    // 动态运动模糊：高速下坠期产生最高 8px 垂直方向快门模糊，触底瞬间速度为 0 即刻恢复极致锐利！
    const motionBlurY = frame >= startFrame && velocity > 1.2
      ? Math.min(8, velocity * 0.45)
      : 0;

    const charOpacity = frame >= startFrame
      ? interpolate(frame - startFrame, [0, 3], [0, 1], { extrapolateRight: "clamp" })
      : 0;

    return {
      translateY: currentY,
      motionBlurY,
      opacity: charOpacity,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent", // 关键：全屏绝对纯透明！
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', -apple-system, sans-serif",
      }}
    >
      {/* 仅在开启 previewFootageBackground 时渲染模拟口播/数码测评演示背景 */}
      {previewFootageBackground && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* 暗色演播室摄影棚背景 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #0D121D 0%, #080C14 50%, #0A0E17 100%)",
            }}
          />
          {/* 模拟参考图中的两台旗舰机背板 (左银白，右深蓝) 置于底层，直观展现卡片毛玻璃透视效果 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {/* 左侧银白色机模背板 */}
            <div
              style={{
                width: 480,
                height: 720,
                borderRadius: 44,
                background: "linear-gradient(170deg, #F0F2F5 0%, #C9D1DC 45%, #9AA5B6 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.8)",
                border: "4px solid #7D8899",
                opacity: 0.9,
              }}
            />
            {/* 右侧远峰深蓝机模背板 */}
            <div
              style={{
                width: 480,
                height: 720,
                borderRadius: 44,
                background: "linear-gradient(170deg, #3C5B7C 0%, #20354E 50%, #152436 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.4)",
                border: "4px solid #435E7F",
                opacity: 0.9,
              }}
            />
          </div>
          {/* 摄影棚柔光阴影与暗角 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>
      )}

      {/* ================= 居中 HUD 卡片主视口 ================= */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${verticalOffset}px) scale(${cameraDrift})`,
          opacity: globalOpacity,
          pointerEvents: "none",
        }}
      >
        {/* === 核心卡片容器 === */}
        <div
          style={{
            position: "relative",
            width: currentLineWidth,
            height: currentHeight,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: lineOpacity,
          }}
        >
          {/* 顶部小标题：位于外框左上角 */}
          {(() => {
            const tagMatch = tagText.match(/^([A-Za-z0-9\s]+?)\s+([\u4e00-\u9fa5].*)$/);
            const prefix = tagMatch ? tagMatch[1] : tagText.split(" ")[0];
            const suffix = tagMatch
              ? tagMatch[2]
              : tagText.includes(" ")
              ? tagText.substring(tagText.indexOf(" ") + 1)
              : "";

            return (
              <div
                style={{
                  position: "absolute",
                  top: -44,
                  left: 4,
                  display: "flex",
                  alignItems: "center",
                  transform: `translateX(${tagTranslateX}px)`,
                  opacity: tagOpacity,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  style={{
                    fontSize: 27,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    textShadow: "0 2px 8px rgba(0,0,0,0.95)",
                  }}
                >
                  {prefix}
                </span>
                {suffix && (
                  <span
                    style={{
                      fontSize: 25,
                      fontWeight: 700,
                      color: "#9AAAC0",
                      marginLeft: 14,
                      textShadow: "0 2px 8px rgba(0,0,0,0.85)",
                    }}
                  >
                    {suffix}
                  </span>
                )}
              </div>
            );
          })()}

          {/* CAD 延伸工程线与四个顶角锚点方块 (CAD Guideline Extensions & Corner Nodes) */}
          {boxUnfoldProgress > 0.05 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 30,
              }}
            >
              {/* === 四向水平延伸线 === */}
              {/* 左上水平向左延伸 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: -currentExtLengthH,
                  width: currentExtLengthH,
                  height: 1.5,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 右上水平向右延伸 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: -currentExtLengthH,
                  width: currentExtLengthH,
                  height: 1.5,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 左下水平向左延伸 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: -currentExtLengthH,
                  width: currentExtLengthH,
                  height: 1.5,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 右下水平向右延伸 */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -currentExtLengthH,
                  width: currentExtLengthH,
                  height: 1.5,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />

              {/* === 四向垂直延伸线 === */}
              {/* 左上垂直向上延伸 */}
              <div
                style={{
                  position: "absolute",
                  top: -currentExtLengthV,
                  left: 0,
                  width: 1.5,
                  height: currentExtLengthV,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 右上垂直向上延伸 */}
              <div
                style={{
                  position: "absolute",
                  top: -currentExtLengthV,
                  right: 0,
                  width: 1.5,
                  height: currentExtLengthV,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 左下垂直向下延伸 */}
              <div
                style={{
                  position: "absolute",
                  bottom: -currentExtLengthV,
                  left: 0,
                  width: 1.5,
                  height: currentExtLengthV,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />
              {/* 右下垂直向下延伸 */}
              <div
                style={{
                  position: "absolute",
                  bottom: -currentExtLengthV,
                  right: 0,
                  width: 1.5,
                  height: currentExtLengthV,
                  backgroundColor: "#7E92B3",
                  opacity: boxContentOpacity * 0.75,
                }}
              />

              {/* 四个顶角锚点方块 */}
              <div
                style={{
                  position: "absolute",
                  top: -9,
                  left: -9,
                  width: 18,
                  height: 18,
                  backgroundColor: "#2B3545",
                  border: "1.5px solid #8FA0BE",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  transform: `scale(${handleScale})`,
                  opacity: boxContentOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -9,
                  right: -9,
                  width: 18,
                  height: 18,
                  backgroundColor: "#2B3545",
                  border: "1.5px solid #8FA0BE",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  transform: `scale(${handleScale})`,
                  opacity: boxContentOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -9,
                  left: -9,
                  width: 18,
                  height: 18,
                  backgroundColor: "#2B3545",
                  border: "1.5px solid #8FA0BE",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  transform: `scale(${handleScale})`,
                  opacity: boxContentOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -9,
                  right: -9,
                  width: 18,
                  height: 18,
                  backgroundColor: "#2B3545",
                  border: "1.5px solid #8FA0BE",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  transform: `scale(${handleScale})`,
                  opacity: boxContentOpacity,
                }}
              />
            </div>
          )}

          {/* 核心框体内部：半透明磨砂毛玻璃 + 锁定在框内的网格十字系统 */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              backgroundColor: `rgba(10, 15, 26, ${boxBgOpacity})`,
              backdropFilter: "blur(16px)",
              border: "1.5px solid #7E92B3",
              boxShadow:
                "0 20px 45px rgba(0, 0, 0, 0.75), inset 0 0 25px rgba(0, 0, 0, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden", // 遮罩锁定：网格和文字仅在框内呈现！
              zIndex: 10,
            }}
          >
            {/* === 锁定在框内的科技网格系统 (Grid only INSIDE the box) === */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: boxContentOpacity * 0.9,
                pointerEvents: "none",
              }}
            >
              {/* 框内正交工程网格 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(to right, rgba(140, 175, 225, 0.14) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(140, 175, 225, 0.14) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />
              {/* 框内十字准心标尺阵列 */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.45,
                }}
              >
                <defs>
                  <pattern id="innerCrosshairs" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M 60 54 L 60 66 M 54 60 L 66 60" stroke="#8EA6C8" strokeWidth="1.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#innerCrosshairs)" />
              </svg>
            </div>

            {/* === 核心文字逐字掉落群 (带物理速度模糊与触底微弹) === */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 30px",
                zIndex: 2,
                opacity: boxContentOpacity,
              }}
            >
              {chars.map((char, index) => {
                const { translateY, motionBlurY, opacity } = computeCharMotion(index);

                return (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      fontFamily: "'Alibaba PuHuiTi', sans-serif",
                      fontWeight: 900,
                      fontSize,
                      lineHeight: 1,
                      letterSpacing: "0.04em",
                      color: "#D0D9E6",
                      WebkitTextStroke: "1.6px #FFFFFF",
                      textShadow: "0 4px 18px rgba(0, 0, 0, 0.95)",
                      transform: `translateY(${translateY}px)`,
                      opacity,
                      // 关键：垂直下落极速期物理运动模糊，落地停止时瞬间恢复 0px 极度锐利！
                      filter: motionBlurY > 0 ? `blur(0px, ${motionBlurY}px)` : "none",
                      willChange: "transform, opacity, filter",
                      userSelect: "none",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
