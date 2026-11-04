import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { Cpu, Wind, Radio, ShieldCheck, Activity } from "lucide-react";

export const Shot2HardwareHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const deviceSpring = spring({ frame, fps, config: { damping: 13, mass: 0.9 } });
  const cardLeftSpring = spring({ frame: frame - 12, fps, config: { damping: 14 } });
  const cardRightSpring = spring({ frame: frame - 22, fps, config: { damping: 14 } });

  // 3D subtle device float
  const floatY = Math.sin(frame / 16) * 9;
  const floatTilt = Math.sin(frame / 22) * 1.8;

  // Dual Scan Bracket Sweep (from shotcraft scan-bracket-sweep recipe)
  const scanSweepY = interpolate(
    (frame * 2.8) % 130,
    [0, 130],
    [-190, 210]
  );

  // Top chimney convection airflow wave
  const airWave = (frame * 2.2) % 50;
  const airOpacity = interpolate(airWave, [0, 25, 50], [0, 0.85, 0]);
  const airY = interpolate(airWave, [0, 50], [0, -50]);

  // LEDs pulsing
  const ledGlow5G = interpolate(Math.sin(frame / 6), [-1, 1], [0.65, 1]);
  const ledGlowWifi = interpolate(Math.sin((frame + 4) / 7), [-1, 1], [0.7, 1]);

  // Exit transition
  const exitOpacity = interpolate(frame, [100, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [100, 110], [1, 0.93], {
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
      {/* Left Column: Industrial Aesthetic & Convection Cooling */}
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
            padding: "6px 18px",
            borderRadius: 16,
            background: "rgba(0, 245, 255, 0.12)",
            border: "1.5px solid rgba(0, 245, 255, 0.35)",
            color: "#00F5FF",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          <Cpu size={18} />
          工业级旗舰形态 · 告别玩具
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
          极简立柱设计
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #00F5FF, #38EF7D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            立体双向对流风道
          </span>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          顶底双环形进排气格栅，依靠烟囱效应形成自然冷热垂直风道。全天候 24 小时满载低温运行，永不因发热而降频降速。
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              borderRadius: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <Wind size={24} color="#00F5FF" />
            <span style={{ fontSize: 17, color: "#E0E8F0", fontWeight: 700 }}>
              顶底双环形立体对流架构
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              background: "rgba(10, 20, 35, 0.8)",
              border: "1px solid rgba(56, 239, 125, 0.25)",
              borderRadius: 14,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <ShieldCheck size={24} color="#38EF7D" />
            <span style={{ fontSize: 17, color: "#E0E8F0", fontWeight: 700 }}>
              恒流专用供电 · 零电池老化膨胀隐患
            </span>
          </div>
        </div>
      </div>

      {/* Center: Spotlight Hero Card + Physical Hardware Model */}
      <div
        style={{
          position: "relative",
          width: 500,
          height: 640,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: deviceSpring,
          transform: `scale(${deviceSpring}) translateY(${(1 - deviceSpring) * 60 + floatY}px) rotate(${floatTilt}deg)`,
          zIndex: 5,
        }}
      >
        {/* Soft Tabletop Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            width: 400,
            height: 70,
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 229, 255, 0.1) 45%, transparent 75%)",
            borderRadius: "50%",
            filter: "blur(14px)",
          }}
        />

        {/* Orbiting Tech Rings */}
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            border: "1.5px dashed rgba(0, 229, 255, 0.3)",
            transform: `rotate(${frame * 0.45}deg)`,
          }}
        />

        {/* Physical Device Image Container */}
        <div
          style={{
            position: "relative",
            width: 380,
            height: 540,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("cpe_device.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))",
            }}
          />

          {/* Realtime Status LEDs Overlaid Exactly */}
          {/* 5G Status LED */}
          <div
            style={{
              position: "absolute",
              top: "47%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#00F5FF",
              boxShadow: `0 0 12px 5px rgba(0, 245, 255, ${ledGlow5G * 0.95}), 0 0 24px 10px rgba(0, 229, 255, 0.5)`,
            }}
          />

          {/* Wi-Fi 6 LED */}
          <div
            style={{
              position: "absolute",
              top: "56.5%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#38EF7D",
              boxShadow: `0 0 10px 4px rgba(56, 239, 125, ${ledGlowWifi * 0.9})`,
            }}
          />

          {/* Power LED */}
          <div
            style={{
              position: "absolute",
              top: "61.2%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#00F5FF",
              boxShadow: "0 0 8px 3px rgba(0, 245, 255, 0.8)",
            }}
          />

          {/* Chimney Convection Airflow Rings */}
          <div
            style={{
              position: "absolute",
              top: 50,
              left: "50%",
              transform: `translateX(-50%) translateY(${airY}px)`,
              width: 150,
              height: 24,
              border: "2px solid rgba(0, 245, 255, 0.8)",
              borderRadius: "50%",
              opacity: airOpacity,
              filter: "blur(0.8px)",
            }}
          />

          {/* Scanline Sweep with HUD Bracket Callouts */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10%",
              width: "80%",
              height: 2.5,
              background:
                "linear-gradient(90deg, transparent 0%, #00F5FF 50%, transparent 100%)",
              boxShadow: "0 0 18px 5px rgba(0, 245, 255, 0.85)",
              transform: `translateY(${scanSweepY}px)`,
              opacity: 0.9,
            }}
          />
        </div>
      </div>

      {/* Right Column: Status Telemetry HUD Cards */}
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
            padding: "6px 18px",
            borderRadius: 16,
            background: "rgba(56, 239, 125, 0.12)",
            border: "1.5px solid rgba(56, 239, 125, 0.35)",
            color: "#38EF7D",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          <Radio size={18} />
          硬件状态监测 HUD
        </div>

        <h3
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#FFFFFF",
            marginBottom: 20,
          }}
        >
          四维指示灯 · 实时状态感知
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Item 1 */}
          <div
            style={{
              padding: "18px 22px",
              background: "rgba(10, 20, 35, 0.85)",
              border: "1px solid rgba(0, 245, 255, 0.3)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
                5G 全频段多天线模组
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)", marginTop: 2 }}>
                Sub-6GHz / SA+NSA 全网聚合
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#00F5FF",
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(0, 245, 255, 0.15)",
                border: "1px solid rgba(0, 245, 255, 0.4)",
              }}
            >
              满格极速
            </span>
          </div>

          {/* Item 2 */}
          <div
            style={{
              padding: "18px 22px",
              background: "rgba(10, 20, 35, 0.85)",
              border: "1px solid rgba(56, 239, 125, 0.3)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
                Wi-Fi 6 全向高增益天线
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)", marginTop: 2 }}>
                OFDMA + 160MHz 大频宽全屋覆盖
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#38EF7D",
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(56, 239, 125, 0.15)",
                border: "1px solid rgba(56, 239, 125, 0.4)",
              }}
            >
              穿墙覆盖
            </span>
          </div>

          {/* Item 3 */}
          <div
            style={{
              padding: "18px 22px",
              background: "rgba(10, 20, 35, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
                恒流供电稳压引擎
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)", marginTop: 2 }}>
                插上电源立即工作，开机即满血
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#FFFFFF",
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
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
