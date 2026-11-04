import React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  Img,
} from "remotion";
import { Thermometer, Monitor, Swords, Clock } from "lucide-react";

interface MiddleSectionProps {
  startFrame?: number;
}

export const MiddleSection: React.FC<MiddleSectionProps> = ({
  startFrame = 20,
}) => {
  const frame = useCurrentFrame();

  // Scanning light bar over game preview
  const scanY = interpolate(
    (frame * 2.2) % 100,
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
      {/* Top Card: 测试标准条件 */}
      <div
        style={{
          width: "100%",
          height: 220,
          backgroundColor: "rgba(10, 14, 20, 0.85)",
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
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            「standard」
          </span>
        </div>

        {/* Condition list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Thermometer size={18} color="#FF5C93" />
            <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>环境温度:</span>
            <span style={{ fontWeight: 700 }}>25±0.5℃</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Monitor size={18} color="#00F5FF" />
            <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>游戏画质:</span>
            <span style={{ fontWeight: 700 }}>极致画质 185帧</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Swords size={18} color="#FF5C93" />
            <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>测试场景:</span>
            <span style={{ fontWeight: 700 }}>全面战场战斗</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={18} color="#00F5FF" />
            <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>测试时长:</span>
            <span style={{ fontWeight: 700 }}>30min</span>
          </div>
        </div>
      </div>

      {/* Bottom Card: 游戏实测画面 */}
      <div
        style={{
          width: "100%",
          height: 285,
          backgroundColor: "rgba(10, 14, 20, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
            游戏实测画面
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            「route」
          </span>
        </div>

        {/* Game screenshot container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            flex: 1,
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Img
            src={staticFile("game_preview_hd.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "auto",
            }}
          />

          {/* Realtime Scanline Light bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #00F5FF 50%, transparent 100%)",
              boxShadow: "0 0 14px 3px rgba(0, 245, 255, 0.85)",
              transform: `translateY(${scanY}px)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
