import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
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

// 10秒 @ 30fps = 300帧
export const POCKET_WIFI_DURATION = 300;

// ========================================================
// 1. 可配置的数据结构定义 (支持外部传入 Props 或直接改默认配置)
// ========================================================

export interface TariffCellData {
  main: string; // 支持用 *文字* 标记颜色强调，例如 "*35.5* 元/月"
  sub?: string; // 支持用 *文字* 标记颜色强调，例如 "¥249 / 半年 · *赠2个月*"
  highlight?: boolean;
}

export interface TariffRowData {
  period: string;
  cells: TariffCellData[];
}

export interface SpecCardItemData {
  iconType: IconType;
  label: string;
  value: string; // 支持 *文字* 强调色
  lines: string[]; // 支持 *文字* 强调色
}

export interface PocketWifiBoardProps {
  /**
   * 左侧产品图片路径：
   * - 填入 public 目录下的文件名（如 "my_wifi.png"）或完整 http(s) URL 即可替换真机图
   * - 留空 "" 则默认使用内置写实工业双机渲染模型
   */
  productImage?: string;
  /** 全局强调文字颜色（用于重点参数、划算资费、核心价格区分） */
  accentColor?: string;
  /** 左上角定位小标题 */
  tierLabel?: string;
  /** 左上角定位主标题（支持 *文字* 强调色） */
  tierValue?: string;
  /** 产品名称大标题 */
  productName?: string;
  /** 第一行 2 张硬件规格卡 */
  topCards?: [SpecCardItemData, SpecCardItemData];
  /** 第二行 流量资费套餐矩阵（支持动态增减行列） */
  tariffMatrix?: {
    title: string;
    slogan: string;
    periodHeader: string;
    columns: string[]; // 支持 *文字* 强调色
    rows: TariffRowData[];
  };
  /** 第三行左 硬件规格卡 */
  bottomLeftCard?: SpecCardItemData;
  /** 第三行右 焦点特惠价格卡（带白色虚线跑马灯） */
  highlightCard?: {
    iconType: IconType;
    label: string;
     targetPrice: number;
    priceDecimals?: number;
    pricePrefix?: string;
    priceSuffix?: string;
    lines: string[]; // 支持 *文字* 强调色
  };
  /** 底部口播解说大字幕（支持 *文字* 强调色） */
  subtitle?: string;
  /** 右下角实名认证/免责小字 */
  footnote?: string;
}

export const defaultPocketWifiProps: Required<PocketWifiBoardProps> = {
  // 如需替换左侧产品图，将图片放入 public/ 文件夹并填写文件名，例如 "tm818.png"
  productImage: "",
  // 琥珀暖金强调色（在炭黑灰阶底上既克制高级，又能一眼区分重点）
  accentColor: "#fbbf24",
  tierLabel: "官方售价 / POCKET WIFI",
  tierValue: "*¥73* 随身WiFi终端",
  productName: "极力猫 TM818",

  topCards: [
    {
      iconType: "chip",
      label: "信号与芯片",
      value: "*移芯*通信芯片",
      lines: [
        "网络类型：*LTE 4G 网络* (三网全网通)",
        "无线频段：*Wi-Fi 6* · 2.4GHz",
      ],
    },
    {
      iconType: "network",
      label: "速率与连接",
      value: "*40Mbps* 峰值",
      lines: [
        "最大连接数：支持 *16 台*设备同时连接",
        "信号表现：流量多网速快 / *真三网不断网*",
      ],
    },
  ],

  tariffMatrix: {
    title: "极力猫流量资费套餐",
    slogan: "/ 流量多网速快 · 真三网不断网",
    periodHeader: "时长 \\ 流量档位",
    columns: ["100G", "500G", "*1500G (主力推荐)*", "3000G"],
    rows: [
      {
        period: "1 个月",
        cells: [
          { main: "29 元/月", sub: "月付即用" },
          { main: "49 元/月", sub: "月付即用" },
          { main: "59 元/月", sub: "月付即用" },
          { main: "69 元/月", sub: "月付即用" },
        ],
      },
      {
        period: "6 个月",
        cells: [
          { main: "—", sub: "/" },
          { main: "34.8 元/月", sub: "¥209 / 半年" },
          { main: "*35.5 元/月*", sub: "¥249 / 半年 · *赠2个月*", highlight: true },
          { main: "43.1 元/月", sub: "¥359 / 半年" },
        ],
      },
      {
        period: "12 个月",
        cells: [
          { main: "*21.4 元/月*", sub: "¥279 / 年 · *赠1个月*" },
          { main: "31.5 元/月", sub: "¥379 / 年" },
          { main: "*26.6 元/月*", sub: "¥399 / 年 · *赠3个月*", highlight: true },
          { main: "35.7 元/月", sub: "¥429 / 年" },
        ],
      },
    ],
  },

  bottomLeftCard: {
    iconType: "battery",
    label: "电池与机身",
    value: "*8000mAh*",
    lines: [
      "机身重量：*约 198g*",
      "硬件配置：大容量电芯 / 随行便携机身",
    ],
  },

  highlightCard: {
    iconType: "price",
    label: "24个月特惠套餐",
    targetPrice: 24.3,
    priceDecimals: 1,
    pricePrefix: "",
    priceSuffix: "元/月",
    lines: [
      "套餐规格：*1500G 特惠包* (¥729/两年 · *赠6个月*)",
      "硬件售价：官方售价 *73 元*",
    ],
  },

  subtitle: "目前 *1500G* 特惠套餐折合最低 *24.3 元/月*",
  footnote: "注：随身WiFi需提交身份信息至运营商平台实名认证 · 未满十八周岁无法认证",
};

// ========================================================
// 2. 强调文字颜色解析工具 (将 *文本* 自动渲染为强调色)
// ========================================================

const renderHighlightedText = (
  text: string,
  accentColor: string,
  defaultColor = "inherit"
): React.ReactNode => {
  if (!text || !text.includes("*")) {
    return <span style={{ color: defaultColor }}>{text}</span>;
  }
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          const clean = part.slice(1, -1);
          return (
            <span
              key={i}
              style={{
                color: accentColor,
                textShadow: `0 0 18px ${accentColor}33`,
              }}
            >
              {clean}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: defaultColor }}>
            {part}
          </span>
        );
      })}
    </>
  );
};

// ========================================================
// 3. 动效引擎：入场 + 驻留 + 出场 (10秒 300帧完整生命周期)
// ========================================================

interface MotionSpec {
  frame: number;
  fps: number;
  inFrame: number;
  outFrame?: number;
  inY?: number;
  outY?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

const getStageMotion = ({
  frame,
  fps,
  inFrame,
  outFrame = 262,
  inY = 32,
  outY = -28,
  damping = 19,
  stiffness = 110,
  mass = 0.85,
}: MotionSpec): React.CSSProperties => {
  if (frame < inFrame) {
    return {
      opacity: 0,
      transform: `translate3d(0, ${inY}px, 0) scale(0.96)`,
      filter: "blur(8px)",
    };
  }

  if (frame >= outFrame) {
    const p = interpolate(frame, [outFrame, outFrame + 24], [0, 1], {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      opacity: Math.max(0, 1 - p),
      transform: `translate3d(0, ${(p * outY).toFixed(2)}px, 0) scale(${(
        1 -
        p * 0.03
      ).toFixed(3)})`,
      filter: p > 0.05 ? `blur(${(p * 10).toFixed(2)}px)` : "none",
    };
  }

  const s = spring({
    frame: frame - inFrame,
    fps,
    config: { damping, stiffness, mass },
  });

  const curY = (1 - s) * inY;
  const curBlur = Math.max(0, (1 - Math.min(1, s)) * 8);
  const curScale = 0.96 + s * 0.04;

  return {
    opacity: Math.min(1, s * 1.2),
    transform: `translate3d(0, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(3)})`,
    filter: curBlur > 0.1 ? `blur(${curBlur.toFixed(2)}px)` : "none",
  };
};

// ========================================================
// 4. 工业极简线性图标
// ========================================================

export type IconType = "chip" | "network" | "tariff" | "battery" | "price";

const LinearIcon: React.FC<{
  type: IconType;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}> = ({ type, size = 28, stroke = "#9e9e9e", strokeWidth = 2 }) => {
  switch (type) {
    case "chip":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <rect x="9" y="9" width="18" height="18" rx="2" stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="14" y="14" width="8" height="8" rx="1" stroke={stroke} strokeWidth={strokeWidth * 0.85} />
          <line x1="13" y1="4" x2="13" y2="9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="18" y1="4" x2="18" y2="9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="23" y1="4" x2="23" y2="9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="13" y1="27" x2="13" y2="32" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="18" y1="27" x2="18" y2="32" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="23" y1="27" x2="23" y2="32" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="4" y1="13" x2="9" y2="13" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="4" y1="18" x2="9" y2="18" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="4" y1="23" x2="9" y2="23" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="27" y1="13" x2="32" y2="13" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="27" y1="18" x2="32" y2="18" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="27" y1="23" x2="32" y2="23" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case "network":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <path d="M5 13C12.2 6.5 23.8 6.5 31 13" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M9.5 18.5C14.3 14 21.7 14 26.5 18.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M14 24C16.3 21.8 19.7 21.8 22 24" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="18" cy="28.5" r="2" fill={stroke} />
        </svg>
      );
    case "tariff":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <rect x="5" y="7" width="26" height="22" rx="2" stroke={stroke} strokeWidth={strokeWidth} />
          <line x1="5" y1="14" x2="31" y2="14" stroke={stroke} strokeWidth={strokeWidth} />
          <line x1="13" y1="14" x2="13" y2="29" stroke={stroke} strokeWidth={strokeWidth} />
          <line x1="22" y1="14" x2="22" y2="29" stroke={stroke} strokeWidth={strokeWidth} />
          <line x1="5" y1="21.5" x2="31" y2="21.5" stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
      );
    case "battery":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <path
            d="M11 10H7C5.89543 10 5 10.8954 5 12V24C5 25.1046 5.89543 26 7 26H11"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d="M23 10H27C28.1046 10 29 10.8954 29 12V24C29 25.1046 28.1046 26 27 26H23"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line x1="32" y1="15" x2="32" y2="21" stroke={stroke} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          <path
            d="M18.5 11L13.5 18.5H18L16 25L21.5 17.5H17L18.5 11Z"
            stroke={stroke}
            strokeWidth={strokeWidth * 0.9}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "price":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <path
            d="M18.5 6H28C29.1046 6 30 6.89543 30 8V17.5L17.5 30C16.7 30.8 15.3 30.8 14.5 30L6 21.5C5.2 20.7 5.2 19.3 6 18.5L18.5 6Z"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <circle cx="24" cy="12" r="2" fill={stroke} />
        </svg>
      );
  }
};

// ========================================================
// 5. 左侧产品展示：支持自定义图片或默认工业双机模型
// ========================================================

const ProductShowcase: React.FC<{
  productImage?: string;
  frame: number;
}> = ({ productImage, frame }) => {
  const floatY = Math.sin(frame / 42) * 3.5;

  // 若用户配置了自定义产品图片，则直接渲染用户的图片
  if (productImage && productImage.trim() !== "") {
    const imgSrc =
      productImage.startsWith("http://") ||
      productImage.startsWith("https://") ||
      productImage.startsWith("data:")
        ? productImage
        : staticFile(productImage);

    return (
      <div
        style={{
          position: "relative",
          width: 560,
          height: 620,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY.toFixed(2)}px)`,
          maskImage:
            "linear-gradient(180deg, #000 74%, rgba(0,0,0,0.5) 90%, transparent 99%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 74%, rgba(0,0,0,0.5) 90%, transparent 99%)",
        }}
      >
        <Img
          src={imgSrc}
          style={{
            maxWidth: "92%",
            maxHeight: "94%",
            objectFit: "contain",
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.88))",
          }}
        />
      </div>
    );
  }

  // 默认：内置写实工业风双视角硬件模型
  return (
    <div
      style={{
        position: "relative",
        width: 560,
        height: 620,
        transform: `translateY(${floatY.toFixed(2)}px)`,
        maskImage:
          "linear-gradient(180deg, #000 68%, rgba(0,0,0,0.5) 86%, transparent 98%)",
        WebkitMaskImage:
          "linear-gradient(180deg, #000 68%, rgba(0,0,0,0.5) 86%, transparent 98%)",
      }}
    >
      {/* 左后方机身：银灰磨砂金属背壳视角 */}
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 28,
          width: 224,
          height: 540,
          borderRadius: 32,
          transform: "perspective(1050px) rotateY(-22deg) rotateZ(-0.5deg)",
          background:
            "linear-gradient(155deg, #d8d9dd 0%, #b8bac0 38%, #858890 72%, #52545a 100%)",
          border: "1.5px solid #e4e5e9",
          boxShadow:
            "10px 5px 0 #9a9ca4, 13px 7px 0 #5f6168, 24px 30px 50px rgba(0,0,0,0.88)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 30,
            border: "1.5px solid rgba(255,255,255,0.65)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "52%",
            top: 72,
            transform: "translateX(-50%)",
            width: 116,
            height: 44,
            borderRadius: 8,
            background: "rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.28)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "rgba(35,36,40,0.65)",
              letterSpacing: 2,
            }}
          >
            4G LTE WIFI
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 2.5,
                  borderRadius: 1,
                  background: "rgba(35,36,40,0.35)",
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "52%",
            top: 245,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "rgba(30,30,34,0.42)",
              letterSpacing: 2.5,
            }}
          >
            TM818
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(30,30,34,0.32)",
              letterSpacing: 1,
            }}
          >
            8000mAh · Wi-Fi 6
          </div>
        </div>
      </div>

      {/* 右前方主视机身：深空黑曜石正面机身 */}
      <div
        style={{
          position: "absolute",
          left: 196,
          top: 34,
          width: 238,
          height: 546,
          borderRadius: 32,
          transform: "perspective(1050px) rotateY(-20deg) rotateZ(-0.5deg)",
          background:
            "linear-gradient(160deg, #242528 0%, #141517 45%, #0a0a0c 100%)",
          border: "2px solid #5a5c62",
          boxShadow:
            "11px 6px 0 #38393e, 14px 8px 0 #1b1c1f, -15px 20px 45px rgba(0,0,0,0.85), 28px 34px 60px rgba(0,0,0,0.95)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 7,
            borderRadius: 26,
            background: "linear-gradient(175deg, #121315 0%, #070708 65%, #030304 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 290,
              height: 290,
              right: -75,
              top: 35,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 65% 65%, rgba(255,255,255,0.08) 0%, rgba(160,155,140,0.04) 45%, transparent 75%)",
              borderRight: "2px solid rgba(215, 205, 180, 0.35)",
              borderBottom: "2px solid rgba(215, 205, 180, 0.35)",
              transform: "rotate(-14deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 340,
              height: 410,
              left: -25,
              top: 210,
              borderRadius: "46%",
              background:
                "radial-gradient(circle at 38% 12%, rgba(255,255,255,0.12) 0%, rgba(120,120,125,0.05) 42%, transparent 78%)",
              borderTop: "2.5px solid rgba(230, 220, 195, 0.45)",
              transform: "rotate(-20deg)",
            }}
          />

          {/* 猫耳状态视窗 */}
          <div
            style={{
              position: "relative",
              marginTop: 58,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg width="74" height="22" viewBox="0 0 74 22" fill="none" style={{ marginBottom: -3 }}>
              <path
                d="M14 20L21 5L31 15H43L53 5L60 20"
                stroke="#b8bac0"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path d="M18 18L22 9L28 16" fill="rgba(255,255,255,0.15)" />
              <path d="M56 18L52 9L46 16" fill="rgba(255,255,255,0.15)" />
            </svg>

            <div
              style={{
                width: 176,
                height: 36,
                borderRadius: 18,
                background: "rgba(0,0,0,0.65)",
                border: "1.5px solid #8e9096",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                boxSizing: "border-box",
              }}
            >
              <svg width="16" height="11" viewBox="0 0 16 11" fill="#8e9096">
                <rect x="0" y="8" width="2.2" height="3" />
                <rect x="4" y="5.5" width="2.2" height="5.5" />
                <rect x="8" y="3" width="2.2" height="8" />
                <rect x="12" y="0" width="2.2" height="11" />
              </svg>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9a9ca2",
                  letterSpacing: 1.5,
                }}
              >
                2G 3G 4G 5G
              </span>
              <svg width="14" height="11" viewBox="0 0 24 20" fill="none" stroke="#8e9096" strokeWidth="2.2">
                <path d="M3 9C8 4 16 4 21 9" strokeLinecap="round" />
                <path d="M7 13.5C10 10.8 14 10.8 17 13.5" strokeLinecap="round" />
                <circle cx="12" cy="17.5" r="1.5" fill="#8e9096" />
              </svg>
            </div>

            <div
              style={{
                marginTop: 3,
                padding: "1px 12px",
                borderRadius: "0 0 8px 8px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                fontSize: 8,
                fontWeight: 800,
                color: "#b8bac0",
                letterSpacing: 1,
              }}
            >
              100% ▰▰▰
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 136,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              whiteSpace: "nowrap",
            }}
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M3 8C5.5 4.5 12.5 4.5 15 8" stroke="#9e9fa6" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="9" cy="8.5" r="1.3" fill="#9e9fa6" />
            </svg>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#b4b6bc",
                letterSpacing: 1,
              }}
            >
              极力猫 Ginlemag
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 112,
              background: "linear-gradient(180deg, #16171a 0%, #0d0e10 100%)",
              borderTop: "1.5px solid rgba(255,255,255,0.09)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ========================================================
// 6. 标准工业规格卡片 (带出入场动效 + 颜色强调区分)
// ========================================================

interface IndustrialCardProps {
  iconType: IconType;
  label: string;
  value: string;
  lines: string[];
  accentColor: string;
  inFrame: number;
  outFrame: number;
  isHighlighted?: boolean;
}

const IndustrialSpecCard: React.FC<IndustrialCardProps> = ({
  iconType,
  label,
  value,
  lines,
  accentColor,
  inFrame,
  outFrame,
  isHighlighted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardMotion = getStageMotion({
    frame,
    fps,
    inFrame,
    outFrame,
    inY: 36,
    outY: -32,
  });

  // 卡片入场时一道克制的微光掠过
  const sheenX = interpolate(frame, [inFrame + 6, inFrame + 55], [-110, 150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 顶部延伸细线生长
  const lineScaleX = interpolate(frame, [inFrame + 8, inFrame + 32], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右下角焦点卡片的虚线框淡入与脉冲呼吸
  const dashedOpacity = isHighlighted
    ? interpolate(frame, [inFrame + 14, inFrame + 34], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const pulse = isHighlighted ? 0.85 + Math.sin(frame / 10) * 0.15 : 1;

  return (
    <div
      style={{
        position: "relative",
        height: 230,
        padding: "20px 28px",
        boxSizing: "border-box",
        background: isHighlighted
          ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
        border: isHighlighted
          ? "1px solid rgba(255,255,255,0.28)"
          : "1px solid rgba(255,255,255,0.11)",
        boxShadow: isHighlighted
          ? `0 0 ${32 * dashedOpacity}px rgba(255,255,255,0.09), inset 0 0 24px rgba(255,255,255,0.03)`
          : "none",
        ...cardMotion,
      }}
    >
      {/* 内部裁剪层：微光扫过 + 右下角线性水印 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -60,
            background:
              "linear-gradient(118deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
            transform: `translateX(${sheenX}%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: -14,
            opacity: 0.055,
            transform: `rotate(-12deg) translateY(${(Math.sin(frame / 45) * 3).toFixed(2)}px)`,
          }}
        >
          <LinearIcon type={iconType} size={156} stroke="#ffffff" strokeWidth={2.2} />
        </div>
      </div>

      {/* 白色发光虚线跑马灯 (右下角焦点卡) */}
      {isHighlighted && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            pointerEvents: "none",
            opacity: dashedOpacity,
          }}
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeDasharray="16 12"
            strokeDashoffset={-frame * 0.75}
            style={{
              filter: `drop-shadow(0 0 ${8 * pulse}px rgba(255,255,255,0.92)) drop-shadow(0 0 ${
                18 * pulse
              }px rgba(255,255,255,0.45))`,
            }}
          />
        </svg>
      )}

      {/* 顶部标题行 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          ...getStageMotion({
            frame,
            fps,
            inFrame: inFrame + 4,
            outFrame: outFrame + 2,
            inY: 14,
            outY: -12,
          }),
        }}
      >
        <LinearIcon type={iconType} size={28} stroke="#9e9e9e" />
        <span
          style={{
            color: "#a6a6a6",
            fontSize: 27,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            marginLeft: 8,
            background: "rgba(255,255,255,0.07)",
            transformOrigin: "left center",
            transform: `scaleX(${lineScaleX.toFixed(3)})`,
          }}
        />
      </div>

      {/* 核心主数值（遮罩上升 + 颜色强调） */}
      <div style={{ overflow: "hidden", marginBottom: 8 }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: isHighlighted ? 56 : 46,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: 0.5,
            ...getStageMotion({
              frame,
              fps,
              inFrame: inFrame + 8,
              outFrame: outFrame + 4,
              inY: 28,
              outY: -22,
            }),
          }}
        >
          {renderHighlightedText(value, accentColor, "#ffffff")}
        </div>
      </div>

      {/* 底部副参数行 */}
      {lines.map((line, lIdx) => (
        <div key={lIdx} style={{ overflow: "hidden" }}>
          <div
            style={{
              color: isHighlighted ? "#b4b4b4" : "#8c8c8c",
              fontSize: isHighlighted ? 22 : 20,
              fontWeight: 500,
              lineHeight: 1.5,
              ...getStageMotion({
                frame,
                fps,
                inFrame: inFrame + 12 + lIdx * 4,
                outFrame: outFrame + 6 + lIdx * 2,
                inY: 16,
                outY: -14,
              }),
            }}
          >
            {renderHighlightedText(
              line,
              accentColor,
              isHighlighted ? "#b4b4b4" : "#8c8c8c"
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ========================================================
// 7. 动态可配置流量资费矩阵卡片 (支持任意行列 & 颜色强调)
// ========================================================

const IndustrialTariffMatrix: React.FC<{
  data: Required<PocketWifiBoardProps>["tariffMatrix"];
  accentColor: string;
  inFrame: number;
  outFrame: number;
}> = ({ data, accentColor, inFrame, outFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardMotion = getStageMotion({
    frame,
    fps,
    inFrame,
    outFrame,
    inY: 36,
    outY: -32,
  });

  // 根据传入的 columns 数量动态计算 CSS Grid 列宽模板
  const gridTemplateColumns = `130px ${data.columns
    .map((c) => (c.includes("*") ? "1.18fr" : "1fr"))
    .join(" ")}`;

  const lineScaleX = interpolate(frame, [inFrame + 8, inFrame + 36], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        height: 276,
        padding: "18px 28px",
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.11)",
        overflow: "hidden",
        ...cardMotion,
      }}
    >
      {/* 右下角线性表格大水印 */}
      <div
        style={{
          position: "absolute",
          right: 24,
          bottom: -18,
          opacity: 0.045,
          transform: `rotate(-10deg) translateY(${(Math.sin(frame / 45) * 3).toFixed(2)}px)`,
          pointerEvents: "none",
        }}
      >
        <LinearIcon type="tariff" size={180} stroke="#ffffff" strokeWidth={2} />
      </div>

      {/* 顶部标题行 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
          ...getStageMotion({
            frame,
            fps,
            inFrame: inFrame + 4,
            outFrame: outFrame + 2,
            inY: 14,
            outY: -12,
          }),
        }}
      >
        <LinearIcon type="tariff" size={28} stroke="#9e9e9e" />
        <span
          style={{
            color: "#a6a6a6",
            fontSize: 27,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {data.title}
        </span>
        <span
          style={{
            color: "#6e6e6e",
            fontSize: 18,
            fontWeight: 500,
            marginLeft: 6,
          }}
        >
          {renderHighlightedText(data.slogan, accentColor, "#6e6e6e")}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            marginLeft: 10,
            background: "rgba(255,255,255,0.07)",
            transformOrigin: "left center",
            transform: `scaleX(${lineScaleX.toFixed(3)})`,
          }}
        />
      </div>

      {/* 矩阵表头 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          columnGap: 14,
          paddingBottom: 6,
          borderBottom: "1px solid rgba(255,255,255,0.09)",
          alignItems: "center",
          ...getStageMotion({
            frame,
            fps,
            inFrame: inFrame + 8,
            outFrame: outFrame + 4,
            inY: 14,
            outY: -12,
          }),
        }}
      >
        <div style={{ color: "#787878", fontSize: 17, fontWeight: 500 }}>
          {data.periodHeader}
        </div>
        {data.columns.map((col, idx) => (
          <div
            key={idx}
            style={{
              color: "#b8b8b8",
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            {renderHighlightedText(col, accentColor, "#b8b8b8")}
          </div>
        ))}
      </div>

      {/* 矩阵数据行 (按行错峰入场) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
        {data.rows.map((row, rIdx) => {
          const rowMotion = getStageMotion({
            frame,
            fps,
            inFrame: inFrame + 12 + rIdx * 6,
            outFrame: outFrame + 6 + rIdx * 3,
            inY: 18,
            outY: -14,
          });

          return (
            <div
              key={row.period}
              style={{
                display: "grid",
                gridTemplateColumns,
                columnGap: 14,
                alignItems: "center",
                height: 46,
                borderBottom:
                  rIdx < data.rows.length - 1
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "none",
                ...rowMotion,
              }}
            >
              {/* 周期列 */}
              <div
                style={{
                  color: "#c8c8c8",
                  fontSize: 21,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {renderHighlightedText(row.period, accentColor, "#c8c8c8")}
              </div>

              {/* 流量价格单元格 */}
              {row.cells.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: cell.highlight ? "4px 10px" : "2px 0",
                    background: cell.highlight
                      ? "rgba(255,255,255,0.055)"
                      : "transparent",
                    borderLeft: cell.highlight
                      ? `2.5px solid ${accentColor}`
                      : "none",
                  }}
                >
                  <div
                    style={{
                      color: "#e4e4e4",
                      fontSize: 23,
                      fontWeight: 900,
                      lineHeight: 1.15,
                    }}
                  >
                    {renderHighlightedText(cell.main, accentColor, "#e4e4e4")}
                  </div>
                  {cell.sub && (
                    <div
                      style={{
                        color: cell.highlight ? "#b8b8b8" : "#787878",
                        fontSize: 14,
                        fontWeight: 500,
                        marginTop: 2,
                      }}
                    >
                      {renderHighlightedText(
                        cell.sub,
                        accentColor,
                        cell.highlight ? "#b8b8b8" : "#787878"
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========================================================
// 8. 主合成组件 PocketWifiBoard (1080P, 10s @ 30fps)
// ========================================================

export const PocketWifiBoard: React.FC<PocketWifiBoardProps> = (rawProps) => {
  const props: Required<PocketWifiBoardProps> = {
    ...defaultPocketWifiProps,
    ...rawProps,
  };

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [handle] = useState(() => delayRender("Load Alibaba PuHuiTi fonts"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle]);

  // 左侧定位框、大标题、硬件图片动效
  const tierBoxMotion = getStageMotion({
    frame,
    fps,
    inFrame: 6,
    outFrame: 268,
    inY: 28,
    outY: -26,
  });

  const productMotion = getStageMotion({
    frame,
    fps,
    inFrame: 16,
    outFrame: 272,
    inY: 48,
    outY: -40,
    damping: 20,
    stiffness: 95,
  });

  // 大标题逐字升起 + 扫光
  const titleChars = Array.from(props.productName);
  const titleShimmerX = interpolate(frame, [24, 78], [-50, 145], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 右下角特惠价格数字滚动 (Frame 76 -> 114)
  const priceRollProgress = interpolate(frame, [76, 114], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentPriceVal = (
    priceRollProgress * props.highlightCard.targetPrice
  ).toFixed(props.highlightCard.priceDecimals ?? 1);
  const formattedHighlightPrice = `*${props.highlightCard.pricePrefix ?? ""}${currentPriceVal}*${
    props.highlightCard.priceSuffix ?? "元/月"
  }`;

  // 底部解说字幕与小字动效
  const subtitleMotion = getStageMotion({
    frame,
    fps,
    inFrame: 92,
    outFrame: 254,
    inY: 24,
    outY: -20,
  });

  const footnoteMotion = getStageMotion({
    frame,
    fps,
    inFrame: 98,
    outFrame: 254,
    inY: 14,
    outY: -12,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0e0e0e",
        color: "#ffffff",
        fontFamily: "'Alibaba PuHuiTi', 'Microsoft YaHei', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 1. 纯正暗炭灰工业影棚径向光背景 */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 78% 72% at 52% 42%, #222222 0%, #141414 55%, #090909 100%)",
        }}
      />

      {/* 2. 极细暗色方格底纹 */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(ellipse 90% 85% at 50% 48%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.2) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 85% at 50% 48%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.2) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 3. 左下至右下工业斜切暗面 */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="darkFloorSlope" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.52)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.92)" />
          </linearGradient>
        </defs>
        <path
          d="M -40 365 L 1960 835 L 1960 1080 L -40 1080 Z"
          fill="url(#darkFloorSlope)"
        />
        <line
          x1="-40"
          y1="365"
          x2="1960"
          y2="835"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      </svg>

      {/* ======================================================== */}
      {/* 左侧栏：直角价位框 + 逐字升起大标题 + 可替换产品图片/模型 */}
      {/* ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 56,
          width: 564,
        }}
      >
        {/* 顶部直角定位框 */}
        <div
          style={{
            position: "relative",
            height: 148,
            padding: "24px 32px",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            ...tierBoxMotion,
          }}
        >
          {/* 左上侧标志性修饰竖条（带有强调色点缀） */}
          <div
            style={{
              position: "absolute",
              left: -1,
              top: -1,
              width: 4,
              height: 68,
              background: props.accentColor,
            }}
          />

          <div
            style={{
              color: "#8a8a8a",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 0.8,
            }}
          >
            {props.tierLabel}
          </div>

          <div
            style={{
              color: "#e0e0e0",
              fontSize: 45,
              fontWeight: 900,
              letterSpacing: 1,
              lineHeight: 1.1,
            }}
          >
            {renderHighlightedText(props.tierValue, props.accentColor, "#e0e0e0")}
          </div>
        </div>

        {/* 产品大标题：逐字遮罩升起 + 冷白扫光 */}
        <div
          style={{
            position: "relative",
            marginTop: 24,
            overflow: "hidden",
            padding: "4px 6px 8px 0",
            display: "inline-flex",
          }}
        >
          {titleChars.map((ch, idx) => {
            const chMotion = getStageMotion({
              frame,
              fps,
              inFrame: 12 + idx * 2.2,
              outFrame: 268 + idx * 1.2,
              inY: 52,
              outY: -40,
              damping: 17,
              stiffness: 115,
            });
            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  fontSize: 68,
                  fontWeight: 900,
                  color: "#f2f2f2",
                  letterSpacing: ch === " " ? 12 : 1.5,
                  textShadow:
                    "0 0 22px rgba(255,255,255,0.28), 0 4px 16px rgba(0,0,0,0.8)",
                  ...chMotion,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}

          <div
            style={{
              position: "absolute",
              inset: "-10px -20px",
              pointerEvents: "none",
              mixBlendMode: "overlay",
              background:
                "linear-gradient(112deg, transparent 35%, rgba(255,255,255,0.85) 50%, transparent 65%)",
              transform: `translateX(${titleShimmerX}%)`,
              opacity: interpolate(frame, [20, 32, 70, 84], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        </div>

        {/* 产品图片或内置双机写实模型 */}
        <div style={{ marginTop: 8, ...productMotion }}>
          <ProductShowcase productImage={props.productImage} frame={frame} />
        </div>
      </div>

      {/* 垂直细分割线 */}
      <div
        style={{
          position: "absolute",
          left: 668,
          top: 56,
          width: 1,
          height: 820,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.03) 100%)",
          opacity: interpolate(frame, [0, 25, 270, 295], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* ======================================================== */}
      {/* 右侧栏：工业直角网格 (第1行硬件 + 第2行资费矩阵 + 第3行电池与焦点价格) */}
      {/* ======================================================== */}
      <div
        style={{
          position: "absolute",
          left: 712,
          right: 58,
          top: 56,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* 第一行：2 张硬件卡片 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 20,
          }}
        >
          <IndustrialSpecCard
            {...props.topCards[0]}
            accentColor={props.accentColor}
            inFrame={24}
            outFrame={264}
          />
          <IndustrialSpecCard
            {...props.topCards[1]}
            accentColor={props.accentColor}
            inFrame={30}
            outFrame={262}
          />
        </div>

        {/* 第二行：动态流量资费矩阵 */}
        <IndustrialTariffMatrix
          data={props.tariffMatrix}
          accentColor={props.accentColor}
          inFrame={44}
          outFrame={258}
        />

        {/* 第三行：电池机身 + 右下角特惠套餐焦点卡 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 20,
          }}
        >
          <IndustrialSpecCard
            {...props.bottomLeftCard}
            accentColor={props.accentColor}
            inFrame={64}
            outFrame={254}
          />
          <IndustrialSpecCard
            iconType={props.highlightCard.iconType}
            label={props.highlightCard.label}
            value={formattedHighlightPrice}
            lines={props.highlightCard.lines}
            accentColor={props.accentColor}
            inFrame={70}
            outFrame={252}
            isHighlighted
          />
        </div>
      </div>

      {/* 底部解说字幕 (左对齐右侧网格，重点词带颜色强调) */}
      <div
        style={{
          position: "absolute",
          left: 712,
          bottom: 72,
          overflow: "hidden",
          padding: "4px 0",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 1,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            ...subtitleMotion,
          }}
        >
          {renderHighlightedText(props.subtitle, props.accentColor, "#ffffff")}
        </div>
      </div>

      {/* 右下角免责与实名认证小字 */}
      <div
        style={{
          position: "absolute",
          right: 58,
          bottom: 28,
          color: "#666666",
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: 0.5,
          ...footnoteMotion,
        }}
      >
        {props.footnote}
      </div>
    </AbsoluteFill>
  );
};
