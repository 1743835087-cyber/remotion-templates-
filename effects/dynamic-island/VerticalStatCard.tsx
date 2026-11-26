import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import { BottomNeonRim, TechBackdrop } from "./index";

export const VERTICAL_ISLAND_FPS = 60;
export const VERTICAL_ISLAND_DURATION = 300; // 5.0s @ 60fps

export interface VerticalStatIslandProps {
  /** 左侧前缀文案，例如 "实测" */
  topLabel: string;
  /** 核心放大数字，例如 108 */
  targetNumber: number;
  /** 数字右侧小单位，例如 "台" */
  unitLabel: string;
  /** 右侧主词粗体部分，例如 "随身" */
  bottomBold: string;
  /** 右侧主词发光细体部分，例如 "WiFi" */
  bottomLight: string;
  /** 霓虹流光主色 */
  accentColor: string;
  /** 是否透明背景（用于叠在口播画面上） */
  transparentBackground: boolean;
  /** 可选纯色抠像背景（例如 "#00FF00" 绿幕模式，自动优化外阴影避免抠像发灰） */
  chromaKeyBg?: string;
  /** 末尾是否弹性收拢 */
  collapseAtEnd: boolean;
}

export const defaultWifi108Props: VerticalStatIslandProps = {
  topLabel: "实测",
  targetNumber: 108,
  unitLabel: "台",
  bottomBold: "随身",
  bottomLight: "WiFi",
  accentColor: "#58b4ff",
  transparentBackground: false,
  collapseAtEnd: true,
};

/**
 * 横向修长型灵动岛口播数据卡 (1080 x 280 长方形横条)
 * 适合直接叠放在口播画面下方/中下方作为核心数据高亮卡片
 */
export const VerticalStatIsland: React.FC<VerticalStatIslandProps> = ({
  topLabel,
  targetNumber,
  unitLabel,
  bottomBold,
  bottomLight,
  accentColor,
  transparentBackground,
  chromaKeyBg,
  collapseAtEnd,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: compW, height: compH } = useVideoConfig();

  useEffect(() => {
    void ensureFontsLoaded();
  }, []);

  // =========================================================================
  // 1. 横向修长长方形灵动岛弹簧形变 (1120 x 276, 宽高比约 4.05 : 1)
  // =========================================================================
  const PILL_W = 210;
  const PILL_H = 62;
  const CARD_W = 1120;
  const CARD_H = 276;

  const pillAppear = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.7 },
  });

  const beamProgress = interpolate(frame, [2, 28], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 横向长条：宽度率先利落向两侧拉开，高度紧随撑起，果味儿弹性拉满
  const expandW = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 14, stiffness: 118, mass: 0.88 },
  });
  const expandH = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 15, stiffness: 112, mass: 0.92 },
  });

  const collapseProgress = collapseAtEnd
    ? spring({
        frame: Math.max(0, frame - 246),
        fps,
        config: { damping: 16, stiffness: 135, mass: 0.85 },
      })
    : 0;

  const morphW = Math.max(0, expandW - collapseProgress);
  const morphH = Math.max(0, expandH - collapseProgress);

  const currentW = interpolate(morphW, [0, 1], [PILL_W, CARD_W]);
  const currentH = interpolate(morphH, [0, 1], [PILL_H, CARD_H]);
  const currentRadius = interpolate(
    Math.min(morphW, morphH),
    [0, 1],
    [PILL_H / 2, 64],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const pillExitScale = collapseAtEnd
    ? interpolate(frame, [282, 298], [1, 0.86], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const pillExitOpacity = collapseAtEnd
    ? interpolate(frame, [284, 298], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const islandScale = interpolate(pillAppear, [0, 1], [0.65, 1]) * pillExitScale;
  const islandOpacity =
    interpolate(frame, [4, 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * pillExitOpacity;

  const floatY = Math.sin((frame / fps) * Math.PI * 0.9) * 2.5 * morphH;

  // =========================================================================
  // 2. 底部电光冰蓝流光控制
  // =========================================================================
  const rimSweepIn = interpolate(frame, [30, 72], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rimFadeOut = collapseAtEnd
    ? interpolate(frame, [234, 254], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const glowBreath = 0.5 + 0.5 * Math.sin(((frame - 70) / fps) * Math.PI * 1.15);
  const rimIntensity =
    interpolate(frame, [30, 54], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (0.88 + glowBreath * 0.12) *
    rimFadeOut;

  const shimmerX = 50 + Math.sin(((frame - 60) / fps) * 1.45) * 34;

  // =========================================================================
  // 3. 横排内容错峰高斯模糊显影 + 108 计数冲刺定格
  // =========================================================================
  const contentExit = collapseAtEnd
    ? interpolate(frame, [232, 248], [1, 0], {
        easing: Easing.in(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const contentExitBlur = collapseAtEnd
    ? interpolate(frame, [232, 248], [0, 14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // (a) 左侧 "实测"
  const leftIn = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 18, stiffness: 135, mass: 0.8 },
  });
  const leftOpacity =
    interpolate(frame, [42, 58], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const leftBlur =
    interpolate(frame, [42, 60], [14, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const leftX = interpolate(leftIn, [0, 1], [-18, 0]);

  // (b) 中央超巨型突出数字 "108"
  const numIn = spring({
    frame: Math.max(0, frame - 48),
    fps,
    config: { damping: 13, stiffness: 135, mass: 0.88 },
  });
  const numOpacity =
    interpolate(frame, [48, 62], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const numBlur =
    interpolate(frame, [48, 66], [18, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;

  const countProgress = interpolate(frame, [48, 90], [0, 1], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayNumber = Math.round(targetNumber * countProgress);

  const numLandingPulse = interpolate(frame, [86, 92, 108], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numScale =
    interpolate(numIn, [0, 1], [0.76, 1]) * (1 + numLandingPulse * 0.05);

  const unitOpacity =
    interpolate(frame, [60, 76], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;

  // (c) 右侧 "随身 WiFi"
  const rightIn = spring({
    frame: Math.max(0, frame - 56),
    fps,
    config: { damping: 17, stiffness: 128, mass: 0.84 },
  });
  const rightOpacity =
    interpolate(frame, [56, 72], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const rightBlur =
    interpolate(frame, [56, 74], [14, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const rightX = interpolate(rightIn, [0, 1], [20, 0]);

  const wifiGlowPower = interpolate(frame, [66, 90], [0.2, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardLeftX = (compW - CARD_W) / 2;
  const cardTopY = (compH - CARD_H) / 2;

  const isChromaKey = Boolean(chromaKeyBg);
  const rootBg = chromaKeyBg
    ? chromaKeyBg
    : transparentBackground
      ? "transparent"
      : "#0a0c10";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: rootBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '"SF Pro Display", "Alibaba PuHuiTi", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {!transparentBackground && !isChromaKey && (
        <TechBackdrop
          frame={frame}
          accentColor={accentColor}
          cardLeftX={cardLeftX}
          cardTopY={cardTopY - 12}
          beamProgress={beamProgress}
          glowBreath={glowBreath}
        />
      )}

      {/* 横向修长长方形灵动岛主体 */}
      <div
        style={{
          position: "relative",
          width: currentW,
          height: currentH,
          borderRadius: currentRadius,
          transform: `translateY(${floatY}px) scale(${islandScale})`,
          opacity: islandOpacity,
          // 绿幕模式下关闭大面积半透明黑影，防止超级键抠像边缘发灰发脏
          boxShadow: isChromaKey
            ? `0 12px 36px rgba(56, 138, 255, ${0.24 * rimIntensity})`
            : `
                0 24px 72px rgba(0, 0, 0, 0.78),
                0 18px 54px rgba(56, 138, 255, ${0.32 * rimIntensity})
              `,
        }}
      >
        {/* 卡片内部 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: currentRadius,
            backgroundColor: "#020306",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* 底部向上漫射的电光蓝内发光 */}
          <div
            style={{
              position: "absolute",
              left: "-10%",
              right: "-10%",
              bottom: -24,
              height: "68%",
              opacity: rimIntensity,
              background: `
                radial-gradient(ellipse 72% 82% at 50% 100%,
                  rgba(105, 185, 255, 0.48) 0%,
                  rgba(38, 108, 235, 0.3) 38%,
                  rgba(16, 48, 128, 0.14) 68%,
                  rgba(2, 3, 6, 0) 100%
                )
              `,
              pointerEvents: "none",
            }}
          />

          {/* 顶部右侧极轻微环境反光 */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -50,
              width: 320,
              height: 200,
              opacity: 0.2 * morphH,
              background:
                "radial-gradient(circle at 70% 30%, rgba(160, 200, 255, 0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* 固定内部横排参照系，垂直居中且防止形变时换行抖动 */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: CARD_W,
              height: CARD_H,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
            {/* 左侧：实测 */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 500,
                color: "rgba(236, 244, 255, 0.92)",
                letterSpacing: "0.14em",
                marginRight: 30,
                opacity: leftOpacity,
                filter: `blur(${leftBlur.toFixed(2)}px)`,
                transform: `translateX(${leftX}px)`,
              }}
            >
              {topLabel}
            </div>

            {/* 中央核心突出：超大 108 + 台 */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginRight: 30,
                opacity: numOpacity,
                filter: `blur(${numBlur.toFixed(2)}px)`,
                transform: `scale(${numScale})`,
                transformOrigin: "center bottom",
              }}
            >
              <span
                style={{
                  fontSize: 162,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                  textShadow: `
                    0 0 ${24 + numLandingPulse * 28}px rgba(135, 205, 255, ${0.46 + numLandingPulse * 0.45}),
                    0 0 ${58 + numLandingPulse * 42}px rgba(68, 150, 255, ${0.26 + numLandingPulse * 0.35})
                  `,
                }}
              >
                {displayNumber}
              </span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 400,
                  color: "rgba(218, 234, 255, 0.88)",
                  marginLeft: 10,
                  opacity: unitOpacity,
                  textShadow: "0 0 14px rgba(145, 205, 255, 0.45)",
                }}
              >
                {unitLabel}
              </span>
            </div>

            {/* 右侧：随身 WiFi（粗细发光反差） */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                opacity: rightOpacity,
                filter: `blur(${rightBlur.toFixed(2)}px)`,
                transform: `translateX(${rightX}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 60,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.06em",
                }}
              >
                {bottomBold}
              </span>
              <span
                style={{
                  fontFamily:
                    '"Segoe UI Light", "Helvetica Neue", "PingFang SC", "Alibaba PuHuiTi", sans-serif',
                  fontSize: 66,
                  fontWeight: 200,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  textShadow: `
                    0 0 ${16 * wifiGlowPower}px rgba(255, 255, 255, ${0.9 * wifiGlowPower}),
                    0 0 ${36 * wifiGlowPower}px rgba(195, 228, 255, ${0.62 * wifiGlowPower}),
                    0 0 ${64 * wifiGlowPower}px rgba(120, 182, 255, ${0.38 * wifiGlowPower})
                  `,
                }}
              >
                {bottomLight}
              </span>
            </div>
            </div>
          </div>
        </div>

        {/* SVG 底部冰蓝霓虹流光边框 */}
        <BottomNeonRim
          width={currentW}
          height={currentH}
          radius={currentRadius}
          intensity={rimIntensity}
          sweep={rimSweepIn}
          shimmerX={shimmerX}
          accentColor={accentColor}
        />
      </div>
    </AbsoluteFill>
  );
};
