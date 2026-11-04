import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Gauge, CheckCircle2, XCircle, Zap, Activity } from "lucide-react";
import { DigitRoll } from "../../src/lib/DigitRoll";

export const Shot3ThroughputBench: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const headerSpring = spring({ frame, fps, config: { damping: 14 } });
  const speedSpring = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const compLeftSpring = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const compRightSpring = spring({ frame: frame - 24, fps, config: { damping: 14 } });

  // Speed bar fill progress
  const gaugePercent = interpolate(frame, [15, 65], [0, 95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Latency counter drops from 78ms to 8ms
  const currentPing = interpolate(frame, [15, 55], [78, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [105, 115], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [105, 115], [1, 0.94], {
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          textAlign: "center",
          opacity: headerSpring,
          transform: `translateY(${(1 - headerSpring) * -30}px)`,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 20px",
            borderRadius: 20,
            background: "rgba(0, 245, 255, 0.12)",
            border: "1.5px solid rgba(0, 245, 255, 0.4)",
            color: "#00F5FF",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          <Gauge size={18} />
          光纤级真千兆平替 · 实测见真章
        </div>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
          }}
        >
          插电即千兆 · 颠覆传统光纤布线
        </h2>
      </div>

      {/* Main Content Layout */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 36,
        }}
      >
        {/* Left Card: Traditional Fiber Pain Points */}
        <div
          style={{
            flex: 1,
            padding: "32px 28px",
            borderRadius: 20,
            background: "rgba(25, 20, 25, 0.75)",
            border: "1px solid rgba(255, 75, 75, 0.25)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            opacity: compLeftSpring,
            transform: `translateX(${(1 - compLeftSpring) * -40}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              fontWeight: 800,
              color: "#FF6B6B",
              marginBottom: 20,
            }}
          >
            <XCircle size={26} />
            传统入户光纤痛点
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B", fontWeight: 900 }}>✕</span> 预约师傅上门，排期等待数天
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B", fontWeight: 900 }}>✕</span> 墙面打孔走明线，破坏精装结构
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B", fontWeight: 900 }}>✕</span> 租房/搬家拆机移机繁琐，违约金高昂
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.75)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B", fontWeight: 900 }}>✕</span> 商铺/旧小区弱电管井未通光纤
            </div>
          </div>
        </div>

        {/* Center: High-Tech Speed Gauge Dashboard with DigitRoll */}
        <div
          style={{
            width: 530,
            padding: "36px 32px",
            borderRadius: 24,
            background:
              "radial-gradient(circle at top center, rgba(0, 245, 255, 0.16) 0%, rgba(10, 18, 30, 0.95) 75%)",
            border: "1.5px solid rgba(0, 245, 255, 0.5)",
            boxShadow:
              "0 0 60px rgba(0, 245, 255, 0.22), inset 0 0 30px rgba(0, 245, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: speedSpring,
            transform: `scale(${speedSpring})`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#00F5FF",
              letterSpacing: 3,
              marginBottom: 10,
            }}
          >
            REALTIME 5G THROUGHPUT BENCHMARK
          </div>

          {/* Odometer DigitRoll display from video-shotcraft */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: "'Alibaba PuHuiTi', sans-serif",
                fontWeight: 900,
                textShadow: "0 0 35px rgba(0, 245, 255, 0.7)",
              }}
            >
              <DigitRoll
                value="986.5"
                delay={15}
                fontSize={84}
                color="#FFFFFF"
              />
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#00F5FF",
              }}
            >
              Mbps
            </span>
          </div>

          {/* Gradient Progress bar */}
          <div
            style={{
              width: "100%",
              height: 12,
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              marginBottom: 26,
            }}
          >
            <div
              style={{
                width: `${gaugePercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #00F5FF, #38EF7D)",
                boxShadow: "0 0 18px #00F5FF",
              }}
            />
          </div>

          {/* 3 Telemetry Metrics */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "14px 12px",
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 14,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                网络时延
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#38EF7D", marginTop: 4 }}>
                {Math.round(currentPing)} ms
              </div>
            </div>

            <div
              style={{
                padding: "14px 12px",
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 14,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                网络抖动 / 丢包
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#00F5FF", marginTop: 4 }}>
                0.0 %
              </div>
            </div>

            <div
              style={{
                padding: "14px 12px",
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 14,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                并发带机量
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#FFFFFF", marginTop: 4 }}>
                128+ 台
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: 5G CPE Zero-Waiting Advantages */}
        <div
          style={{
            flex: 1,
            padding: "32px 28px",
            borderRadius: 20,
            background: "rgba(10, 25, 35, 0.8)",
            border: "1px solid rgba(56, 239, 125, 0.4)",
            boxShadow: "0 0 30px rgba(56, 239, 125, 0.1)",
            opacity: compRightSpring,
            transform: `translateX(${(1 - compRightSpring) * 40}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              fontWeight: 800,
              color: "#38EF7D",
              marginBottom: 20,
            }}
          >
            <CheckCircle2 size={26} />
            5G 路由终端平替优势
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 900 }}>✓</span> 插电即通网，无需预约漫长装机
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 900 }}>✓</span> 免穿墙打孔，保持墙面极简整洁
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 900 }}>✓</span> 搬家随时拔下带走，自由无契约
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 900 }}>✓</span> 租房、门店、办公室即插即用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
