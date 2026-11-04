import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { TrendingUp, Zap, Thermometer, Wifi } from "lucide-react";

interface CpeMetricCardsProps {
  startFrame?: number;
}

export const CpeMetricCards: React.FC<CpeMetricCardsProps> = ({
  startFrame = 12,
}) => {
  const frame = useCurrentFrame();

  // Progress for counting numbers
  const rollProgress = interpolate(frame - startFrame, [0, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const download = (986.5 * rollProgress).toFixed(1);
  const upload = (185.0 * rollProgress).toFixed(1);
  const ping = (68.0 - (68.0 - 8.2) * rollProgress).toFixed(1);
  const temp = (25.0 + (36.8 - 25.0) * rollProgress).toFixed(1);

  return (
    <div
      style={{
        width: 760,
        height: 140,
        backgroundColor: "rgba(10, 14, 20, 0.88)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        padding: "14px 18px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Box Header Label */}
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
          测试数据
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#99A4B5",
          }}
        >
          「data」
        </span>
      </div>

      {/* 4-Columns Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          padding: "0 8px",
        }}
      >
        {/* Metric 1: 平均下行 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={16} color="#00F5FF" />
            <span style={{ fontSize: 13, color: "#99A4B5", fontWeight: 600 }}>
              平均下行速率
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -0.5,
              }}
            >
              {download}
            </span>
            <span style={{ fontSize: 13, color: "#00F5FF", fontWeight: 800 }}>
              Mbps
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 48, backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

        {/* Metric 2: 平均上行 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={16} color="#00E5FF" />
            <span style={{ fontSize: 13, color: "#99A4B5", fontWeight: 600 }}>
              平均上行速率
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -0.5,
              }}
            >
              {upload}
            </span>
            <span style={{ fontSize: 13, color: "#00E5FF", fontWeight: 800 }}>
              Mbps
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 48, backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

        {/* Metric 3: 竞技时延 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={16} color="#38EF7D" />
            <span style={{ fontSize: 13, color: "#99A4B5", fontWeight: 600 }}>
              竞技实测时延
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -0.5,
              }}
            >
              {ping}
            </span>
            <span style={{ fontSize: 13, color: "#38EF7D", fontWeight: 800 }}>
              ms
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 48, backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

        {/* Metric 4: 机身最高温 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Thermometer size={16} color="#FFB300" />
            <span style={{ fontSize: 13, color: "#99A4B5", fontWeight: 600 }}>
              机身最高温度
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: -0.5,
              }}
            >
              {temp}
            </span>
            <span style={{ fontSize: 13, color: "#FFB300", fontWeight: 800 }}>
              ℃
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
