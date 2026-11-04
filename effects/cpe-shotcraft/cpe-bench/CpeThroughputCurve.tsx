import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface CpeThroughputCurveProps {
  startFrame?: number;
  duration?: number;
}

export const CpeThroughputCurve: React.FC<CpeThroughputCurveProps> = ({
  startFrame = 18,
  duration = 65,
}) => {
  const frame = useCurrentFrame();

  const width = 760;
  const height = 370;
  const paddingLeft = 46;
  const paddingRight = 24;
  const paddingTop = 22;
  const paddingBottom = 42;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // 120 deterministic points for 5G CPE (steady 986.5 Mbps)
  const cpePoints = useMemo(() => {
    const pts: { x: number; y: number; mbps: number }[] = [];
    const count = 120;
    for (let i = 0; i <= count; i++) {
      const xRatio = i / count;
      const x = paddingLeft + xRatio * chartW;

      // Minor micro-jitter simulating real gigabit fiber stability
      const jitter =
        Math.sin(i * 2.1) * 1.5 +
        Math.cos(i * 3.7) * 1.0 +
        Math.sin(i * 7.3) * 0.8;

      const mbps = Math.min(1000, 986.5 + jitter);
      const yRatio = mbps / 1000;
      const y = paddingTop + (1 - yRatio) * chartH;
      pts.push({ x, y, mbps });
    }
    return pts;
  }, [chartW, chartH, paddingLeft, paddingTop]);

  // Points for traditional portable WiFi (severe throttling and dropouts)
  const wifiPoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const count = 120;
    for (let i = 0; i <= count; i++) {
      const xRatio = i / count;
      const x = paddingLeft + xRatio * chartW;

      let mbps = 60;
      if (i < 15) {
        mbps = 65 - i * 2.5;
      } else if (i < 40) {
        mbps = 32 + Math.sin(i * 1.5) * 14;
      } else if (i < 65) {
        mbps = 22 + Math.cos(i * 2.2) * 10;
      } else if (i < 85) {
        mbps = i % 8 === 0 ? 8 : 24;
      } else {
        mbps = 18 + Math.sin(i) * 6;
      }

      mbps = Math.max(12, Math.min(100, mbps)); // Ensure strictly above zero axis
      const yRatio = mbps / 1000;
      const y = paddingTop + (1 - yRatio) * chartH;
      pts.push({ x, y });
    }
    return pts;
  }, [chartW, chartH, paddingLeft, paddingTop]);

  const cpePathD = useMemo(() => {
    if (cpePoints.length === 0) return "";
    let d = `M ${cpePoints[0].x.toFixed(1)} ${cpePoints[0].y.toFixed(1)}`;
    for (let i = 1; i < cpePoints.length; i++) {
      d += ` L ${cpePoints[i].x.toFixed(1)} ${cpePoints[i].y.toFixed(1)}`;
    }
    return d;
  }, [cpePoints]);

  const wifiPathD = useMemo(() => {
    if (wifiPoints.length === 0) return "";
    let d = `M ${wifiPoints[0].x.toFixed(1)} ${wifiPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < wifiPoints.length; i++) {
      d += ` L ${wifiPoints[i].x.toFixed(1)} ${wifiPoints[i].y.toFixed(1)}`;
    }
    return d;
  }, [wifiPoints]);

  const totalLength = chartW * 1.05;

  // Draw progress with easeOut
  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const strokeDashoffset = totalLength * (1 - progress);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "rgba(10, 14, 20, 0.88)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        padding: "12px 18px",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Box Header Label & Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            速率稳定性曲线
          </span>
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#99A4B5",
              whiteSpace: "nowrap",
            }}
          >
            「curve」
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 3, backgroundColor: "#00F5FF", borderRadius: 2 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#00F5FF", whiteSpace: "nowrap" }}>
              5G CPE 极稳千兆 (986.5M)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 14,
                height: 2,
                borderTop: "2px dashed rgba(255, 92, 92, 0.7)",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255, 120, 120, 0.8)", whiteSpace: "nowrap" }}>
              随身WiFi (断流均值18M)
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div style={{ position: "relative", width: "100%", height: chartH + 28 }}>
        <svg width={width - 36} height={chartH + 28}>
          <defs>
            <linearGradient id="cpeCurveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="60%" stopColor="#38EF7D" />
              <stop offset="100%" stopColor="#00F5FF" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[1000, 750, 500, 250, 0].map((val) => {
            const y = paddingTop + (1 - val / 1000) * chartH;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - 36 - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "none" : "3,3"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#7A8799"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical Time Grid Ticks */}
          {[0, 5, 10, 15, 20, 25, 30].map((minute) => {
            const x = paddingLeft + (minute / 30) * chartW;
            return (
              <g key={minute}>
                <line
                  x1={x}
                  y1={paddingTop + chartH}
                  x2={x}
                  y2={paddingTop + chartH + 4}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + chartH + 16}
                  fill="#7A8799"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {minute}
                </text>
              </g>
            );
          })}

          {/* Time axis label */}
          <text
            x={paddingLeft + chartW / 2}
            y={paddingTop + chartH + 26}
            fill="#99A4B5"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            持续压测时间 / min
          </text>

          {/* Contrast WiFi Curve (Dashed red line showing failure) */}
          <path
            d={wifiPathD}
            fill="none"
            stroke="rgba(255, 80, 80, 0.55)"
            strokeWidth="1.8"
            strokeDasharray="4,4"
          />

          {/* 5G CPE Hero Gigabit Line (Solid Cyan/Green with dynamic draw) */}
          <path
            d={cpePathD}
            fill="none"
            stroke="url(#cpeCurveGlow)"
            strokeWidth="2.8"
            strokeDasharray={totalLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(0, 245, 255, 0.8))"
          />
        </svg>

        {/* Live Head Point Pulse Indicator */}
        {progress > 0.05 && progress < 0.98 && (
          <div
            style={{
              position: "absolute",
              left: paddingLeft + chartW * progress - 5,
              top: paddingTop + (1 - 986.5 / 1000) * chartH - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 10px 4px #00F5FF, 0 0 20px 8px rgba(0, 245, 255, 0.6)",
            }}
          />
        )}
      </div>
    </div>
  );
};
