import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DeviceModel } from "./DeviceModel";
import { Zap, Wifi, Shield } from "lucide-react";

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances
  const deviceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const textSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14 },
  });

  const badgeSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 15 },
  });

  // Light flare across the title
  const shineOffset = interpolate(frame, [25, 65], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        gap: 60,
      }}
    >
      {/* Device Lockup on Left */}
      <div
        style={{
          opacity: deviceSpring,
          transform: `scale(${deviceSpring}) translateY(${(1 - deviceSpring) * 40}px)`,
          zIndex: 5,
        }}
      >
        <DeviceModel scale={1.35} showScanningLine={false} showAura={true} activeLeds={true} />
      </div>

      {/* Brand & Slogan Lockup on Right */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 720,
          opacity: textSpring,
          transform: `translateX(${(1 - textSpring) * 50}px)`,
          zIndex: 10,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 20,
            background: "rgba(0, 245, 255, 0.12)",
            border: "1px solid rgba(0, 245, 255, 0.4)",
            color: "#00F5FF",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 20,
          }}
        >
          <Zap size={20} fill="#00F5FF" />
          告别拉线 · 拥抱自由
        </div>

        {/* Master Heading */}
        <h1
          style={{
            position: "relative",
            fontSize: 76,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
            lineHeight: 1.15,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          新一代 5G 路由终端
          {/* Shine Sweep Overlay */}
          <span
            style={{
              position: "absolute",
              top: 0,
              left: `${shineOffset}%`,
              width: "40%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)",
              transform: "skewX(-25deg)",
              pointerEvents: "none",
            }}
          />
        </h1>

        {/* Big Slogan Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 4,
            background: "linear-gradient(90deg, #FFFFFF 0%, #00F5FF 50%, #38EF7D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 32,
          }}
        >
          宽带的真正替代品 · 插电即千兆
        </div>

        {/* 3 Core Guarantee Badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            opacity: badgeSpring,
            transform: `translateY(${(1 - badgeSpring) * 20}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 12,
              color: "#E2E8F0",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <Wifi size={18} color="#00F5FF" />
            免拉网线 · 即插即用
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 12,
              color: "#E2E8F0",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <Zap size={18} color="#38EF7D" />
            千兆级超高吞吐
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 12,
              color: "#E2E8F0",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            <Shield size={18} color="#00F5FF" />
            7×24H 满载不降频
          </div>
        </div>
      </div>
    </div>
  );
};
