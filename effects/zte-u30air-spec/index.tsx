import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

export const ZTE_U30AIR_SPEC_DURATION = 240; // 8.0s @ 30fps

// ========================================================
// 1. TEMPLATE DATA MODEL (可复用模板数据配置)
// ========================================================

export interface TariffRowItem {
  badgeTitle: string;
  badgeSub: string;
  singleNet: [string, string, string];
  dualNet: [string, string, string];
  unitPriceSingle?: string;
  unitPriceDual?: string;
}

export interface SpecRowItem {
  icon: "network" | "wifi" | "speed" | "battery" | "link" | "weight";
  label: string;
  value: string;
  subValue?: string;
  highlightPill?: boolean;
}

export interface ZteU30AirTemplateProps {
  brandCn: string;
  modelEn: string;
  productImage: string;
  priceCurrency: string;
  priceMain: number;
  priceDecimal: string;
  priceNote: string;
  tariffRibbon: string;
  tariffTitle: string;
  tariffSubtitle: string;
  tariffTableTitle: string;
  tariffRows: TariffRowItem[];
  tariffBottomCaption: string;
  specs: SpecRowItem[];
  chipSectionLabel: string;
  chipBrand: string;
  chipModel: string;
  subtitleText?: string;
  enableExitAnimation?: boolean;
}

export const defaultZteU30AirProps: ZteU30AirTemplateProps = {
  brandCn: "中兴",
  modelEn: "U30air",
  productImage: "zte_u30air_photo.png",
  priceCurrency: "¥",
  priceMain: 469,
  priceDecimal: ".00",
  priceNote: "(*官方售价)",
  tariffRibbon: "购买即送3天 10GB 体验流量",
  tariffTitle: "中兴官方流量",
  tariffSubtitle: "安全可靠  不虚标  不限速",
  tariffTableTitle: "5G流量套餐",
  tariffRows: [
    {
      badgeTitle: "尊享套餐",
      badgeSub: "月享\n1500G",
      singleNet: ["¥79", "¥399", "¥599"],
      dualNet: ["¥99", "¥499", "¥699"],
      unitPriceSingle: "0.033元/G",
      unitPriceDual: "0.038元/G",
    },
    {
      badgeTitle: "畅享套餐",
      badgeSub: "月享200G",
      singleNet: ["¥59", "¥299", "¥499"],
      dualNet: ["¥79", "¥399", "¥599"],
      unitPriceSingle: "0.2元/G",
      unitPriceDual: "0.25元/G",
    },
    {
      badgeTitle: "乐享套餐",
      badgeSub: "月享100G",
      singleNet: ["¥39", "", ""],
      dualNet: ["¥59", "", ""],
    },
  ],
  tariffBottomCaption: "-套餐资费详情-",
  specs: [
    {
      icon: "network",
      label: "网络类型：",
      value: "LTE-5G",
      subValue: "（移动/电信双网通）",
      highlightPill: true,
    },
    {
      icon: "wifi",
      label: "WIFI频段：",
      value: "WIFI6-2.4/5GHz",
      highlightPill: true,
    },
    {
      icon: "speed",
      label: "网速峰值：",
      value: "500Mbps",
    },
    {
      icon: "battery",
      label: "电池容量：",
      value: "4500mAh",
    },
    {
      icon: "link",
      label: "最大链接数：",
      value: "16台（7天线）",
    },
    {
      icon: "weight",
      label: "机身重量：",
      value: "132g",
    },
  ],
  chipSectionLabel: "型号技术：",
  chipBrand: "紫光展锐",
  chipModel: "T760",
  subtitleText: "",
  enableExitAnimation: false,
};

// ========================================================
// 2. 4K SILKY MOTION ENGINE (零位图模糊 · 4K 矢量锐利弹簧系统)
// ========================================================

interface SilkyMotionOptions {
  frame: number;
  fps: number;
  inFrame: number;
  outFrame?: number;
  enableExit?: boolean;
  offsetX?: number;
  offsetY?: number;
  startScale?: number;
  startBlur?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

const useSilkyMotion = ({
  frame,
  fps,
  inFrame,
  outFrame = 212,
  enableExit = false,
  offsetX = 0,
  offsetY = 36,
  startScale = 0.94,
  startBlur = 10,
  damping = 21,
  stiffness = 112,
  mass = 0.88,
}: SilkyMotionOptions) => {
  if (frame < inFrame) {
    return {
      opacity: 0,
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${startScale})`,
      filter: startBlur > 0 ? `blur(${startBlur}px)` : "none",
      progress: 0,
    };
  }

  if (enableExit && frame >= outFrame) {
    const exitP = interpolate(frame, [outFrame, outFrame + 22], [0, 1], {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const x = exitP * (offsetX * -0.4);
    const y = exitP * -28;
    const scale = 1 - exitP * 0.04;
    const blur = exitP * 8;
    const opacity = Math.max(0, 1 - exitP);
    return {
      opacity,
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
      filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "none",
      progress: 1 - exitP,
    };
  }

  const p = spring({
    frame: frame - inFrame,
    fps,
    config: { damping, stiffness, mass },
  });

  // 入场稳定后完全解除 transform 与 filter，确保 Chromium 以原生 4K 矢量精度光栅化文字与边框
  if (p > 0.997) {
    return {
      opacity: 1,
      transform: "none",
      filter: "none",
      progress: 1,
    };
  }

  const x = (1 - p) * offsetX;
  const y = (1 - p) * offsetY;
  const scale = startScale + p * (1 - startScale);
  const blur = Math.max(0, (1 - Math.min(1, p * 1.25)) * startBlur);
  const opacity = Math.min(1, p * 1.35);

  return {
    opacity,
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
    filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : "none",
    progress: p,
  };
};

/**
 * 丝滑遮罩文字行组件（自下而上带景深消散与弹簧阻尼升起，静止后100%原生4K锐利渲染）
 */
const SilkyTextReveal: React.FC<{
  text: string;
  frame: number;
  fps: number;
  inFrame: number;
  enableExit?: boolean;
  stagger?: number;
  offsetY?: number;
  style?: React.CSSProperties;
  charStyle?: React.CSSProperties;
}> = ({
  text,
  frame,
  fps,
  inFrame,
  enableExit = false,
  stagger = 1.6,
  offsetY = 26,
  style,
  charStyle,
}) => {
  const chars = Array.from(text);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        overflow: "hidden",
        verticalAlign: "bottom",
        padding: "2px 2px 4px 1px",
        ...style,
      }}
    >
      {chars.map((ch, i) => {
        const motion = useSilkyMotion({
          frame,
          fps,
          inFrame: inFrame + i * stagger,
          enableExit,
          offsetY,
          startScale: 0.94,
          startBlur: 6,
          damping: 20,
          stiffness: 130,
          mass: 0.8,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              ...charStyle,
              ...motion,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

// ========================================================
// 3. DECORATIVE & HARDWARE VECTOR COMPONENTS
// ========================================================

/**
 * 四角星芒高光粒子组件 (用于价格卡片光效点缀)
 */
const StarSparkle: React.FC<{
  frame: number;
  size: number;
  color?: string;
  phaseOffset?: number;
  style?: React.CSSProperties;
}> = ({ frame, size, color = "#ffffff", phaseOffset = 0, style }) => {
  const pulse = (Math.sin((frame + phaseOffset) / 9) + 1) * 0.5;
  const scale = 0.55 + pulse * 0.65;
  const opacity = 0.35 + pulse * 0.65;
  const rot = ((frame + phaseOffset) * 1.2) % 360;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{
        position: "absolute",
        pointerEvents: "none",
        opacity,
        transform: `scale(${scale.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`,
        filter: `drop-shadow(0 0 8px ${color})`,
        ...style,
      }}
    >
      <path
        d="M16 0C16.8 9.8 22.2 15.2 32 16C22.2 16.8 16.8 22.2 16 32C15.2 22.2 9.8 16.8 0 16C9.8 15.2 15.2 9.8 16 0Z"
        fill={color}
      />
      <circle cx="16" cy="16" r="3.5" fill="#ffffff" />
    </svg>
  );
};

/**
 * 顶部左/底部右 科技感矩阵点阵装饰
 */
const DotMatrixGrid: React.FC<{
  frame: number;
  rows?: number;
  cols?: number;
  position: "top-left" | "bottom-right";
}> = ({ frame, rows = 3, cols = 19, position }) => {
  const enterOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isTopLeft = position === "top-left";

  return (
    <div
      style={{
        position: "absolute",
        ...(isTopLeft ? { left: 0, top: 8 } : { right: 0, bottom: 8 }),
        display: "flex",
        flexDirection: "column",
        gap: 15,
        opacity: enterOpacity,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          style={{
            display: "flex",
            gap: 24,
            paddingLeft: isTopLeft ? (r === 1 ? 26 : 0) : r === 1 ? 0 : 24,
          }}
        >
          {Array.from({ length: cols }).map((__, c) => {
            const delayFrame = c * 0.8 + r * 2;
            const dotAppear = interpolate(frame - delayFrame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const wave = Math.sin(frame / 18 + c * 0.35 + r * 0.7) * 0.12 + 0.88;
            const dotFade = isTopLeft
              ? interpolate(c, [0, cols - 1], [0.55, 0.22])
              : interpolate(c, [0, cols - 1], [0.22, 0.55]);
            return (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  transform:
                    dotAppear < 0.99 ? `scale(${0.5 + dotAppear * 0.5})` : "none",
                  backgroundColor: `rgba(210, 214, 224, ${(dotFade * wave * dotAppear).toFixed(3)})`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * 左上角悬浮双机小模型 (还原青绿云母纹理 + 黑色NFC圆环 + 5G角标)
 */
const MiniZteDevice: React.FC<{
  width: number;
  height: number;
  rotate: number;
  style?: React.CSSProperties;
}> = ({ width, height, rotate, style }) => {
  const ringSize = width * 0.76;
  const innerCircleSize = ringSize * 0.68;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        transform: `rotate(${rotate}deg)`,
        background:
          "linear-gradient(145deg, #a8beb9 0%, #6d8c86 28%, #4d6b66 62%, #39524e 100%)",
        border: "2px solid rgba(226, 240, 236, 0.78)",
        boxShadow:
          "-4px 6px 0 rgba(52, 70, 67, 0.9), -8px 16px 28px rgba(0, 0, 0, 0.65), inset 0 1px 3px rgba(255,255,255,0.65)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* 斜向云母拉丝纹理 */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          background:
            "repeating-linear-gradient(125deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 3px, transparent 3px, transparent 9px, rgba(0,0,0,0.07) 9px, rgba(0,0,0,0.07) 13px)",
          pointerEvents: "none",
        }}
      />
      {/* 左上角 5G 橙红圆标 */}
      <div
        style={{
          position: "absolute",
          left: width * 0.08,
          top: width * 0.08,
          width: width * 0.14,
          height: width * 0.14,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ea580c, #dc2626)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: width * 0.065,
          fontWeight: 900,
          color: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        5G
      </div>

      {/* 黑色圆环 */}
      <div
        style={{
          position: "absolute",
          top: height * 0.09,
          left: "50%",
          transform: "translateX(-50%)",
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #26292e, #090b0e 75%)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 内部青绿圆盘 */}
        <div
          style={{
            width: innerCircleSize,
            height: innerCircleSize,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #8ca8a2 0%, #5c7a74 58%, #47615c 100%)",
            border: "1.5px solid rgba(200, 220, 215, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1e2927",
            fontWeight: 900,
            fontSize: width * 0.11,
            letterSpacing: -0.5,
          }}
        >
          N
        </div>
      </div>

      {/* 底部 ZTE 标识 */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.12,
          width: "100%",
          textAlign: "center",
          fontSize: width * 0.11,
          fontWeight: 800,
          color: "rgba(30, 42, 40, 0.78)",
          letterSpacing: 1.5,
        }}
      >
        ZTE
      </div>
    </div>
  );
};

/**
 * 右侧规格图标组件
 */
const SpecIcon: React.FC<{ type: SpecRowItem["icon"] }> = ({ type }) => {
  const color = "#56a8f5";
  switch (type) {
    case "network":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <circle cx="19" cy="19" r="14" stroke={color} strokeWidth="2.2" />
          <ellipse cx="19" cy="19" rx="7" ry="14" stroke={color} strokeWidth="2" />
          <line x1="5.5" y1="14.5" x2="32.5" y2="14.5" stroke={color} strokeWidth="2" />
          <line x1="5.5" y1="23.5" x2="32.5" y2="23.5" stroke={color} strokeWidth="2" />
        </svg>
      );
    case "wifi":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path
            d="M5 14.5C12.8 7.5 25.2 7.5 33 14.5"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M9.8 20C15 15.3 23 15.3 28.2 20"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M14.5 25.5C17.1 23.2 20.9 23.2 23.5 25.5"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="19" cy="30" r="2.4" fill={color} />
        </svg>
      );
    case "speed":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <rect
            x="5"
            y="7"
            width="22"
            height="16"
            rx="2.5"
            stroke={color}
            strokeWidth="2.4"
          />
          <line x1="12" y1="28" x2="20" y2="28" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="16" y1="23" x2="16" y2="28" stroke={color} strokeWidth="2.4" />
          <rect
            x="24"
            y="14"
            width="9"
            height="16"
            rx="2"
            fill="#1f232d"
            stroke={color}
            strokeWidth="2.2"
          />
          <circle cx="28.5" cy="26.5" r="1.2" fill={color} />
        </svg>
      );
    case "battery":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path
            d="M15.5 5H22.5"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <rect
            x="11"
            y="8.5"
            width="16"
            height="24"
            rx="3.2"
            stroke={color}
            strokeWidth="2.5"
          />
          <line x1="15" y1="15" x2="23" y2="15" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="15" y1="20.5" x2="23" y2="20.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="15" y1="26" x2="23" y2="26" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "link":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path
            d="M16 22L22 16"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M14.5 18.5L11.2 21.8C8.9 24.1 8.9 27.8 11.2 30.1C13.5 32.4 17.2 32.4 19.5 30.1L22.8 26.8"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M23.5 19.5L26.8 16.2C29.1 13.9 29.1 10.2 26.8 7.9C24.5 5.6 20.8 5.6 18.5 7.9L15.2 11.2"
            stroke={color}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "weight":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <circle
            cx="19"
            cy="19"
            r="13.5"
            fill="rgba(86, 168, 245, 0.18)"
            stroke={color}
            strokeWidth="2.5"
          />
          <path
            d="M12.5 17C14.8 12.8 23.2 12.8 25.5 17L22.5 21.5C20.5 19.2 17.5 19.2 15.5 21.5L12.5 17Z"
            fill="#1f232d"
            stroke={color}
            strokeWidth="1.8"
          />
          <line
            x1="19"
            y1="20"
            x2="21.5"
            y2="15"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

/**
 * 紫光展锐 T760 双层芯片高精度矢量渲染组件
 */
const UnisocChipGraphic: React.FC<{
  frame: number;
  fps: number;
  inFrame: number;
}> = ({ frame, fps, inFrame }) => {
  const backMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: inFrame + 6,
    offsetX: -18,
    offsetY: 22,
    startScale: 0.88,
    damping: 18,
    stiffness: 110,
  });

  const frontMotion = useSilkyMotion({
    frame,
    fps,
    inFrame,
    offsetX: -28,
    offsetY: 28,
    startScale: 0.86,
    damping: 17,
    stiffness: 115,
  });

  const sheenX = interpolate(frame, [inFrame + 12, inFrame + 68], [-120, 160], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width: 255, height: 225 }}>
      {/* 后层：BGA 金属针脚阵列基板 */}
      <div
        style={{
          position: "absolute",
          right: 6,
          top: 2,
          width: 192,
          height: 192,
          borderRadius: 4,
          background: "#26282e",
          border: "2px solid #8a8f99",
          boxShadow: "0 12px 28px rgba(0,0,0,0.65)",
          padding: 7,
          boxSizing: "border-box",
          ...backMotion,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, rgba(220,225,235,0.72) 1.3px, transparent 1.4px)",
            backgroundSize: "6px 6px",
            opacity: 0.85,
          }}
        />
      </div>

      {/* 前层：紫光展锐 5G 核心封装芯片 */}
      <div
        style={{
          position: "absolute",
          left: 8,
          bottom: 4,
          width: 198,
          height: 198,
          borderRadius: 6,
          padding: 4,
          boxSizing: "border-box",
          background:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 48%, #38bdf8 100%)",
          boxShadow:
            "0 14px 32px rgba(0, 0, 0, 0.78), 0 0 22px rgba(99, 102, 241, 0.38)",
          overflow: "hidden",
          ...frontMotion,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 3,
            background:
              "radial-gradient(circle at 30% 25%, #232c47 0%, #141929 65%, #0d111d 100%)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 四周双排金属触点矩阵 */}
          <svg
            width="190"
            height="190"
            viewBox="0 0 190 190"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {Array.from({ length: 17 }).map((_, i) => {
              const pos = 15 + i * 10;
              return (
                <React.Fragment key={i}>
                  {/* Top */}
                  <circle cx={pos} cy={9} r={1.7} fill="#60a5fa" opacity={0.85} />
                  <circle cx={pos + 4} cy={16} r={1.5} fill="#c084fc" opacity={0.75} />
                  {/* Bottom */}
                  <circle cx={pos} cy={181} r={1.7} fill="#60a5fa" opacity={0.85} />
                  <circle cx={pos + 4} cy={174} r={1.5} fill="#c084fc" opacity={0.75} />
                  {/* Left */}
                  <circle cx={9} cy={pos} r={1.7} fill="#818cf8" opacity={0.85} />
                  <circle cx={16} cy={pos + 4} r={1.5} fill="#60a5fa" opacity={0.75} />
                  {/* Right */}
                  <circle cx={181} cy={pos} r={1.7} fill="#38bdf8" opacity={0.85} />
                  <circle cx={174} cy={pos + 4} r={1.5} fill="#818cf8" opacity={0.75} />
                </React.Fragment>
              );
            })}
          </svg>

          {/* 右上角 5G 标识 */}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 14,
              fontSize: 22,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#ffffff",
              letterSpacing: -0.5,
              textShadow: "0 2px 8px rgba(56, 189, 248, 0.7)",
            }}
          >
            5G
          </div>

          {/* 中心 UNISOC 紫光展锐 Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: "2.2px solid #ffffff",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 15,
                color: "#ffffff",
              }}
            >
              ₪
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: 1,
                  lineHeight: 1.05,
                }}
              >
                紫光展锐
              </span>
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: 3.5,
                  marginTop: 2,
                }}
              >
                UNISOC
              </span>
            </div>
          </div>

          {/* 芯片镜面扫光 */}
          <div
            style={{
              position: "absolute",
              inset: -30,
              background:
                "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.32) 50%, transparent 65%)",
              transform: `translateX(${sheenX}%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ========================================================
// 4. MAIN TEMPLATE COMPONENT (ZteU30AirSpecBoard - 4K Native)
// ========================================================

export const ZteU30AirSpecBoard: React.FC<Partial<ZteU30AirTemplateProps>> = (
  incomingProps
) => {
  const props: ZteU30AirTemplateProps = {
    ...defaultZteU30AirProps,
    ...incomingProps,
  };

  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const zoomFactor = width / 1920; // 3840 -> zoom: 2 (Chromium 原生4K矢量光栅化)

  const [fontHandle] = useState(() =>
    delayRender("Loading Alibaba PuHuiTi fonts for ZTE U30 Air 4K Template")
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(fontHandle))
      .catch(() => continueRender(fontHandle));
  }, [fontHandle]);

  // --- 各区块交错入场编排 ---
  const miniDeviceLeftMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 6,
    enableExit: props.enableExitAnimation,
    offsetX: -25,
    offsetY: 28,
    startScale: 0.85,
  });

  const miniDeviceRightMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 10,
    enableExit: props.enableExitAnimation,
    offsetX: -18,
    offsetY: 32,
    startScale: 0.85,
  });

  const photoCardMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 12,
    enableExit: props.enableExitAnimation,
    offsetY: 48,
    startScale: 0.93,
    damping: 19,
    stiffness: 105,
  });

  const priceCardMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 18,
    enableExit: props.enableExitAnimation,
    offsetY: 40,
    startScale: 0.92,
    damping: 18,
    stiffness: 115,
  });

  const tariffCardMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 24,
    enableExit: props.enableExitAnimation,
    offsetY: 48,
    startScale: 0.94,
    damping: 19,
    stiffness: 108,
  });

  const rightSpecCardMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 20,
    enableExit: props.enableExitAnimation,
    offsetX: 42,
    offsetY: 24,
    startScale: 0.95,
    damping: 20,
    stiffness: 105,
  });

  const chipSubCardMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 56,
    enableExit: props.enableExitAnimation,
    offsetY: 34,
    startScale: 0.94,
    damping: 19,
    stiffness: 112,
  });

  const subtitleMotion = useSilkyMotion({
    frame,
    fps,
    inFrame: 64,
    enableExit: props.enableExitAnimation,
    offsetY: 24,
    startScale: 0.95,
  });

  // 价格滚动递增动画
  const priceCountProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 24, stiffness: 90, mass: 0.9 },
  });
  const animatedPrice = Math.round(
    interpolate(priceCountProgress, [0, 1], [320, props.priceMain])
  );

  // 价格卡片专属光效参数：
  // 1) 流光旋转角度
  const borderLaserAngle = (frame * 3.2) % 360;
  // 2) 呼吸氛围辉光强度
  const priceGlowPulse = (Math.sin(frame / 11) + 1) * 0.5;
  // 3) 周期性高光扫掠（入场第26~76帧扫过一次，随后第115~165帧再扫过一次）
  const priceSweep1 = interpolate(frame, [26, 76], [-110, 155], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const priceSweep2 = interpolate(frame, [115, 168], [-110, 155], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activePriceSweep = frame < 95 ? priceSweep1 : priceSweep2;

  // 悬浮微动
  const floatY1 = Math.sin(frame / 28) * 3.5;
  const floatY2 = Math.cos(frame / 32) * 3.5;

  // 照片缓慢推镜感 (Ken Burns)
  const photoScale = interpolate(frame, [12, 85], [1.05, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 卡片流光扫掠
  const photoSheen = interpolate(frame, [18, 70], [-110, 150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightCardSheen = interpolate(frame, [30, 88], [-110, 150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brandChars = Array.from(props.brandCn);
  const modelChars = Array.from(props.modelEn);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#14161f",
        fontFamily: "'Alibaba PuHuiTi', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#ffffff",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* 4K 矢量无损缩放容器 */}
      <div
        style={{
          position: "relative",
          width: 1920,
          height: 1080,
          zoom: zoomFactor,
        }}
      >
        {/* ==================== 1. 背景层与几何流线曲面 ==================== */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 18% 18%, #282c3e 0%, #191c28 45%, #11131b 100%)",
          }}
        />

        {/* 背景抽象曲面波浪 */}
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          fill="none"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs>
            <linearGradient
              id="bgWave1"
              x1="0"
              y1="0"
              x2="1920"
              y2="1080"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#252838" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#161822" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="warmGlow" cx="0.12" cy="0.88" r="0.45">
              <stop offset="0%" stopColor="#5c4028" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#14161f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M0 0H1020C930 280 650 450 0 490V0Z" fill="url(#bgWave1)" />
          <path
            d="M1920 0H1360C1460 360 1690 620 1920 740V0Z"
            fill="rgba(10, 12, 18, 0.55)"
          />
          <rect width="1920" height="1080" fill="url(#warmGlow)" />
        </svg>

        {/* 左上与右下科技方格点阵 */}
        <DotMatrixGrid frame={frame} position="top-left" />
        <DotMatrixGrid frame={frame} position="bottom-right" />

        {/* ==================== 2. 左上角悬浮小设备 + 产品主标题 ==================== */}
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 52,
            width: 680,
            height: 240,
          }}
        >
          {/* 后方右侧微倾小设备 */}
          <div
            style={{
              position: "absolute",
              left: 88,
              top: 2,
              transform: `translateY(${floatY2.toFixed(2)}px)`,
            }}
          >
            <div style={miniDeviceRightMotion}>
              <MiniZteDevice width={92} height={178} rotate={-11} />
            </div>
          </div>

          {/* 前方左侧微倾小设备 */}
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 42,
              transform: `translateY(${floatY1.toFixed(2)}px)`,
            }}
          >
            <div style={miniDeviceLeftMotion}>
              <MiniZteDevice width={94} height={182} rotate={-13} />
            </div>
          </div>

          {/* 主标题：实心“中兴” + 镂空描边“U30air” */}
          <div
            style={{
              position: "absolute",
              left: 52,
              top: 86,
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            {/* 实心中文品牌词：遮罩逐字丝滑升起 */}
            <div
              style={{
                display: "flex",
                overflow: "hidden",
                padding: "8px 4px 12px 6px",
              }}
            >
              {brandChars.map((ch, idx) => {
                const charMotion = useSilkyMotion({
                  frame,
                  fps,
                  inFrame: 8 + idx * 3,
                  enableExit: props.enableExitAnimation,
                  offsetY: 68,
                  startScale: 0.9,
                  startBlur: 8,
                  damping: 18,
                  stiffness: 125,
                });
                return (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      fontSize: 102,
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1,
                      letterSpacing: 2,
                      textShadow:
                        "0 8px 24px rgba(0, 0, 0, 0.72), 0 2px 6px rgba(0,0,0,0.5)",
                      ...charMotion,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>

            {/* 镂空描边英文型号词：逐字符弹簧入场 */}
            <div
              style={{
                display: "flex",
                overflow: "hidden",
                padding: "8px 10px 12px 2px",
              }}
            >
              {modelChars.map((ch, idx) => {
                const charMotion = useSilkyMotion({
                  frame,
                  fps,
                  inFrame: 14 + idx * 2.2,
                  enableExit: props.enableExitAnimation,
                  offsetY: 64,
                  startScale: 0.92,
                  startBlur: 8,
                  damping: 18,
                  stiffness: 125,
                });
                return (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      fontSize: 112,
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: 1.5,
                      color: "rgba(25, 28, 40, 0.35)",
                      WebkitTextStroke: "3.5px #ffffff",
                      textShadow: "0 8px 20px rgba(0,0,0,0.65)",
                      ...charMotion,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== 3. 左侧硬件实拍大图卡片 ==================== */}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 298,
            width: 650,
            height: 646,
            borderRadius: 28,
            padding: 4,
            boxSizing: "border-box",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(180,186,198,0.45) 50%, rgba(255,255,255,0.75) 100%)",
            boxShadow:
              "0 28px 60px rgba(0, 0, 0, 0.78), 0 0 24px rgba(255, 255, 255, 0.14)",
            ...photoCardMotion,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#1a1d24",
            }}
          >
            <Img
              src={staticFile(props.productImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform:
                  photoScale > 1.001 ? `scale(${photoScale.toFixed(4)})` : "none",
              }}
            />

            {/* 入场镜面高光扫掠 */}
            <div
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "linear-gradient(112deg, transparent 36%, rgba(255,255,255,0.32) 50%, transparent 64%)",
                transform: `translateX(${photoSheen}%)`,
                pointerEvents: "none",
              }}
            />

            {/* 内部微暗角立体边框 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                boxShadow: "inset 0 0 28px rgba(0,0,0,0.42)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ==================== 4. 中间栏上部：官方售价卡片 (升级炫彩流光特效) ==================== */}
        <div
          style={{
            position: "absolute",
            left: 730,
            top: 122,
            width: 432,
            height: 174,
            borderRadius: 24,
            padding: 2.5,
            boxSizing: "border-box",
            boxShadow: `0 22px 48px rgba(0, 0, 0, 0.75), 0 0 ${
              24 + priceGlowPulse * 18
            }px rgba(192, 68, 248, ${0.22 + priceGlowPulse * 0.18})`,
            overflow: "hidden",
            ...priceCardMotion,
          }}
        >
          {/* 动态流光旋转霓虹边框层 */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 560,
              height: 560,
              transform: `translate(-50%, -50%) rotate(${borderLaserAngle}deg)`,
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.18) 0deg, #ff2a5f 65deg, #fbbf24 115deg, rgba(255,255,255,0.2) 180deg, #a855f7 255deg, #38bdf8 310deg, rgba(255,255,255,0.18) 360deg)",
              pointerEvents: "none",
            }}
          />

          {/* 内部深紫金属质感背景层 */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 21.5,
              background:
                "linear-gradient(135deg, #171e30 0%, #241b38 50%, #3f1d4e 100%)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.35)",
            }}
          >
            {/* 左側猩红光晕 + 右侧紫金呼吸体积背光 */}
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 24,
                width: 145,
                height: 125,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255, 35, 65, 0.42) 0%, rgba(255, 35, 65, 0) 72%)",
                transform: `scale(${0.92 + priceGlowPulse * 0.18})`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 26,
                bottom: -18,
                width: 250,
                height: 150,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(192, 132, 252, 0.36) 0%, rgba(251, 191, 36, 0.12) 45%, transparent 72%)",
                transform: `scale(${0.9 + priceGlowPulse * 0.2})`,
                pointerEvents: "none",
              }}
            />

            {/* 底部聚光灯能量条 */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "15%",
                width: "70%",
                height: 3,
                background:
                  "linear-gradient(90deg, transparent 0%, #ff2a5f 28%, #fde047 50%, #c084fc 72%, transparent 100%)",
                boxShadow: "0 -2px 16px rgba(253, 224, 71, 0.65)",
                opacity: 0.75 + priceGlowPulse * 0.25,
                pointerEvents: "none",
              }}
            />

            {/* 右上角 (*官方售价) */}
            <div
              style={{
                position: "absolute",
                right: 22,
                top: 18,
                fontSize: 21,
                fontStyle: "italic",
                fontWeight: 500,
                color: "rgba(232, 226, 246, 0.85)",
                letterSpacing: 0.5,
              }}
            >
              <SilkyTextReveal
                text={props.priceNote}
                frame={frame}
                fps={fps}
                inFrame={24}
                enableExit={props.enableExitAnimation}
                stagger={1.2}
                offsetY={16}
              />
            </div>

            {/* 核心价格数字 + 立体辉光 + 星芒点缀 */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "baseline",
                marginTop: 18,
                gap: 6,
              }}
            >
              {/* 左上角红色/金色星芒闪烁 */}
              <StarSparkle
                frame={frame}
                size={24}
                color="#ff4d6d"
                phaseOffset={0}
                style={{ left: -14, top: 2 }}
              />
              {/* 数字右上角亮白金星芒闪烁 */}
              <StarSparkle
                frame={frame}
                size={28}
                color="#fef08a"
                phaseOffset={14}
                style={{ right: 72, top: -8 }}
              />
              {/* 小数点右下角微星芒 */}
              <StarSparkle
                frame={frame}
                size={18}
                color="#e879f9"
                phaseOffset={25}
                style={{ right: -12, bottom: 8 }}
              />

              <span
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: "#ff1e27",
                  lineHeight: 1,
                  textShadow:
                    "0 0 24px rgba(255, 30, 50, 0.75), 0 6px 18px rgba(0, 0, 0, 0.75)",
                  marginRight: 4,
                }}
              >
                {props.priceCurrency}
              </span>
              <span
                style={{
                  fontSize: 104,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: -2,
                  textShadow: `0 0 ${16 + priceGlowPulse * 12}px rgba(255, 240, 200, ${
                    0.28 + priceGlowPulse * 0.22
                  }), 0 8px 20px rgba(0, 0, 0, 0.8)`,
                }}
              >
                {animatedPrice}
              </span>
              <span
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: -1,
                  textShadow: `0 0 ${12 + priceGlowPulse * 10}px rgba(255, 240, 200, 0.3), 0 6px 16px rgba(0, 0, 0, 0.8)`,
                }}
              >
                {props.priceDecimal}
              </span>
            </div>

            {/* 价格卡双波段镜面刀锋扫光 */}
            <div
              style={{
                position: "absolute",
                inset: -30,
                background:
                  "linear-gradient(112deg, transparent 36%, rgba(255, 250, 220, 0.12) 45%, rgba(255, 255, 255, 0.42) 50%, rgba(232, 121, 249, 0.15) 55%, transparent 64%)",
                transform: `translateX(${activePriceSweep}%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ==================== 5. 中间栏下部：套餐资费详情卡 ==================== */}
        <div
          style={{
            position: "absolute",
            left: 730,
            top: 318,
            width: 432,
            height: 626,
            borderRadius: 24,
            background: "linear-gradient(180deg, #272a35 0%, #1d1f28 100%)",
            border: "2px solid rgba(185, 192, 208, 0.42)",
            boxShadow:
              "0 24px 52px rgba(0, 0, 0, 0.72), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
            padding: "20px 18px 14px 18px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            ...tariffCardMotion,
          }}
        >
          {/* 内部浅蓝白底官方资费卡 (纯矢量高精度还原 + 逐行丝滑入场) */}
          <div
            style={{
              width: "100%",
              height: 534,
              borderRadius: 10,
              background:
                "linear-gradient(180deg, #dcecf8 0%, #eef5fb 28%, #ffffff 100%)",
              position: "relative",
              overflow: "hidden",
              padding: "14px 14px 10px 14px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              color: "#1e293b",
            }}
          >
            {/* 左上角深蓝丝带标签 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                background: "linear-gradient(90deg, #0d3b66 0%, #1d5b94 100%)",
                color: "#ffffff",
                fontSize: 12.5,
                fontWeight: 700,
                padding: "4px 12px 4px 10px",
                borderTopRightRadius: 14,
                borderBottomRightRadius: 14,
                boxShadow: "0 3px 8px rgba(13, 59, 102, 0.28)",
              }}
            >
              {props.tariffRibbon}
            </div>

            {/* 标题区 */}
            <div style={{ textAlign: "center", marginTop: 26, marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#134074",
                  letterSpacing: 1,
                  lineHeight: 1.15,
                }}
              >
                <SilkyTextReveal
                  text={props.tariffTitle}
                  frame={frame}
                  fps={fps}
                  inFrame={28}
                  enableExit={props.enableExitAnimation}
                  stagger={1.8}
                  offsetY={22}
                />
              </div>
              <div
                style={{
                  fontSize: 16.5,
                  fontWeight: 500,
                  color: "#2b5984",
                  letterSpacing: 1.5,
                  marginTop: 4,
                }}
              >
                {props.tariffSubtitle}
              </div>
            </div>

            {/* 白色圆角表格容器 */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(19, 64, 116, 0.08)",
                padding: "10px 10px 8px 10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#134074",
                  marginBottom: 8,
                  letterSpacing: 1,
                }}
              >
                {props.tariffTableTitle}
              </div>

              {/* 表头 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "66px 38px 1fr 1fr 1fr",
                  backgroundColor: "#0d3b66",
                  color: "#ffffff",
                  borderRadius: 6,
                  height: 28,
                  alignItems: "center",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                <div />
                <div />
                <div>1个月</div>
                <div>6个月</div>
                <div>12个月</div>
              </div>

              {/* 3组套餐行：错落丝滑入场 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                {props.tariffRows.map((row, rIdx) => {
                  const rowMotion = useSilkyMotion({
                    frame,
                    fps,
                    inFrame: 34 + rIdx * 7,
                    enableExit: props.enableExitAnimation,
                    offsetY: 18,
                    startScale: 0.96,
                    startBlur: 4,
                  });

                  return (
                    <div
                      key={rIdx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "66px 38px 1fr 1fr 1fr",
                        alignItems: "stretch",
                        minHeight: rIdx === 2 ? 56 : 72,
                        ...rowMotion,
                      }}
                    >
                      {/* 左侧橙黄渐变套餐徽章 */}
                      <div
                        style={{
                          background:
                            "linear-gradient(180deg, #fde68a 0%, #fcd34d 45%, #fbbf24 100%)",
                          borderRadius: 6,
                          padding: "4px 3px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          color: "#451a03",
                          boxShadow: "0 2px 6px rgba(245, 158, 11, 0.22)",
                        }}
                      >
                        <div style={{ fontSize: 11.5, fontWeight: 800 }}>
                          {row.badgeTitle}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 900,
                            lineHeight: 1.15,
                            marginTop: 2,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {row.badgeSub}
                        </div>
                      </div>

                      {/* 单网 / 双网 标签列 */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                        }}
                      >
                        <div>单网</div>
                        <div>双网</div>
                      </div>

                      {/* 1个月 / 6个月 / 12个月 价格矩阵 */}
                      {[0, 1, 2].map((colIdx) => {
                        const sVal = row.singleNet[colIdx];
                        const dVal = row.dualNet[colIdx];
                        const hasContent = Boolean(sVal || dVal);
                        const isLastCol = colIdx === 2;
                        return (
                          <div
                            key={colIdx}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-around",
                              alignItems: "center",
                              backgroundColor:
                                hasContent && colIdx >= 1
                                  ? "rgba(241, 245, 249, 0.78)"
                                  : "transparent",
                              borderRadius: 4,
                              margin: "0 2px",
                              padding: "2px 0",
                            }}
                          >
                            <div style={{ textAlign: "center", lineHeight: 1.05 }}>
                              <div
                                style={{
                                  fontSize: 16,
                                  fontWeight: 800,
                                  color: "#1e293b",
                                }}
                              >
                                {sVal}
                              </div>
                              {isLastCol && row.unitPriceSingle && (
                                <div
                                  style={{
                                    fontSize: 9,
                                    color: "#64748b",
                                    fontWeight: 600,
                                  }}
                                >
                                  {row.unitPriceSingle}
                                </div>
                              )}
                            </div>

                            <div style={{ textAlign: "center", lineHeight: 1.05 }}>
                              <div
                                style={{
                                  fontSize: 16,
                                  fontWeight: 800,
                                  color: "#1e293b",
                                }}
                              >
                                {dVal}
                              </div>
                              {isLastCol && row.unitPriceDual && (
                                <div
                                  style={{
                                    fontSize: 9,
                                    color: "#64748b",
                                    fontWeight: 600,
                                  }}
                                >
                                  {row.unitPriceDual}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* 表格底部微字说明 */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: 7.5,
                  color: "#94a3b8",
                  lineHeight: 1.35,
                  marginTop: 4,
                }}
              >
                <div>* “期间”指套餐有效期的自然月，不含月底</div>
                <div>*以上可选套餐包仅供参考，具体以实际激活后官方显示为准</div>
              </div>
            </div>

            {/* 卡片左下角提示 */}
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "#334155",
                marginTop: 6,
              }}
            >
              (仅供参考，一切以对应店铺公示的实际套餐为准)
            </div>
          </div>

          {/* 底部斜体说明：-套餐资费详情- */}
          <div
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: 800,
              fontStyle: "italic",
              color: "#9ca3af",
              letterSpacing: 2,
              marginTop: 6,
            }}
          >
            <SilkyTextReveal
              text={props.tariffBottomCaption}
              frame={frame}
              fps={fps}
              inFrame={48}
              enableExit={props.enableExitAnimation}
              stagger={1.5}
              offsetY={16}
            />
          </div>
        </div>

        {/* ==================== 6. 右侧主参数与芯片技术大卡片 ==================== */}
        <div
          style={{
            position: "absolute",
            left: 1184,
            top: 122,
            width: 682,
            height: 822,
            borderRadius: 28,
            background:
              "linear-gradient(165deg, rgba(44, 48, 60, 0.92) 0%, rgba(28, 31, 40, 0.95) 55%, rgba(22, 24, 32, 0.98) 100%)",
            border: "2.2px solid rgba(190, 198, 214, 0.48)",
            boxShadow:
              "0 28px 64px rgba(0, 0, 0, 0.78), inset 0 1.5px 2px rgba(255, 255, 255, 0.32)",
            padding: "24px 24px 24px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            ...rightSpecCardMotion,
          }}
        >
          {/* 玻璃斜向光泽扫过 */}
          <div
            style={{
              position: "absolute",
              inset: -60,
              background:
                "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.12) 50%, transparent 62%)",
              transform: `translateX(${rightCardSheen}%)`,
              pointerEvents: "none",
            }}
          />

          {/* 6项核心硬件参数行：逐行丝滑交错入场 + 文字遮罩升起 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {props.specs.map((item, idx) => {
              const rowInFrame = 26 + idx * 5;
              const rowMotion = useSilkyMotion({
                frame,
                fps,
                inFrame: rowInFrame,
                enableExit: props.enableExitAnimation,
                offsetX: 34,
                offsetY: 12,
                startScale: 0.96,
                startBlur: 6,
                damping: 19,
                stiffness: 120,
              });

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    height: item.highlightPill ? 66 : 62,
                    padding: item.highlightPill ? "0 18px" : "0 16px",
                    borderRadius: item.highlightPill ? 36 : 16,
                    background: item.highlightPill
                      ? "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
                      : "transparent",
                    border: item.highlightPill
                      ? "2px solid rgba(210, 218, 232, 0.55)"
                      : "2px solid transparent",
                    boxShadow: item.highlightPill
                      ? "0 8px 22px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255,255,255,0.22)"
                      : "none",
                    width: item.highlightPill
                      ? idx === 0
                        ? "99%"
                        : "95%"
                      : "100%",
                    boxSizing: "border-box",
                    ...rowMotion,
                  }}
                >
                  {/* 左侧蓝青色线性图标 */}
                  <div
                    style={{
                      width: 46,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      flexShrink: 0,
                    }}
                  >
                    <SpecIcon type={item.icon} />
                  </div>

                  {/* 参数名 */}
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 400,
                      color: "rgba(235, 240, 248, 0.92)",
                      letterSpacing: 0.5,
                      marginRight: 8,
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </span>

                  {/* 参数主值：带逐字丝滑升起 */}
                  <SilkyTextReveal
                    text={item.value}
                    frame={frame}
                    fps={fps}
                    inFrame={rowInFrame + 3}
                    enableExit={props.enableExitAnimation}
                    stagger={1.1}
                    offsetY={22}
                    charStyle={{
                      fontSize: item.subValue ? 35 : 38,
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: 0.5,
                      textShadow: "0 4px 12px rgba(0,0,0,0.45)",
                    }}
                  />

                  {/* 附加括弧说明 */}
                  {item.subValue && (
                    <SilkyTextReveal
                      text={item.subValue}
                      frame={frame}
                      fps={fps}
                      inFrame={rowInFrame + 8}
                      enableExit={props.enableExitAnimation}
                      stagger={0.9}
                      offsetY={18}
                      style={{ marginLeft: 2 }}
                      charStyle={{
                        fontSize: 23,
                        fontWeight: 800,
                        color: "#ffffff",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* 右下角内部子卡片：型号技术 紫光展锐 T760 */}
          <div
            style={{
              width: "100%",
              height: 290,
              borderRadius: 20,
              background:
                "linear-gradient(135deg, #1b2238 0%, #171d31 58%, #1e243d 100%)",
              border: "1.8px solid rgba(180, 192, 220, 0.42)",
              boxShadow:
                "0 16px 36px rgba(0, 0, 0, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.22)",
              padding: "20px 28px",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...chipSubCardMotion,
            }}
          >
            {/* 左侧文字区 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {/* 顶部橙黄色斜体标签：型号技术： */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  style={{
                    transform: `rotate(${(frame * 1.5) % 360}deg)`,
                  }}
                >
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x1 = 15 + Math.cos(angle) * 6;
                    const y1 = 15 + Math.sin(angle) * 6;
                    const x2 = 15 + Math.cos(angle) * 12;
                    const y2 = 15 + Math.sin(angle) * 12;
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#cbd5e1"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        opacity={0.35 + (i / 8) * 0.65}
                      />
                    );
                  })}
                </svg>
                <SilkyTextReveal
                  text={props.chipSectionLabel}
                  frame={frame}
                  fps={fps}
                  inFrame={58}
                  enableExit={props.enableExitAnimation}
                  stagger={1.6}
                  offsetY={20}
                  charStyle={{
                    fontSize: 34,
                    fontWeight: 900,
                    fontStyle: "italic",
                    color: "#f59e0b",
                    letterSpacing: 1,
                    textShadow: "0 4px 14px rgba(245, 158, 11, 0.28)",
                  }}
                />
              </div>

              {/* 芯片型号主标题 */}
              <div
                style={{
                  marginLeft: 42,
                  marginBottom: 22,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <SilkyTextReveal
                    text={props.chipBrand}
                    frame={frame}
                    fps={fps}
                    inFrame={62}
                    enableExit={props.enableExitAnimation}
                    stagger={2}
                    offsetY={26}
                    charStyle={{
                      fontSize: 48,
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: 2,
                      lineHeight: 1.15,
                      textShadow: "0 6px 18px rgba(0, 0, 0, 0.6)",
                    }}
                  />
                </div>
                <div style={{ marginTop: 4 }}>
                  <SilkyTextReveal
                    text={props.chipModel}
                    frame={frame}
                    fps={fps}
                    inFrame={67}
                    enableExit={props.enableExitAnimation}
                    stagger={2}
                    offsetY={26}
                    charStyle={{
                      fontSize: 50,
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: 1.5,
                      lineHeight: 1.1,
                      textShadow: "0 6px 18px rgba(0, 0, 0, 0.6)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 右侧双层 5G 芯片视觉组件 */}
            <div style={{ marginRight: 10 }}>
              <UnisocChipGraphic frame={frame} fps={fps} inFrame={62} />
            </div>
          </div>
        </div>

        {/* ==================== 7. 底部居中字幕条 (可选配置) ==================== */}
        {props.subtitleText && (
          <div
            style={{
              position: "absolute",
              bottom: 34,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
              ...subtitleMotion,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(12, 14, 18, 0.84)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 18,
                padding: "12px 34px",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: "0 14px 34px rgba(0, 0, 0, 0.65)",
              }}
            >
              <span
                style={{
                  fontSize: 46,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: 2,
                }}
              >
                {props.subtitleText}
              </span>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
