import React from "react";
import { interpolate, spring } from "remotion";

export const ChipMotherboardIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  // PCB board entrance
  const boardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.85 },
  });

  // SoC BGA Package pops out in 2.5D from the PCB
  const chipPopSpring = spring({
    frame: Math.max(0, localFrame - 9),
    fps,
    config: { damping: 11, stiffness: 105, mass: 0.9 },
  });

  // Subtle floating hover
  const floatWave = Math.sin((frame + 24) / 14);
  const boardFloatY = Math.cos((frame + 12) / 16) * 2.5;
  const chipOffsetX = interpolate(chipPopSpring, [0, 1], [26, 0]) + floatWave * -3.5;
  const chipOffsetY = interpolate(chipPopSpring, [0, 1], [-18, 0]) + floatWave * -4.0;

  // Gold pin shimmer wave across the BGA matrix
  const shimmerPhase = (frame - enterDelay) * 0.18;

  // Generate 10x10 BGA pin grid coordinates (outer 2 rings + center sparse)
  const bgaPins: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const isOuterRing = r < 2 || r > 7 || c < 2 || c > 7;
      const isInnerCore = r >= 3 && r <= 6 && c >= 3 && c <= 6 && (r + c) % 2 === 0;
      if (isOuterRing || isInnerCore) {
        bgaPins.push({ r, c });
      }
    }
  }

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
          id="pcb-halftone"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(30)"
        >
          <circle cx="2" cy="2" r="1" fill="#061414" opacity="0.4" />
        </pattern>
        <linearGradient id="pcb-front-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B666B" />
          <stop offset="55%" stopColor="#11484D" />
          <stop offset="100%" stopColor="#0A3136" />
        </linearGradient>
        <linearGradient id="pcb-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A858C" />
          <stop offset="50%" stopColor="#175257" />
          <stop offset="100%" stopColor="#0C3034" />
        </linearGradient>
        <linearGradient id="shield-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF2F2" />
          <stop offset="55%" stopColor="#C4D1D1" />
          <stop offset="100%" stopColor="#8A9999" />
        </linearGradient>
        <linearGradient id="chip-rim-teal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#359AA1" />
          <stop offset="100%" stopColor="#165056" />
        </linearGradient>
      </defs>

      {/* ============================================================
          1. ISOMETRIC TEAL MOTHERBOARD (PCB)
         ============================================================ */}
      <g
        transform={`translate(0, ${(1 - boardSpring) * 45 + boardFloatY}) scale(${
          0.85 + 0.15 * boardSpring
        })`}
        style={{ transformOrigin: "205px 220px", opacity: boardSpring }}
      >
        {/* 3D Right Extruded Thickness of the Stepped PCB */}
        <path
          d="M 272 52
             L 292 64
             L 292 152
             L 304 162
             L 304 352
             L 285 362
             L 265 348
             Z"
          fill="url(#pcb-side-grad)"
          stroke="#050808"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Bottom 3D Thickness of the PCB */}
        <path
          d="M 118 358
             L 285 348
             L 304 352
             L 285 366
             L 132 374
             L 118 358 Z"
          fill="#0B2E32"
          stroke="#050808"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Main Stepped Teal PCB Front Face */}
        <path
          d="M 134 68
             L 272 52
             L 272 146
             L 286 156
             L 286 348
             L 118 358
             L 122 252
             L 134 242
             Z"
          fill="url(#pcb-front-grad)"
          stroke="#050808"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Halftone Texture Overlay on PCB */}
        <path
          d="M 134 68 L 272 52 L 272 146 L 286 156 L 286 348 L 118 358 L 122 252 L 134 242 Z"
          fill="url(#pcb-halftone)"
        />

        {/* Subtle Cyan PCB Circuit Traces */}
        <g stroke="#298C94" strokeWidth="2" fill="none" opacity="0.55">
          <path d="M 155 130 L 185 127 L 195 140 L 195 190" />
          <path d="M 168 145 L 182 143 L 182 195" />
          <path d="M 215 245 L 258 242 L 266 254 L 266 305" />
          <path d="M 145 315 L 188 312 L 198 325" />
        </g>

        {/* Crisp Top/Left Edge Highlight on PCB */}
        <path
          d="M 138 73 L 267 58"
          stroke="#5CD1D9"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Copper / Gold Grounded Mounting Holes (4 Corners) */}
        {[
          [148, 84],
          [258, 69],
          [136, 338],
          [268, 330],
        ].map(([cx, cy], idx) => (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r="7.5"
              fill="#D99B38"
              stroke="#050808"
              strokeWidth="3"
            />
            <circle
              cx={cx}
              cy={cy}
              r="3.5"
              fill="#0B181A"
              stroke="#050808"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Top-Left White Rectangular Ceramic Module */}
        <path
          d="M 164 74 L 194 70 L 194 110 L 164 114 Z"
          fill="#DCE6E6"
          stroke="#050808"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Left Column of 4 Small Silver SMD Capacitors */}
        {[128, 141, 154, 167].map((yPos, i) => (
          <rect
            key={i}
            x="145"
            y={yPos}
            width="14"
            height="7.5"
            rx="1.5"
            transform="skewY(-6)"
            fill="#C7D4D4"
            stroke="#050808"
            strokeWidth="2.8"
          />
        ))}

        {/* Small Dark IC Chips in Center & Right */}
        <path
          d="M 176 138 L 196 136 L 196 156 L 176 158 Z"
          fill="#1B2426"
          stroke="#050808"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 224 224 L 244 222 L 244 244 L 224 246 Z"
          fill="#1B2426"
          stroke="#050808"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle
          cx="222"
          cy="266"
          r="5.5"
          fill="#1B2426"
          stroke="#050808"
          strokeWidth="3"
        />

        {/* Large Stepped Silver/White Metallic EM Shield Can (Upper Right) */}
        <g>
          {/* 3D Right Side of Shield Can */}
          <path
            d="M 256 76 L 266 82 L 266 146 L 274 152 L 274 206 L 264 212 L 256 204 Z"
            fill="#7A8A8A"
            stroke="#050808"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Main Stepped Top Face of Shield Can */}
          <path
            d="M 212 80
               L 256 75
               L 256 144
               L 264 150
               L 264 206
               L 228 210
               L 228 194
               L 196 197
               L 196 124
               L 212 122
               Z"
            fill="url(#shield-metal-grad)"
            stroke="#050808"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Crisp Inner Highlight on Shield Can */}
          <path
            d="M 216 85 L 251 81 L 251 146"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Stamped Dimples on Shield Can */}
          <circle cx="236" cy="96" r="3" fill="#5C6B6B" />
          <circle cx="212" cy="142" r="3" fill="#5C6B6B" />
          <circle cx="246" cy="188" r="3" fill="#5C6B6B" />
        </g>

        {/* Lower Right Square Silver IC Shield */}
        <g>
          <path
            d="M 264 265 L 272 270 L 272 312 L 234 315 L 228 310"
            fill="#687878"
            stroke="#050808"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 228 268 L 264 265 L 264 307 L 228 310 Z"
            fill="#BAC7C7"
            stroke="#050808"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Bottom Center USB-C / Metallic Tongue Connector */}
        <g>
          {/* Connector 3D Housing */}
          <path
            d="M 192 314 L 218 312 L 225 318 L 225 368 L 198 370 L 192 364 Z"
            fill="#5C6868"
            stroke="#050808"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 192 314 L 218 312 L 218 362 L 192 364 Z"
            fill="#9BA8A8"
            stroke="#050808"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Port Opening */}
          <rect
            x="196"
            y="358"
            width="24"
            height="9"
            rx="3"
            fill="#161C1C"
            stroke="#050808"
            strokeWidth="3"
          />
        </g>

        {/* Shadow Cast by Floating SoC Package onto Motherboard */}
        <path
          d="M 105 190 L 212 180 L 212 298 L 105 308 Z"
          fill="#000000"
          opacity={0.52 * chipPopSpring}
          transform={`translate(${chipOffsetX * 0.35}, ${chipOffsetY * 0.35})`}
        />
      </g>

      {/* ============================================================
          2. DETACHED 3D SoC CHIP PACKAGE WITH GOLD BGA PINS (Foreground)
         ============================================================ */}
      <g
        transform={`translate(${chipOffsetX}, ${chipOffsetY}) scale(${
          0.8 + 0.2 * chipPopSpring
        })`}
        style={{
          transformOrigin: "145px 235px",
          opacity: Math.min(1, chipPopSpring * 1.3),
        }}
      >
        {/* 3D Right & Bottom Extruded Teal Substrate Block of the SoC */}
        <path
          d="M 188 168
             L 210 180
             L 206 286
             L 104 294
             L 84 280
             L 184 272
             Z"
          fill="url(#chip-rim-teal)"
          stroke="#050808"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Extrusion Side Hatching Lines (Matching Original Artwork) */}
        <line x1="184" y1="272" x2="206" y2="286" stroke="#050808" strokeWidth="4" />
        <line x1="120" y1="277" x2="136" y2="290" stroke="#050808" strokeWidth="3" />
        <line x1="152" y1="274" x2="168" y2="288" stroke="#050808" strokeWidth="3" />
        <line x1="190" y1="205" x2="208" y2="216" stroke="#050808" strokeWidth="3" />
        <line x1="188" y1="238" x2="207" y2="249" stroke="#050808" strokeWidth="3" />

        {/* Silver Beveled Frame Around BGA Matrix */}
        <path
          d="M 88 176
             L 188 168
             L 184 272
             L 84 280
             Z"
          fill="#9EB0B0"
          stroke="#050808"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Dark Silicon Substrate Cavity */}
        <path
          d="M 95 183
             L 181 176
             L 177 265
             L 91 272
             Z"
          fill="#141C1E"
          stroke="#050808"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Center Die Area inside BGA Matrix */}
        <path
          d="M 118 205 L 158 202 L 156 242 L 116 245 Z"
          fill="#1F2B2E"
          stroke="#0B1012"
          strokeWidth="2"
        />

        {/* Gold BGA Solder Ball Grid with Shimmer Animation */}
        {bgaPins.map(({ r, c }, idx) => {
          // Bilinear interpolation inside quad (99,188) -> (175,182) -> (171,259) -> (95,265)
          const u = c / 9;
          const v = r / 9;
          const topX = 101 + u * 72;
          const topY = 189 - u * 6;
          const botX = 97 + u * 72;
          const botY = 263 - u * 6;
          const px = topX + v * (botX - topX);
          const py = topY + v * (botY - topY);

          const wave = Math.sin(shimmerPhase - (r + c) * 0.45);
          const pinBright = wave > 0.55;

          return (
            <circle
              key={idx}
              cx={px}
              cy={py}
              r={pinBright ? 2.6 : 2.2}
              fill={pinBright ? "#FFF099" : "#E0A838"}
              stroke="#050808"
              strokeWidth="1"
            />
          );
        })}
      </g>
    </svg>
  );
};
