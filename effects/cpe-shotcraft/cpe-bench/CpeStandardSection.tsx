import React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  Img,
} from "remotion";
import { Thermometer, Radio, Wifi, Clock, Activity, ShieldCheck } from "lucide-react";

export const CpeStandardSection: React.FC = () => {
  const frame = useCurrentFrame();

  // Scanning light bar over game preview
  const scanY = interpolate(
    (frame * 2.4) % 100,
    [0, 100],
    [-20, 220]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 380,
      }}
    >
      {/* Top Card: 测试标准条件 「standard」 */}
      <div
        style={{
          width: "100%",
          height: 220,
          backgroundColor: "rgba(10, 14, 20, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1,
            }}
          >
            测试标准条件
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#99A4B5",
            }}
          >
            「standard」
          </span>
        </div>

        {/* 4 Conditions List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 11,
          }}
        >
          {/* 1. 环境温度 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Thermometer size={18} color="#FF7B90" strokeWidth={2.2} />
            <span style={{ fontSize: 15, color: "#99A4B5", fontWeight: 500 }}>
              环境温度：
            </span>
            <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 700 }}>
              25±0.5℃
            </span>
          </div>

          {/* 2. 网络制式 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Radio size={18} color="#70B2FF" strokeWidth={2.2} />
            <span style={{ fontSize: 15, color: "#99A4B5", fontWeight: 500 }}>
              网络制式：
            </span>
            <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 700 }}>
              5G SA 全千兆频段
            </span>
          </div>

          {/* 3. 并发负载 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Wifi size={18} color="#00F5FF" strokeWidth={2.2} />
            <span style={{ fontSize: 15, color: "#99A4B5", fontWeight: 500 }}>
              接入终端：
            </span>
            <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 700 }}>
              64 台设备极限并发
            </span>
          </div>

          {/* 4. 测试时长 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={18} color="#FFA000" strokeWidth={2.2} />
            <span style={{ fontSize: 15, color: "#99A4B5", fontWeight: 500 }}>
              测试时长：
            </span>
            <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 700 }}>
              24h 连续压测
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Card: 实测场景画面 「route」 */}
      <div
        style={{
          width: "100%",
          height: 284,
          backgroundColor: "rgba(10, 14, 20, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1,
            }}
          >
            网络实测画面
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#99A4B5",
            }}
          >
            「route」
          </span>
        </div>

        {/* Game Screenshot Frame with Overlays */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 195,
            borderRadius: 6,
            overflow: "hidden",
            backgroundColor: "#000000",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Img
            src={staticFile("game_preview_hd.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Scanning radar light */}
          <div
            style={{
              position: "absolute",
              top: scanY,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "#00F5FF",
              boxShadow: "0 0 10px 3px rgba(0, 245, 255, 0.8)",
            }}
          />

          {/* Subtitle Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 10,
              right: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(5, 8, 14, 0.82)",
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid rgba(0, 245, 255, 0.3)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              三角洲行动 · 8.2ms 电竞对战
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#38EF7D",
              }}
            >
              0 丢包
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
