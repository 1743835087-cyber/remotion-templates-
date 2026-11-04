import React from "react";
import { interpolate, spring } from "remotion";

// ============================================================================
// 1. REDCAP 5G POCKET WIFI 2.5D CEL-SHADED ILLUSTRATION (1. 轻量化 5G)
// ============================================================================
export const RedCapModemIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  const deviceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.85 },
  });

  const chipSpring = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 11, stiffness: 105, mass: 0.9 },
  });

  const floatWave = Math.sin((frame + 10) / 14);
  const deviceFloatY = Math.cos(frame / 16) * 2.5;
  const chipOffsetX = interpolate(chipSpring, [0, 1], [-28, 0]) + floatWave * 3.5;
  const chipOffsetY = interpolate(chipSpring, [0, 1], [-18, 0]) + floatWave * -4.0;

  // Signal wave pulse
  const wavePulse = (frame - enterDelay) * 0.12;

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
          id="redcap-halftone"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <circle cx="2" cy="2" r="1" fill="#051418" opacity="0.45" />
        </pattern>
        <linearGradient id="navy-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#263B5E" />
          <stop offset="55%" stopColor="#192842" />
          <stop offset="100%" stopColor="#0E1729" />
        </linearGradient>
        <linearGradient id="navy-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#385482" />
          <stop offset="100%" stopColor="#131F36" />
        </linearGradient>
        <linearGradient id="redcap-chip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#268C94" />
          <stop offset="100%" stopColor="#10494F" />
        </linearGradient>
      </defs>

      {/* 1. POCKET WIFI DEVICE (Matching Ginlemag Navy Blue + Right Black Strip) */}
      <g
        transform={`translate(0, ${(1 - deviceSpring) * 45 + deviceFloatY}) scale(${
          0.85 + 0.15 * deviceSpring
        })`}
        style={{ transformOrigin: "185px 220px", opacity: deviceSpring }}
      >
        {/* 3D Right Extruded Thickness */}
        <path
          d="M 252 44
             C 268 42, 282 54, 282 72
             L 282 356
             C 282 372, 270 384, 252 386
             L 236 376
             L 236 52 Z"
          fill="url(#navy-side-grad)"
          stroke="#05070A"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Main Navy Blue Body Front Face */}
        <path
          d="M 96 58
             L 242 42
             C 256 40, 266 50, 266 66
             L 266 358
             C 266 374, 255 385, 240 387
             L 94 402
             C 78 403, 68 392, 68 376
             L 72 82
             C 72 68, 82 60, 96 58 Z"
          fill="url(#navy-body-grad)"
          stroke="#05070A"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* Halftone Comic Shading on Lower Left Body */}
        <path
          d="M 70 210 L 195 198 L 195 392 L 94 402 C 78 403, 68 392, 68 376 Z"
          fill="url(#redcap-halftone)"
        />

        {/* Crisp Cel-Shaded Top-Left Rim Highlight */}
        <path
          d="M 82 78 C 82 68, 88 64, 98 63 L 236 48"
          fill="none"
          stroke="#6CA2EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Signature Right Glossy Black Display Strip (From Uploaded Photo) */}
        <path
          d="M 202 64
             L 246 59
             C 252 58, 256 63, 256 70
             L 256 356
             C 256 364, 251 370, 244 371
             L 200 376
             C 195 376, 192 372, 192 365
             L 194 74
             C 194 68, 197 65, 202 64 Z"
          fill="#0B0E12"
          stroke="#05070A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* LED Matrix Status Readout at Top of Black Strip */}
        <text
          x="210"
          y="94"
          fill="#38DCE5"
          fontSize="16"
          fontWeight="900"
          fontFamily="monospace"
          transform="skewY(-6)"
          opacity="0.85"
        >
          188
        </text>

        {/* Wi-Fi & 4G/5G Signal Bars on Black Strip */}
        <g transform="translate(226, 134) skewY(-6)">
          <path
            d="M -10 -2 Q 0 -10 10 -2"
            fill="none"
            stroke="#9BA8B8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M -6 2 Q 0 -3 6 2"
            fill="none"
            stroke="#9BA8B8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="0" cy="6" r="1.8" fill="#9BA8B8" />
        </g>
        <text
          x="198"
          y="162"
          fill="#8C99A8"
          fontSize="10"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
          transform="skewY(-6)"
        >
          4G·5G
        </text>
        {/* Signal Bars */}
        {[0, 1, 2, 3].map((b) => (
          <rect
            key={b}
            x={231 + b * 4.5}
            y={156 - b * 2.5}
            width="2.6"
            height={5 + b * 2.5}
            fill="#48E5C2"
            transform="skewY(-6)"
          />
        ))}

        {/* Bottom 5G Emblem on Black Strip */}
        <text
          x="200"
          y="356"
          fill="#9BA8B8"
          fontSize="30"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
          transform="skewY(-6)"
        >
          5G
        </text>

        {/* Bottom-Left Subtle Brand Lines */}
        <rect x="86" y="346" width="54" height="8" rx="3" fill="#465C82" opacity="0.6" transform="skewY(-6)" />
        <rect x="86" y="360" width="68" height="6" rx="2" fill="#344666" opacity="0.5" transform="skewY(-6)" />

        {/* Cast Shadow of Floating RedCap Module */}
        <path
          d="M 135 168 L 265 154 L 265 282 L 135 296 Z"
          fill="#000000"
          opacity={0.52 * chipSpring}
          transform={`translate(${chipOffsetX * 0.3}, ${chipOffsetY * 0.3})`}
        />
      </g>

      {/* 2. FLOATING 2.5D "RedCap 5G" BASEBAND CHIP MODULE */}
      <g
        transform={`translate(${chipOffsetX}, ${chipOffsetY}) scale(${
          0.8 + 0.2 * chipSpring
        })`}
        style={{
          transformOrigin: "235px 225px",
          opacity: Math.min(1, chipSpring * 1.3),
        }}
      >
        {/* 3D Extruded Teal Side Block */}
        <path
          d="M 314 148 L 332 158 L 328 276 L 178 292 L 162 280 L 310 264 Z"
          fill="url(#redcap-chip-grad)"
          stroke="#05070A"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Metallic Silver Bevel Rim */}
        <path
          d="M 166 164 L 314 148 L 310 264 L 162 280 Z"
          fill="#C8D8DC"
          stroke="#05070A"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Dark Silicon Core */}
        <path
          d="M 176 173 L 304 159 L 300 255 L 172 269 Z"
          fill="#0E191D"
          stroke="#05070A"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Glowing Cyan Inner HUD Corner Brackets on Chip */}
        <g stroke="#48E5E5" strokeWidth="3" fill="none" transform="skewY(-6)">
          <polyline points="184,200 184,188 198,188" />
          <polyline points="292,188 292,200" />
          <polyline points="184,256 184,268 198,268" />
          <polyline points="278,268 292,268 292,256" />
        </g>

        {/* Chip Text: RedCap 5G */}
        <text
          x="238"
          y="232"
          textAnchor="middle"
          fill="#48F0E5"
          fontSize="26"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
          transform="skewY(-6)"
        >
          RedCap
        </text>
        <text
          x="238"
          y="258"
          textAnchor="middle"
          fill="#E2F4F7"
          fontSize="17"
          fontWeight="700"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
          letterSpacing="2"
          transform="skewY(-6)"
        >
          5G R17
        </text>

        {/* Animated 5G Radio Waves Emitting from Top-Right */}
        {[0, 1, 2].map((w) => {
          const phase = (wavePulse + w * 0.8) % 2.4;
          const op = phase < 1.2 ? interpolate(phase, [0, 0.6, 1.2], [0, 0.9, 0]) : 0;
          const r = 22 + w * 16;
          return (
            <path
              key={w}
              d={`M ${305} ${135 - w * 12} A ${r} ${r} 0 0 1 ${328 + w * 12} ${160}`}
              fill="none"
              stroke="#48F0E5"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={op}
            />
          );
        })}
      </g>
    </svg>
  );
};

// ============================================================================
// 2. LOW POWER / COOL EFFICIENCY 2.5D ILLUSTRATION (2. 功耗锐减 · 告别发热)
// ============================================================================
export const LowPowerCoolIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  const batterySpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.85 },
  });

  const arrowSpring = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.85 },
  });

  // Downward arrow bobbing animation
  const arrowBobY =
    interpolate(arrowSpring, [0, 1], [-45, 0]) + Math.sin(frame / 10) * 6;
  const batteryFloatY = Math.cos(frame / 15) * 2.5;

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
          id="eco-halftone"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <circle cx="2" cy="2" r="1" fill="#07170A" opacity="0.45" />
        </pattern>
        <linearGradient id="eco-bat-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B5E35" />
          <stop offset="55%" stopColor="#1B4223" />
          <stop offset="100%" stopColor="#102915" />
        </linearGradient>
        <linearGradient id="eco-bat-side" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CA65A" />
          <stop offset="100%" stopColor="#1D4724" />
        </linearGradient>
        <linearGradient id="neon-arrow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8CFF66" />
          <stop offset="100%" stopColor="#38B828" />
        </linearGradient>
      </defs>

      {/* 1. 3D ISOMETRIC COOLING FINS + BATTERY CELL */}
      <g
        transform={`translate(0, ${(1 - batterySpring) * 45 + batteryFloatY}) scale(${
          0.85 + 0.15 * batterySpring
        })`}
        style={{ transformOrigin: "215px 220px", opacity: batterySpring }}
      >
        {/* Back Metallic Heatsink / Thermal Dissipation Plate */}
        <path
          d="M 164 46 L 298 32 L 298 352 L 164 368 Z"
          fill="#8A9994"
          stroke="#050806"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Heatsink Horizontal Cooling Fins */}
        {[68, 102, 136, 170, 204, 238, 272, 306].map((yPos, idx) => (
          <line
            key={idx}
            x1="252"
            y1={yPos}
            x2="296"
            y2={yPos - 5}
            stroke="#050806"
            strokeWidth="4.5"
          />
        ))}

        {/* Top Terminal Cap of Battery */}
        <path
          d="M 152 60 L 216 53 L 226 60 L 226 78 L 152 86 Z"
          fill="#C8D6D0"
          stroke="#050806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* 3D Top Bevel of Green Battery */}
        <path
          d="M 112 78 L 246 64 L 264 74 L 128 88 Z"
          fill="#62B56E"
          stroke="#050806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* 3D Right Extrusion of Green Battery */}
        <path
          d="M 246 64 L 264 74 L 254 366 L 234 356 Z"
          fill="url(#eco-bat-side)"
          stroke="#050806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Main Front Face of Green Battery */}
        <path
          d="M 112 78 L 246 64 L 234 356 L 98 350 Z"
          fill="url(#eco-bat-front)"
          stroke="#050806"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M 104 200 L 240 188 L 234 356 L 98 350 Z"
          fill="url(#eco-halftone)"
        />

        {/* 4 Glowing Green Energy Bars Inside Battery */}
        {[0, 1, 2, 3].map((barIdx) => {
          const yTop = 278 - barIdx * 44;
          const pulse = interpolate(
            Math.sin((frame - barIdx * 6) / 10),
            [-1, 1],
            [0.65, 1]
          );
          return (
            <path
              key={barIdx}
              d={`M 124 ${yTop} L 218 ${yTop - 9} L 216 ${yTop + 20} L 122 ${
                yTop + 29
              } Z`}
              fill="#63E040"
              stroke="#050806"
              strokeWidth="4"
              strokeLinejoin="round"
              opacity={pulse}
            />
          );
        })}

        {/* Crisp Highlight Line */}
        <line
          x1="118"
          y1="84"
          x2="240"
          y2="71"
          stroke="#98F5A4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* 2. FOREGROUND 3D DOWNWARD POWER-DROP ARROW (Matching "↓ 功耗" from Screenshot) */}
      <g
        transform={`translate(0, ${arrowBobY}) scale(${0.78 + 0.22 * arrowSpring})`}
        style={{
          transformOrigin: "102px 235px",
          opacity: Math.min(1, arrowSpring * 1.35),
        }}
      >
        {/* Drop Shadow of Arrow onto Battery */}
        <path
          d="M 92 128 L 128 125 L 128 232 L 154 230 L 110 296 L 66 238 L 92 236 Z"
          fill="#000000"
          opacity="0.55"
        />

        {/* 3D Dark Green Extruded Side of Arrow */}
        <path
          d="M 114 118 L 126 125 L 126 226 L 152 224 L 108 292 L 96 285 L 138 218 L 114 220 Z"
          fill="#1E5C18"
          stroke="#050806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Main Bright Neon Green Front Arrow */}
        <path
          d="M 78 122
             L 114 118
             L 114 220
             L 140 218
             L 96 285
             L 52 226
             L 78 224
             Z"
          fill="url(#neon-arrow-grad)"
          stroke="#050806"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner White Rim Highlight on Arrow */}
        <line
          x1="84"
          y1="128"
          x2="84"
          y2="226"
          stroke="#E2FFDB"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* "LOW WATT" Badge Pill Below Arrow */}
        <g transform="translate(46, 302) skewY(-5)">
          <rect
            x="0"
            y="0"
            width="108"
            height="38"
            rx="8"
            fill="#122616"
            stroke="#050806"
            strokeWidth="5"
          />
          <rect
            x="4"
            y="4"
            width="100"
            height="30"
            rx="5"
            fill="none"
            stroke="#63C93E"
            strokeWidth="2"
          />
          <text
            x="54"
            y="25"
            textAnchor="middle"
            fill="#8CFF66"
            fontSize="20"
            fontWeight="900"
            fontFamily="'Alibaba PuHuiTi', sans-serif"
          >
            -55% 功耗
          </text>
        </g>
      </g>
    </svg>
  );
};

// ============================================================================
// 3. SWEET-SPOT SPEED & STABILITY VS 4G/5G (3. 黄金网速 · 告别卡顿)
// ============================================================================
export const SpeedBalanceIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  const barsSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.85 },
  });

  const gaugeSpring = spring({
    frame: Math.max(0, localFrame - 7),
    fps,
    config: { damping: 12, stiffness: 105, mass: 0.9 },
  });

  // Needle sweeps from left (slow 4G) to the sweet-spot upper-right zone
  const needleAngle =
    interpolate(gaugeSpring, [0, 1], [-125, 28]) + Math.sin(frame / 14) * 5;

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
        <linearGradient id="gauge-rim-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0F5FA" />
          <stop offset="50%" stopColor="#BAC6D4" />
          <stop offset="100%" stopColor="#6E7B8B" />
        </linearGradient>
        <linearGradient id="pill-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#12243D" />
          <stop offset="50%" stopColor="#1D406E" />
          <stop offset="100%" stopColor="#2668B8" />
        </linearGradient>
      </defs>

      {/* 1. TOP & BOTTOM COMPARISON PILL BARS (Echoing Screenshot's Top & Bottom Pills) */}
      {/* Top Pill: Full 5G -> Overheat Warning */}
      <g
        transform={`translate(${(1 - barsSpring) * -45}, 0)`}
        style={{ opacity: barsSpring }}
      >
        <rect
          x="56"
          y="64"
          width="274"
          height="52"
          rx="26"
          fill="#0F1824"
          stroke="#05070A"
          strokeWidth="5.5"
        />
        <rect
          x="50"
          y="58"
          width="274"
          height="52"
          rx="26"
          fill="url(#pill-blue-grad)"
          stroke="#05070A"
          strokeWidth="5.5"
        />
        <rect
          x="55"
          y="63"
          width="264"
          height="42"
          rx="21"
          fill="none"
          stroke="#6CA8EB"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <text
          x="120"
          y="91"
          textAnchor="middle"
          fill="#EBF4FF"
          fontSize="24"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          满血5G
        </text>
        <text
          x="236"
          y="90"
          textAnchor="middle"
          fill="#FF7878"
          fontSize="20"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          功耗高·发热重
        </text>
      </g>

      {/* Bottom Pill: Legacy 4G -> Slow & Laggy */}
      <g
        transform={`translate(${(1 - barsSpring) * 45}, 0)`}
        style={{ opacity: barsSpring }}
      >
        <rect
          x="56"
          y="328"
          width="274"
          height="52"
          rx="26"
          fill="#0F1824"
          stroke="#05070A"
          strokeWidth="5.5"
        />
        <rect
          x="50"
          y="322"
          width="274"
          height="52"
          rx="26"
          fill="url(#pill-blue-grad)"
          stroke="#05070A"
          strokeWidth="5.5"
        />
        <rect
          x="55"
          y="327"
          width="264"
          height="42"
          rx="21"
          fill="none"
          stroke="#6CA8EB"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <text
          x="120"
          y="355"
          textAnchor="middle"
          fill="#EBF4FF"
          fontSize="24"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          传统4G
        </text>
        <text
          x="236"
          y="354"
          textAnchor="middle"
          fill="#FF9466"
          fontSize="20"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          网速慢·易卡顿
        </text>
      </g>

      {/* 2. CENTRAL 3D SPEED & EFFICIENCY TACHOMETER GAUGE */}
      <g
        transform={`translate(0, ${(1 - gaugeSpring) * 25}) scale(${
          0.78 + 0.22 * gaugeSpring
        })`}
        style={{
          transformOrigin: "188px 216px",
          opacity: Math.min(1, gaugeSpring * 1.35),
        }}
      >
        {/* Drop Shadow */}
        <circle cx="198" cy="226" r="92" fill="#000000" opacity="0.6" />

        {/* 3D Extruded Back Cylinder of Gauge */}
        <circle
          cx="196"
          cy="220"
          r="90"
          fill="#3E4A59"
          stroke="#05070A"
          strokeWidth="6.5"
        />

        {/* Front Metallic Bezel Ring */}
        <circle
          cx="186"
          cy="214"
          r="90"
          fill="url(#gauge-rim-metal)"
          stroke="#05070A"
          strokeWidth="6.5"
        />

        {/* Dark Gauge Dial Face */}
        <circle
          cx="186"
          cy="214"
          r="72"
          fill="#0D131C"
          stroke="#05070A"
          strokeWidth="5"
        />

        {/* Colored Speed Arc (Cyan -> Blue -> Sweet-Spot Emerald -> Red Overheat Zone) */}
        <path
          d="M 134 252 A 64 64 0 1 1 238 252"
          fill="none"
          stroke="#233247"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 134 252 A 64 64 0 0 1 226 164"
          fill="none"
          stroke="#38B6FF"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 226 164 A 64 64 0 0 1 246 232"
          fill="none"
          stroke="#5CE65C"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Center Readout Label */}
        <text
          x="186"
          y="258"
          textAnchor="middle"
          fill="#5CE65C"
          fontSize="19"
          fontWeight="900"
          fontFamily="'Alibaba PuHuiTi', sans-serif"
        >
          黄金甜点区
        </text>

        {/* Rotating Needle */}
        <g transform={`translate(186, 214) rotate(${needleAngle})`}>
          <polygon
            points="-7,14 0,-58 7,14"
            fill="#FF9D2E"
            stroke="#05070A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle
            cx="0"
            cy="0"
            r="14"
            fill="#DCE6F0"
            stroke="#05070A"
            strokeWidth="4.5"
          />
          <circle cx="0" cy="0" r="5" fill="#FF9D2E" />
        </g>
      </g>
    </svg>
  );
};
