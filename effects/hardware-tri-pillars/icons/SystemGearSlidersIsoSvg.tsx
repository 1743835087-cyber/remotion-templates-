import React from "react";
import { interpolate, spring } from "remotion";

export const SystemGearSlidersIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  // Sliders entrance
  const railsSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.85 },
  });

  // Central Gear pops in with rotation
  const gearSpring = spring({
    frame: Math.max(0, localFrame - 7),
    fps,
    config: { damping: 12, stiffness: 105, mass: 0.9 },
  });

  // Gear continuous rotation + initial snap rotation
  const gearAngle =
    interpolate(gearSpring, [0, 1], [-55, 0]) + Math.sin(frame / 28) * 14 + localFrame * 0.28;

  // Dynamic slider knob positions (animated tuning motion settling near original reference positions)
  const knobSlide1 =
    interpolate(railsSpring, [0, 1], [115, 232]) + Math.sin((frame + 5) / 18) * 8;
  const knobSlide2 =
    interpolate(railsSpring, [0, 1], [240, 134]) + Math.cos((frame + 12) / 20) * 7;
  const knobSlide3 =
    interpolate(railsSpring, [0, 1], [140, 260]) + Math.sin((frame + 22) / 16) * 8;
  const knobSlide4 =
    interpolate(railsSpring, [0, 1], [250, 146]) + Math.cos((frame + 30) / 19) * 7;

  // Generate 10-tooth gear polygon points
  const numTeeth = 10;
  const rOuter = 82;
  const rRoot = 62;
  const buildGearPath = (cx: number, cy: number, angleDeg: number) => {
    const radOffset = (angleDeg * Math.PI) / 180;
    const pts: string[] = [];
    for (let i = 0; i < numTeeth; i++) {
      const base = (i * 2 * Math.PI) / numTeeth + radOffset;
      const step = (2 * Math.PI) / numTeeth;
      const a1 = base - step * 0.32;
      const a2 = base - step * 0.18;
      const a3 = base + step * 0.18;
      const a4 = base + step * 0.32;

      pts.push(
        `${(cx + rRoot * Math.cos(a1)).toFixed(1)},${(cy + rRoot * Math.sin(a1)).toFixed(1)}`,
        `${(cx + rOuter * Math.cos(a2)).toFixed(1)},${(cy + rOuter * Math.sin(a2)).toFixed(1)}`,
        `${(cx + rOuter * Math.cos(a3)).toFixed(1)},${(cy + rOuter * Math.sin(a3)).toFixed(1)}`,
        `${(cx + rRoot * Math.cos(a4)).toFixed(1)},${(cy + rRoot * Math.sin(a4)).toFixed(1)}`
      );
    }
    return `M ${pts.join(" L ")} Z`;
  };

  const gearCx = 186;
  const gearCy = 212;
  const frontGearPath = buildGearPath(gearCx, gearCy, gearAngle);
  const backGearPath = buildGearPath(gearCx + 12, gearCy + 9, gearAngle);

  // Slider rail helper
  const rails = [
    { y: 88, knobX: knobSlide1, arcColor: "#EE8B26", arcRot: -35 },
    { y: 146, knobX: knobSlide2, arcColor: "#38B6E8", arcRot: 140 },
    { y: 274, knobX: knobSlide3, arcColor: "#38B6E8", arcRot: 45 },
    { y: 332, knobX: knobSlide4, arcColor: "#EE8B26", arcRot: -110 },
  ];

  // Neon cyan glow intensity on bottom rail
  const bottomGlowOpacity = interpolate(Math.sin(frame / 10), [-1, 1], [0.65, 1]);

  return (
    <svg
      viewBox="0 0 380 430"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        filter: "drop-shadow(0px 18px 28px rgba(0,0,0,0.75))",
      }}
    >
      <defs>
        <pattern
          id="rail-hatch"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke="#36404A" strokeWidth="2.2" opacity="0.45" />
        </pattern>
        <pattern
          id="gear-dots"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.8" cy="1.8" r="0.9" fill="#182028" opacity="0.45" />
        </pattern>
        <linearGradient id="rail-metal-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#CFD8E0" />
          <stop offset="50%" stopColor="#9BA6B2" />
          <stop offset="100%" stopColor="#707B88" />
        </linearGradient>
        <linearGradient id="gear-metal-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2F6FA" />
          <stop offset="45%" stopColor="#C2CCD6" />
          <stop offset="100%" stopColor="#7C8794" />
        </linearGradient>
        <filter id="cyan-neon-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ============================================================
          1. FOUR HORIZONTAL 3D SLIDER RAILS & KNOBS
         ============================================================ */}
      {rails.map((rail, idx) => {
        const stagger = spring({
          frame: Math.max(0, localFrame - idx * 3),
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        // Rail 1 & 2 sit behind/above gear, Rail 3 & 4 sit below
        return (
          <g
            key={idx}
            transform={`translate(${(1 - stagger) * (idx % 2 === 0 ? -40 : 40)}, 0)`}
            style={{ opacity: stagger }}
          >
            {/* 3D Extruded Dark Metallic Shadow Backing of Rail */}
            <rect
              x="76"
              y={rail.y + 5}
              width="234"
              height="26"
              rx="13"
              fill="#3F4854"
              stroke="#05070A"
              strokeWidth="5.5"
            />

            {/* Main Brushed Silver Pill Rail */}
            <rect
              x="68"
              y={rail.y}
              width="234"
              height="26"
              rx="13"
              fill="url(#rail-metal-front)"
              stroke="#05070A"
              strokeWidth="5.5"
            />

            {/* Inner Textured Slot Groove */}
            <rect
              x="78"
              y={rail.y + 5}
              width="214"
              height="16"
              rx="8"
              fill="url(#rail-hatch)"
              stroke="#495462"
              strokeWidth="1.5"
            />

            {/* Crisp White Top Highlight on Rail */}
            <line
              x1="82"
              y1={rail.y + 3.5}
              x2="286"
              y2={rail.y + 3.5}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Bottom-Right Neon Blue Highlight Bar on 4th Rail (Authentic to Reference) */}
            {idx === 3 && (
              <g opacity={bottomGlowOpacity} filter="url(#cyan-neon-glow)">
                <path
                  d={`M 218 ${rail.y + 28} L 292 ${rail.y + 28} C 302 ${rail.y + 28}, 307 ${
                    rail.y + 20
                  }, 307 ${rail.y + 12}`}
                  fill="none"
                  stroke="#38B6FF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <line
                  x1="224"
                  y1={rail.y + 28}
                  x2="288"
                  y2={rail.y + 28}
                  stroke="#B8E8FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 3D Cylindrical Knob on Rail */}
            <g transform={`translate(${rail.knobX}, ${rail.y + 13})`}>
              {/* 3D Side Cylinder Extrusion of Knob */}
              <circle
                cx="6"
                cy="3"
                r="19"
                fill="#181E26"
                stroke="#05070A"
                strokeWidth="5"
              />
              {/* Main Dark Metallic Knob Face */}
              <circle
                cx="0"
                cy="0"
                r="19"
                fill="#303944"
                stroke="#05070A"
                strokeWidth="5"
              />
              {/* Inner Recessed Dark Core */}
              <circle
                cx="0"
                cy="0"
                r="12"
                fill="#1D232B"
                stroke="#05070A"
                strokeWidth="2.5"
              />
              {/* Colored Glowing Indicator Arc Inside Knob */}
              <circle
                cx="0"
                cy="0"
                r="12"
                fill="none"
                stroke={rail.arcColor}
                strokeWidth="3.2"
                strokeDasharray="36 60"
                strokeLinecap="round"
                transform={`rotate(${rail.arcRot})`}
              />
            </g>
          </g>
        );
      })}

      {/* ============================================================
          2. CENTRAL 3D MECHANICAL GEAR (Overlapping Middle Rails)
         ============================================================ */}
      <g
        transform={`translate(0, ${(1 - gearSpring) * 25}) scale(${
          0.78 + 0.22 * gearSpring
        })`}
        style={{
          transformOrigin: `${gearCx}px ${gearCy}px`,
          opacity: Math.min(1, gearSpring * 1.3),
        }}
      >
        {/* Drop Shadow of Gear onto Rails */}
        <circle
          cx={gearCx + 14}
          cy={gearCy + 16}
          r="82"
          fill="#000000"
          opacity="0.55"
        />

        {/* 3D Extruded Back Gear Layer (Dark Steel Depth) */}
        <path
          d={backGearPath}
          fill="#4A5562"
          stroke="#05070A"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* 3D Main Front Gear Layer (Bright Cel-Shaded Silver) */}
        <path
          d={frontGearPath}
          fill="url(#gear-metal-front)"
          stroke="#05070A"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* Outer Bevel Ring on Gear Face */}
        <circle
          cx={gearCx}
          cy={gearCy}
          r="46"
          fill="#6E7985"
          stroke="#05070A"
          strokeWidth="4.5"
        />
        <circle
          cx={gearCx}
          cy={gearCy}
          r="46"
          fill="url(#gear-dots)"
        />

        {/* Deep Inner Bore Hole of Gear (with 3D Crescent Rim) */}
        <circle
          cx={gearCx}
          cy={gearCy}
          r="30"
          fill="#262E38"
          stroke="#05070A"
          strokeWidth="5"
        />
        <circle
          cx={gearCx + 5}
          cy={gearCy + 3}
          r="25"
          fill="#090C10"
          stroke="#05070A"
          strokeWidth="3.5"
        />

        {/* Glowing Orange Progress Arc Inside the Gear Bore (Signature Detail) */}
        <circle
          cx={gearCx}
          cy={gearCy}
          r="30"
          fill="none"
          stroke="#EE8B26"
          strokeWidth="7"
          strokeDasharray="76 160"
          strokeLinecap="butt"
          transform={`rotate(${-60 + gearAngle * 0.6} ${gearCx} ${gearCy})`}
        />
        <circle
          cx={gearCx}
          cy={gearCy}
          r="33"
          fill="none"
          stroke="#05070A"
          strokeWidth="3.5"
        />
        <circle
          cx={gearCx}
          cy={gearCy}
          r="26.5"
          fill="none"
          stroke="#05070A"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
};
