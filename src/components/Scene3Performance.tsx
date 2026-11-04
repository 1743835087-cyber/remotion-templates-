import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Gauge, ArrowUpRight, CheckCircle2, XCircle, Activity } from "lucide-react";

export const Scene3Performance: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const headerSpring = spring({ frame, fps, config: { damping: 14 } });
  const speedSpring = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const comparisonSpring = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  // Speed odometer counter interpolation (from 0 to 986.5 Mbps)
  const currentSpeed = interpolate(frame, [15, 65], [0, 986.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Ping latency counter (drops from 78ms to 8ms)
  const currentPing = interpolate(frame, [15, 55], [78, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Gauge bar fill percentage
  const gaugePercent = interpolate(frame, [15, 65], [0, 92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [105, 120], [1, 0.95], {
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
        padding: "0 100px",
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
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
            borderRadius: 20,
            background: "rgba(0, 245, 255, 0.1)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            color: "#00F5FF",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <Gauge size={18} />
          光纤级真千兆平替
        </div>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 3,
          }}
        >
          插电即千兆 · 颠覆传统布线
        </h2>
      </div>

      {/* Main Content: Middle Speed Dashboard + Two Contrast Wings */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
        }}
      >
        {/* Left Card: Traditional Fiber Pain Points */}
        <div
          style={{
            flex: 1,
            padding: "32px 28px",
            borderRadius: 20,
            background: "rgba(25, 20, 25, 0.6)",
            border: "1px solid rgba(255, 75, 75, 0.2)",
            opacity: comparisonSpring,
            transform: `translateX(${(1 - comparisonSpring) * -40}px)`,
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
            <XCircle size={24} />
            传统入户光纤痛点
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B" }}>✕</span> 预约师傅上门，等待数天
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B" }}>✕</span> 墙面打孔、踢脚线走明线破坏装修
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B" }}>✕</span> 租房/搬家移机困难，巨额违约金
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
              <span style={{ color: "#FF6B6B" }}>✕</span> 偏远小区/商铺光纤资源未覆盖
            </div>
          </div>
        </div>

        {/* Center: High-Tech Speed Gauge Dashboard */}
        <div
          style={{
            width: 520,
            padding: "36px 32px",
            borderRadius: 24,
            background:
              "radial-gradient(circle at top center, rgba(0, 245, 255, 0.15) 0%, rgba(10, 18, 30, 0.9) 70%)",
            border: "1px solid rgba(0, 245, 255, 0.4)",
            boxShadow:
              "0 0 50px rgba(0, 245, 255, 0.18), inset 0 0 30px rgba(0, 245, 255, 0.08)",
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
              fontWeight: 700,
              color: "#00F5FF",
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            REALTIME 5G THROUGHPUT
          </div>

          {/* Speed Counter Value */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 88,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                textShadow: "0 0 30px rgba(0, 245, 255, 0.6)",
              }}
            >
              {currentSpeed.toFixed(1)}
            </span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#00F5FF",
              }}
            >
              Mbps
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: `${gaugePercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #00F5FF, #38EF7D)",
                boxShadow: "0 0 15px #00F5FF",
              }}
            />
          </div>

          {/* Key Metrics Row */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 10px",
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                网络延迟
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#38EF7D", marginTop: 4 }}>
                {Math.round(currentPing)} ms
              </div>
            </div>

            <div
              style={{
                padding: "12px 10px",
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                丢包率
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#00F5FF", marginTop: 4 }}>
                0.0 %
              </div>
            </div>

            <div
              style={{
                padding: "12px 10px",
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                并发带机量
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF", marginTop: 4 }}>
                128+ 台
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: 5G CPE Advantages */}
        <div
          style={{
            flex: 1,
            padding: "32px 28px",
            borderRadius: 20,
            background: "rgba(10, 25, 35, 0.7)",
            border: "1px solid rgba(56, 239, 125, 0.35)",
            boxShadow: "0 0 25px rgba(56, 239, 125, 0.08)",
            opacity: comparisonSpring,
            transform: `translateX(${(1 - comparisonSpring) * 40}px)`,
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
            <CheckCircle2 size={24} />
            5G 路由终端平替优势
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 700 }}>✓</span> 插电即通网，无需等待预约装机
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 700 }}>✓</span> 免穿墙打孔，保持空间极简美观
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 700 }}>✓</span> 搬家随时拔下带走，自由无契约
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#FFFFFF", fontSize: 16 }}>
              <span style={{ color: "#38EF7D", fontWeight: 700 }}>✓</span> 无论租房、门店、办公室即插即用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
