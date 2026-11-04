import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { TrendingUp, TrendingDown, Zap, Thermometer } from "lucide-react";

interface MetricCardsProps {
  startFrame?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  startFrame = 40,
}) => {
  const frame = useCurrentFrame();

  // Progress for counting numbers
  const rollProgress = interpolate(frame - startFrame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const fps = (184.9 * rollProgress).toFixed(1);
  const lowFps = (176.0 * rollProgress).toFixed(1);
  const power = (5.9 * rollProgress).toFixed(1);
  const temp = (25.0 + (40.2 - 25.0) * rollProgress).toFixed(1);

  return (
    <div
      style={{
        width: 760,
        height: 140,
        backgroundColor: "rgba(10, 14, 20, 0.85)",
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
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          「data」
        </span>
      </div>

      {/* 4 Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Metric 1: 平均帧率 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            paddingRight: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            <TrendingUp size={15} color="#00F5FF" />
            平均帧率
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {fps}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 4,
            }}
          >
            FPS
          </div>
        </div>

        {/* Metric 2: 1%Low帧 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            paddingRight: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            <TrendingDown size={15} color="#FFA000" />
            1%Low帧
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {lowFps}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 4,
            }}
          >
            FPS
          </div>
        </div>

        {/* Metric 3: 平均功耗 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            paddingRight: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            <Zap size={15} color="#00F5FF" />
            平均功耗
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {power}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 4,
            }}
          >
            W
          </div>
        </div>

        {/* Metric 4: 机身最高温度 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            <Thermometer size={15} color="#FF5252" />
            机身最高温度
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {temp}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.5)",
              marginTop: 4,
            }}
          >
            ℃
          </div>
        </div>
      </div>
    </div>
  );
};
