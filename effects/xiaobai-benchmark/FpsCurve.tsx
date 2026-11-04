import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface FpsCurveProps {
  startFrame?: number;
  duration?: number;
}

export const FpsCurve: React.FC<FpsCurveProps> = ({
  startFrame = 75,
  duration = 100,
}) => {
  const frame = useCurrentFrame();

  const width = 760;
  const height = 370;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Generate 120 points mimicking the 30-min test curve
  const points = useMemo(() => {
    const pts: { x: number; y: number; fps: number }[] = [];
    const count = 120;
    for (let i = 0; i <= count; i++) {
      const xRatio = i / count;
      const x = paddingLeft + xRatio * chartW;

      const noise =
        Math.sin(i * 1.7) * 0.4 +
        Math.cos(i * 3.1) * 0.3 +
        Math.sin(i * 7.9) * 0.2;

      let fps = 184.9 + noise;
      if (i === 48 || i === 49) fps = 178.5;
      if (i === 88 || i === 89) fps = 176.2;
      if (i === 105) fps = 180.1;
      if (fps > 185) fps = 185;

      const yRatio = (fps - 0) / 185;
      const y = paddingTop + (1 - yRatio) * chartH;
      pts.push({ x, y, fps });
    }
    return pts;
  }, [chartW, chartH, paddingLeft, paddingTop]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
    }
    return d;
  }, [points]);

  const totalLength = chartW * 1.05;

  const drawProgress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.8, 0.3, 1),
    }
  );

  const strokeDashoffset = totalLength * (1 - drawProgress);

  const currentIndex = Math.min(
    points.length - 1,
    Math.floor(drawProgress * (points.length - 1))
  );
  const currentPoint = points[currentIndex] || points[0];

  const headPulse = interpolate(
    Math.sin(frame / 4),
    [-1, 1],
    [4, 8]
  );

  const yTicks = [185, 148, 111, 74, 37, 0];
  const xTicks = [0, 5, 10, 16, 20, 25, 30];

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "rgba(10, 14, 20, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Box Header Label */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 16,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          zIndex: 10,
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
          帧率曲线
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          「curve」
        </span>
      </div>

      {/* Delta Action Watermark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <svg width="54" height="54" viewBox="0 0 100 100">
          <polygon
            points="50,15 90,85 10,85"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="8"
          />
          <polygon points="50,38 72,78 28,78" fill="#00E5FF" />
        </svg>
        <span
          style={{
            fontSize: 34,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
          }}
        >
          三角洲行动
        </span>
      </div>

      {/* SVG Canvas for Axes, Grid, and Curve */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Horizontal Grid Lines & Y-axis Labels */}
        {yTicks.map((val) => {
          const yPos = paddingTop + (1 - val / 185) * chartH;
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={width - paddingRight}
                y2={yPos}
                stroke={val === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"}
                strokeWidth={val === 0 ? 1.5 : 0.8}
                strokeDasharray={val === 0 ? "none" : "2 3"}
              />
              <text
                x={paddingLeft - 8}
                y={yPos + 4}
                textAnchor="end"
                fontSize={13}
                fontWeight={500}
                fill="rgba(255,255,255,0.6)"
                fontFamily="'Alibaba PuHuiTi', sans-serif"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X-axis Labels */}
        {xTicks.map((min, idx) => {
          const xPos = paddingLeft + (idx / (xTicks.length - 1)) * chartW;
          return (
            <g key={min}>
              <line
                x1={xPos}
                y1={paddingTop}
                x2={xPos}
                y2={height - paddingBottom}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.8}
              />
              <text
                x={xPos}
                y={height - paddingBottom + 20}
                textAnchor="middle"
                fontSize={13}
                fontWeight={500}
                fill="rgba(255,255,255,0.6)"
                fontFamily="'Alibaba PuHuiTi', sans-serif"
              >
                {min}
              </text>
            </g>
          );
        })}

        {/* Time Axis Unit Label */}
        <text
          x={width / 2 + 10}
          y={height - 10}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill="rgba(255,255,255,0.7)"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          时间/min
        </text>

        {/* Animated Golden Frame Rate Curve */}
        {drawProgress > 0 && (
          <>
            {/* Glow underlay */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255, 213, 79, 0.4)"
              strokeWidth={6}
              strokeDasharray={totalLength}
              strokeDashoffset={strokeDashoffset}
              filter="blur(3px)"
            />
            {/* Main razor sharp curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#FFD54F"
              strokeWidth={2.4}
              strokeDasharray={totalLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Live Tracker Head Point */}
        {drawProgress > 0 && drawProgress < 1 && (
          <g transform={`translate(${currentPoint.x}, ${currentPoint.y})`}>
            {/* Outer pulse circle */}
            <circle
              r={headPulse}
              fill="none"
              stroke="#FFD54F"
              strokeWidth={2}
              opacity={0.9}
            />
            {/* Center solid dot */}
            <circle r={3} fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
