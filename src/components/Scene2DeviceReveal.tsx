import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DeviceModel } from "./DeviceModel";
import { Cpu, Wind, Radio, ShieldCheck } from "lucide-react";

export const Scene2DeviceReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for device
  const deviceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  // Callout cards entrance
  const cardLeftSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14 },
  });

  const cardRightSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14 },
  });

  // Exit transition
  const exitOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [105, 120], [1, 0.92], {
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
        justifyContent: "space-between",
        padding: "0 100px",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      {/* Left Column: Industrial Aesthetic & Hardware Highlights */}
      <div
        style={{
          width: 440,
          opacity: cardLeftSpring,
          transform: `translateX(${(1 - cardLeftSpring) * -60}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 16,
            background: "rgba(0, 245, 255, 0.1)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            color: "#00F5FF",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          <Cpu size={18} />
          工业级旗舰形态
        </div>

        <h2
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
            lineHeight: 1.25,
            marginBottom: 20,
          }}
        >
          极简柱体设计
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00F5FF, #38EF7D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            立体对流风道
          </span>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          告别便携随身 WiFi 的狭小发热机身。采用顶底双向烟囱对流格栅，全天候 24 小时满载低温运行，拒绝降速断连。
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              backdropFilter: "blur(10px)",
            }}
          >
            <Wind size={22} color="#00F5FF" />
            <span style={{ fontSize: 16, color: "#E0E8F0", fontWeight: 500 }}>
              顶底双环形进排气散热架构
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              backdropFilter: "blur(10px)",
            }}
          >
            <ShieldCheck size={22} color="#38EF7D" />
            <span style={{ fontSize: 16, color: "#E0E8F0", fontWeight: 500 }}>
              独立供电方案 · 无电池衰减膨胀风险
            </span>
          </div>
        </div>
      </div>

      {/* Center: Device Model with Scanning Laser */}
      <div
        style={{
          opacity: deviceSpring,
          transform: `scale(${deviceSpring}) translateY(${(1 - deviceSpring) * 60}px)`,
          zIndex: 5,
        }}
      >
        <DeviceModel
          scale={1.25}
          showScanningLine={true}
          showAura={true}
          activeLeds={true}
        />
      </div>

      {/* Right Column: Status Telemetry HUD */}
      <div
        style={{
          width: 440,
          opacity: cardRightSpring,
          transform: `translateX(${(1 - cardRightSpring) * 60}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 16,
            background: "rgba(56, 239, 125, 0.1)",
            border: "1px solid rgba(56, 239, 125, 0.3)",
            color: "#38EF7D",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          <Radio size={18} />
          硬件状态监测
        </div>

        <h3
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: 20,
          }}
        >
          四维指示灯 · 实时状态感知
        </h3>

        {/* LED HUD List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Item 1 */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(10, 20, 35, 0.75)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
                5G 全频段多天线模组
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", marginTop: 2 }}>
                Sub-6GHz / SA+NSA 双模自适应
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#00F5FF",
                padding: "4px 12px",
                borderRadius: 8,
                background: "rgba(0, 245, 255, 0.15)",
              }}
            >
              满格极速
            </span>
          </div>

          {/* Item 2 */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(10, 20, 35, 0.75)",
              border: "1px solid rgba(56, 239, 125, 0.25)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
                Wi-Fi 全向高增益天线
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", marginTop: 2 }}>
                OFDMA + 160MHz 大频宽全屋覆盖
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#38EF7D",
                padding: "4px 12px",
                borderRadius: 8,
                background: "rgba(56, 239, 125, 0.15)",
              }}
            >
              低时延覆盖
            </span>
          </div>

          {/* Item 3 */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(10, 20, 35, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
                恒流供电稳压引擎
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.6)", marginTop: 2 }}>
                插上电源立即工作，开机即满血
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                padding: "4px 12px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.1)",
              }}
            >
              插电即用
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
