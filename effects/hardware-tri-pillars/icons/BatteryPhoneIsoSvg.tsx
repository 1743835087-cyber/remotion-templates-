import React from "react";
import { interpolate, spring } from "remotion";

export const BatteryPhoneIsoSvg: React.FC<{
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ frame, fps, enterDelay }) => {
  const localFrame = Math.max(0, frame - enterDelay);

  // Phone chassis pops in first
  const chassisSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Battery module pops out from the phone with a strong 2.5D separation effect
  const batteryPopSpring = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.9 },
  });

  // Ambient floating hover for the battery vs phone chassis
  const floatWave = Math.sin((frame + 10) / 14);
  const batteryOffsetX = interpolate(batteryPopSpring, [0, 1], [32, 0]) + floatWave * -3.5;
  const batteryOffsetY = interpolate(batteryPopSpring, [0, 1], [-18, 0]) + floatWave * -4.5;
  const chassisFloatY = Math.cos(frame / 16) * 2.5;

  // Energy pulse inside battery
  const energyPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.25, 0.75]);

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
        {/* Crosshatch & halftone dot pattern for cel-shaded aesthetic */}
        <pattern
          id="bat-halftone"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <circle cx="2" cy="2" r="1" fill="#0A140B" opacity="0.45" />
        </pattern>
        <pattern
          id="chassis-dots"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="0.8" fill="#111" opacity="0.35" />
        </pattern>
        <linearGradient id="phone-rim-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6ECE8" />
          <stop offset="45%" stopColor="#B8C2BC" />
          <stop offset="100%" stopColor="#6E7872" />
        </linearGradient>
        <linearGradient id="phone-side-green" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5C7A52" />
          <stop offset="50%" stopColor="#3F5738" />
          <stop offset="100%" stopColor="#263622" />
        </linearGradient>
        <linearGradient id="battery-front-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D5A36" />
          <stop offset="55%" stopColor="#1D4025" />
          <stop offset="100%" stopColor="#122B18" />
        </linearGradient>
        <linearGradient id="battery-side-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#467C4E" />
          <stop offset="100%" stopColor="#1E3F24" />
        </linearGradient>
        <linearGradient id="battery-top-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#65A86E" />
          <stop offset="100%" stopColor="#3B6E43" />
        </linearGradient>
      </defs>

      {/* ============================================================
          1. PHONE CHASSIS (Rear Housing & Internal Mechanics)
         ============================================================ */}
      <g
        transform={`translate(0, ${(1 - chassisSpring) * 45 + chassisFloatY}) scale(${
          0.85 + 0.15 * chassisSpring
        })`}
        style={{ transformOrigin: "210px 220px", opacity: chassisSpring }}
      >
        {/* Outer Thick Dark-Green Extruded 3D Side Body */}
        <path
          d="M 148 48
             L 278 30
             C 296 28, 312 40, 312 60
             L 312 346
             C 312 365, 297 380, 278 383
             L 145 398
             C 130 400, 120 388, 120 370
             L 132 70
             C 132 56, 138 50, 148 48 Z"
          fill="url(#phone-side-green)"
          stroke="#060806"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* Right Side Metallic Chamfer Edge Lines & Antenna Bands */}
        <line x1="296" y1="95" x2="312" y2="93" stroke="#060806" strokeWidth="3.5" />
        <line x1="296" y1="315" x2="312" y2="313" stroke="#060806" strokeWidth="3.5" />
        {/* Side Power/Volume Button */}
        <path
          d="M 308 135 L 315 134 L 315 178 L 308 179 Z"
          fill="#7A9A70"
          stroke="#060806"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Metallic Silver Mid-Frame Face */}
        <path
          d="M 135 52
             L 266 34
             C 283 32, 296 44, 296 62
             L 296 344
             C 296 362, 282 375, 265 378
             L 133 393
             C 118 395, 108 384, 108 366
             L 120 72
             C 120 58, 125 53, 135 52 Z"
          fill="url(#phone-rim-metal)"
          stroke="#060806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Inner Crisp Highlight Line on Silver Rim */}
        <path
          d="M 138 57 L 264 40 C 278 38, 289 48, 289 63 L 289 342"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Corner Screws on Silver Frame */}
        {[
          [136, 65],
          [276, 48],
          [281, 360],
          [124, 376],
          [282, 195],
        ].map(([cx, cy], idx) => (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r="3.2"
              fill="#6D7570"
              stroke="#060806"
              strokeWidth="2"
            />
            <line
              x1={cx - 1.5}
              y1={cy - 1.5}
              x2={cx + 1.5}
              y2={cy + 1.5}
              stroke="#060806"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Deep Recessed Internal Hardware Cavity */}
        <path
          d="M 142 66
             L 258 50
             C 272 48, 280 56, 280 70
             L 280 336
             C 280 350, 270 360, 256 362
             L 138 376
             C 126 377, 120 368, 120 355
             L 130 82
             C 130 72, 134 67, 142 66 Z"
          fill="#1B201E"
          stroke="#060806"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Internal Cavity Halftone Texture */}
        <path
          d="M 142 66 L 258 50 L 280 70 L 280 336 L 256 362 L 138 376 L 120 355 L 130 82 Z"
          fill="url(#chassis-dots)"
        />

        {/* Top Motherboard Shielding & Camera Bracket Area */}
        <path
          d="M 144 74 L 222 64 L 222 128 L 268 122 L 268 168 L 195 176 L 195 140 L 140 146 Z"
          fill="#373E3B"
          stroke="#060806"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Top Right Dual Camera / Sensor Cutouts */}
        <rect
          x="228"
          y="62"
          width="42"
          height="52"
          rx="6"
          fill="#262B29"
          stroke="#060806"
          strokeWidth="3.5"
        />
        <circle cx="249" cy="80" r="9" fill="#121615" stroke="#060806" strokeWidth="3" />
        <circle cx="249" cy="80" r="3.5" fill="#3B5249" />
        <circle cx="249" cy="102" r="6" fill="#121615" stroke="#060806" strokeWidth="2.5" />

        {/* Gold BTB Ribbon Connectors & Tiny SMD Components */}
        <rect
          x="166"
          y="84"
          width="16"
          height="10"
          rx="2"
          fill="#D4A238"
          stroke="#060806"
          strokeWidth="2.5"
        />
        <rect
          x="192"
          y="81"
          width="12"
          height="10"
          rx="2"
          fill="#D4A238"
          stroke="#060806"
          strokeWidth="2.5"
        />
        <circle cx="155" cy="108" r="4" fill="#8C9690" stroke="#060806" strokeWidth="2" />
        <circle cx="212" cy="152" r="4.5" fill="#D4A238" stroke="#060806" strokeWidth="2" />
        <circle cx="250" cy="144" r="5" fill="#7D8782" stroke="#060806" strokeWidth="2.5" />

        {/* Middle-Right Metallic Shield Plate & Battery Compartment Bay */}
        <path
          d="M 188 182 L 266 172 L 266 286 L 232 290 L 232 205 L 188 210 Z"
          fill="#78827D"
          stroke="#060806"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Recessed Dark Battery Well */}
        <path
          d="M 142 155 L 226 146 L 226 306 L 136 316 Z"
          fill="#101412"
          stroke="#060806"
          strokeWidth="3"
        />

        {/* Bottom Speaker Assembly & Sub-PCB */}
        <path
          d="M 136 322 L 266 306 L 266 350 L 134 365 Z"
          fill="#333A37"
          stroke="#060806"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect
          x="212"
          y="316"
          width="42"
          height="24"
          rx="4"
          fill="#555E5A"
          stroke="#060806"
          strokeWidth="3"
        />
        <circle cx="195" cy="336" r="4.5" fill="#D4A238" stroke="#060806" strokeWidth="2" />
        <circle cx="254" cy="348" r="3.5" fill="#D4A238" stroke="#060806" strokeWidth="2" />

        {/* Cast Shadow of the Floating Battery onto the Phone Chassis */}
        <path
          d="M 122 108 L 222 96 L 210 364 L 114 374 Z"
          fill="#000000"
          opacity={0.48 * batteryPopSpring}
          transform={`translate(${batteryOffsetX * 0.35}, ${batteryOffsetY * 0.35})`}
        />
      </g>

      {/* ============================================================
          2. DETACHED HIGH-CAPACITY GREEN BATTERY BLOCK (Foreground)
         ============================================================ */}
      <g
        transform={`translate(${batteryOffsetX}, ${batteryOffsetY}) scale(${
          0.82 + 0.18 * batteryPopSpring
        })`}
        style={{
          transformOrigin: "135px 235px",
          opacity: Math.min(1, batteryPopSpring * 1.3),
        }}
      >
        {/* Battery Ribbon Cable / BTB Connector Plug on Right Edge */}
        <g transform="translate(0, 0)">
          <path
            d="M 188 258 L 216 254 L 216 286 L 186 290 Z"
            fill="#2B332E"
            stroke="#060806"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <rect
            x="198"
            y="260"
            width="14"
            height="20"
            rx="2"
            fill="#8F9993"
            stroke="#060806"
            strokeWidth="3"
          />
        </g>

        {/* Battery 3D Top Bevel Plane */}
        <path
          d="M 78 96 L 190 83 L 205 92 L 90 105 Z"
          fill="url(#battery-top-grad)"
          stroke="#060806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Battery 3D Right Extrusion Plane */}
        <path
          d="M 190 83 L 205 92 L 190 362 L 174 354 Z"
          fill="url(#battery-side-grad)"
          stroke="#060806"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Battery Main Front Face */}
        <path
          d="M 78 96
             L 190 83
             L 174 354
             L 56 350
             Z"
          fill="url(#battery-front-grad)"
          stroke="#060806"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Comic Halftone Shading Overlay on Lower Half of Battery */}
        <path
          d="M 68 210 L 182 200 L 174 354 L 56 350 Z"
          fill="url(#bat-halftone)"
        />

        {/* Subtle Animated Energy Charge Glow Bar Inside Battery */}
        <path
          d="M 68 240 L 178 232 L 174 334 L 60 330 Z"
          fill="#62CA3E"
          opacity={energyPulse * 0.18}
        />

        {/* Crisp Cel-Shaded Top & Right Rim Highlights */}
        <line
          x1="83"
          y1="101"
          x2="184"
          y2="89"
          stroke="#8CE68C"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="186"
          y1="91"
          x2="171"
          y2="332"
          stroke="#7AD47A"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Bottom Packaging Fold Seam Line (Authentic Pouch Cell Detail) */}
        <line
          x1="58"
          y1="333"
          x2="175"
          y2="337"
          stroke="#060806"
          strokeWidth="4"
        />
        <line
          x1="175"
          y1="337"
          x2="191"
          y2="345"
          stroke="#060806"
          strokeWidth="4"
        />
        <line
          x1="60"
          y1="337"
          x2="172"
          y2="341"
          stroke="#4F8A57"
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Plus (+) Symbol on Top-Left of Battery */}
        <g transform="translate(94, 128) skewY(-6)">
          <circle
            cx="0"
            cy="0"
            r="10.5"
            fill="none"
            stroke="#D9F7DC"
            strokeWidth="2.6"
          />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#D9F7DC" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#D9F7DC" strokeWidth="2.6" strokeLinecap="round" />
        </g>

        {/* Minus (-) Symbol on Top-Right of Battery */}
        <g transform="translate(162, 120) skewY(-6)">
          <circle
            cx="0"
            cy="0"
            r="10.5"
            fill="none"
            stroke="#D9F7DC"
            strokeWidth="2.6"
          />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#D9F7DC" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
