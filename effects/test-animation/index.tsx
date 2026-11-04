import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CheckCircle2, Cpu, Sparkles, Terminal } from "lucide-react";

export const TestAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Smooth entrance spring
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const cardSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14 },
  });

  // Rotating energy ring
  const ringRotation = interpolate(frame, [0, 90], [0, 360]);

  // Breathing pulse
  const pulseScale = interpolate(
    Math.sin(frame / 10),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#070A0F",
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.08) 0%, rgba(7, 10, 15, 0.95) 70%),
          linear-gradient(180deg, #05070B 0%, #090E17 100%)
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(#00F5FF 1px, transparent 1px), linear-gradient(90deg, #00F5FF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orbiting Ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "2px dashed rgba(0, 245, 255, 0.25)",
          transform: `rotate(${ringRotation}deg) scale(${pulseScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: titleSpring,
          transform: `scale(${titleSpring}) translateY(${(1 - titleSpring) * 40}px)`,
        }}
      >
        {/* Pill Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 22px",
            borderRadius: 20,
            background: "rgba(0, 245, 255, 0.12)",
            border: "1px solid rgba(0, 245, 255, 0.4)",
            color: "#00F5FF",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 20,
          }}
        >
          <Sparkles size={20} />
          REMOTION 环境自检与动效验证
        </div>

        {/* Master Heading */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
            lineHeight: 1.2,
            marginBottom: 16,
            textShadow: "0 0 30px rgba(0, 245, 255, 0.4)",
          }}
        >
          Remotion 渲染环境已就绪
        </h1>

        <p
          style={{
            fontSize: 22,
            color: "rgba(255, 255, 255, 0.75)",
            marginBottom: 36,
            letterSpacing: 1,
          }}
        >
          Effects 目录架构生效 · 根依赖统一纳管 · 阿里巴巴普惠体全量驱动
        </p>

        {/* Environment Status Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 220px)",
            gap: 16,
            opacity: cardSpring,
            transform: `translateY(${(1 - cardSpring) * 30}px)`,
          }}
        >
          {/* Item 1 */}
          <div
            style={{
              padding: "20px 16px",
              borderRadius: 16,
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={28} color="#38EF7D" />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              Node.js v26.13
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              运行环境正常
            </div>
          </div>

          {/* Item 2 */}
          <div
            style={{
              padding: "20px 16px",
              borderRadius: 16,
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={28} color="#38EF7D" />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              FFmpeg v8.0
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              硬件加速就绪
            </div>
          </div>

          {/* Item 3 */}
          <div
            style={{
              padding: "20px 16px",
              borderRadius: 16,
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={28} color="#38EF7D" />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              Headless Shell
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Chromium 157.0
            </div>
          </div>

          {/* Item 4 */}
          <div
            style={{
              padding: "20px 16px",
              borderRadius: 16,
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={28} color="#38EF7D" />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              普惠体 3.0
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              全量权重加载
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
