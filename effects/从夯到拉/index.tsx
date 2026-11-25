import React, { useEffect } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useDelayRender } from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

export const TIER_INTRO_FPS = 60;
export const TIER_INTRO_DURATION = 480;

const WIDTH = 1920;
const HEIGHT = 1080;
const FOCUS_X = 592;
const FOCUS_Y = 534;
const CARD_WIDTH = 552;
const CARD_HEIGHT = 296;
const COLUMN_WIDTH = 372;
const COLUMN_X = 69 + COLUMN_WIDTH / 2;
const COLUMN_FIRST_Y = 123;
const COLUMN_STEP = 207;

const tiers = [
  { label: "夯", light: "#eb573e", surface: "#c13026", edge: "#631d1d", size: 214 },
  { label: "顶级", light: "#ffc26f", surface: "#e4a044", edge: "#865022", size: 172 },
  { label: "人上人", light: "#ffe389", surface: "#ecc148", edge: "#8e6728", size: 153 },
  { label: "NPC", light: "#fff2d3", surface: "#e2dbcd", edge: "#8a8983", size: 173 },
  { label: "拉完了", light: "#e1eaf2", surface: "#a2b7c9", edge: "#576b81", size: 152 },
] as const;

const TURN_START = 38;
const TURN_STEP = 39;
const TURN_RAMP = 9;
const TURN_COUNT = tiers.length;
const TURN_END = TURN_START + TURN_STEP * TURN_COUNT + TURN_RAMP;
const RAIL_SPACING = 353;
const EXIT_START = 255;
const EXIT_END = 287;
const drops = [
  { start: 290, end: 345 },
  { start: 302, end: 358 },
  { start: 315, end: 373 },
  { start: 329, end: 389 },
  { start: 344, end: 407 },
];

const easeOut = Easing.out(Easing.cubic);
const approach = Easing.bezier(0.17, 0, 0.19, 1);
const easeIn = Easing.in(Easing.cubic);
const ramp = (frame: number, start: number, end: number, easing = Easing.linear) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

// The integral of a smooth velocity ramp joins the cruise with matching speed
// and acceleration. Within the cruise, each card glides through its slow point.
const rampDistance = (frames: number) => {
  const t = frames / TURN_RAMP;
  return TURN_RAMP * (t ** 3 - t ** 4 / 2);
};
const turnAt = (frame: number) => {
  const elapsed = Math.min(TURN_END - TURN_START, Math.max(0, frame - TURN_START));
  const remaining = TURN_END - TURN_START - elapsed;
  let distance = elapsed - TURN_RAMP / 2;
  if (elapsed < TURN_RAMP) distance = rampDistance(elapsed);
  if (remaining < TURN_RAMP) distance = TURN_COUNT * TURN_STEP - rampDistance(remaining);

  const phase = distance / TURN_STEP;
  const angle = 2 * Math.PI * phase;
  return phase + (-0.88 * Math.sin(angle) + 0.34 * (1 - Math.cos(angle))) / (2 * Math.PI);
};

const dockEase = (t: number) => {
  const p = t + 0.60 * t * (1 - t);
  return p ** 3 * (10 - 15 * p + 6 * p ** 2);
};

const wrapOffset = (offset: number) =>
  ((offset + TURN_COUNT * 1.5) % TURN_COUNT) - TURN_COUNT / 2;

const cubic = (a: number, b: number, c: number, d: number, t: number) => {
  const s = 1 - t;
  return s ** 3 * a + 3 * s ** 2 * t * b + 3 * s * t ** 2 * c + t ** 3 * d;
};

const Stage: React.FC<{ focusOpacity: number; pullback: number }> = ({ focusOpacity, pullback }) => {
  const vanishingX = mix(634, 1230, pullback);
  const horizon = mix(832, 711, pullback);

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at 40% 44%, #121318 0%, #0b0d11 49%, #06070a 88%)",
    }}>
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 550px 620px at 28% 48%, #7c542329, transparent 85%)",
        opacity: focusOpacity,
      }} />
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 66% 67%, #192940 0%, #101623 33%, transparent 74%)",
        opacity: pullback * 0.8,
      }} />
      <svg width={WIDTH} height={HEIGHT} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="tier-grid-fade" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={HEIGHT}>
            <stop stopColor="#a1aec6" stopOpacity={0} />
            <stop offset="55%" stopColor="#a1aec6" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#a1aec6" stopOpacity={0.09} />
          </linearGradient>
          <linearGradient id="tier-rail-fade" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={HEIGHT}>
            <stop stopColor="#c3985d" stopOpacity={0} />
            <stop offset="30%" stopColor="#c3985d" stopOpacity={0.69} />
            <stop offset="70%" stopColor="#c3985d" stopOpacity={0.69} />
            <stop offset="100%" stopColor="#c3985d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g stroke="url(#tier-grid-fade)" fill="none" strokeWidth={1.2} opacity={mix(0.38, 0.68, pullback)}>
          {Array.from({ length: 31 }, (_, index) => (
            <path key={index} d={`M${vanishingX} ${horizon} L${vanishingX + (index - 15) * 172} ${HEIGHT}`} />
          ))}
          {[0.04, 0.09, 0.17, 0.28, 0.44, 0.65, 0.91].map((depth) => (
            <path key={depth} d={`M0 ${mix(horizon, HEIGHT, depth)}H${WIDTH}`} />
          ))}
        </g>
        <g fill="none" stroke="url(#tier-rail-fade)" opacity={focusOpacity * 0.48}>
          <path d="M155 -25 C 310 72 655 235 660 526 S 327 1015 165 1105" strokeWidth={1.1} />
          <path d="M208 -25 C 363 72 708 235 713 526 S 380 1015 218 1105" strokeWidth={1.4} strokeDasharray="2 11" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const carouselPose = (index: number, frame: number, turn: number, followTurn: number, speed: number) => {
  const offset = wrapOffset(index - turn);
  const focus = Math.exp(-1.3 * Math.abs(offset) ** 1.6);
  const gather = ramp(frame, TURN_END - 8, EXIT_START + 8, dockEase);
  const launch = ramp(frame, EXIT_START, EXIT_END, easeIn);
  const launchSpeed = 35 * (launch - ramp(frame - 1, EXIT_START, EXIT_END, easeIn));
  const arc = offset - 2.4 * launch;
  const side = Math.tanh(arc);
  const followSide = Math.tanh(offset + (turn - followTurn) - 2.1 * launch);
  const entrance = ramp(frame, 0, 34, approach);
  const firstFlight = index === 0 ? 1 - entrance : 0;
  const anticipation = Math.sin(Math.PI * ramp(frame, EXIT_START - 11, EXIT_START + 9)) ** 2;
  const motion = speed + Math.min(1.4, launchSpeed);
  const appear = index === 0 ? ramp(frame, 1, 13, easeOut) : ramp(frame, 14 + index * 2, 33 + index * 2, easeOut);
  const railOpacity = 1 - ramp(Math.abs(offset), 1.44, 1.86, Easing.inOut(Easing.quad));

  return {
    x: FOCUS_X - mix(390, 315, gather) * side ** 2 - 290 * firstFlight - 190 * launch,
    y: FOCUS_Y + offset * mix(RAIL_SPACING, 199, gather) + 244 * firstFlight + 19 * anticipation - 1320 * launch,
    scale: (0.58 + 0.42 * focus) * (1 - 0.32 * firstFlight) * mix(1, 0.78, gather),
    yaw: 23 * followSide ** 2 - 42 * firstFlight + 16 * launch,
    pitch: -8 * followSide + 15 * firstFlight + 7 * anticipation,
    roll: 25 * followSide - 19 * firstFlight - 9 * launch,
    stretch: 1 + 0.027 * motion ** 2,
    lighting: mix(focus, 0.86, gather * 0.7),
    opacity: appear * mix(railOpacity, 1, gather),
    settled: 0,
  };
};

const dropPose = (index: number, frame: number) => {
  const { start, end } = drops[index];
  const progressAt = (f: number) => ramp(f, start, end, dockEase);
  const progress = progressAt(frame);
  const orientation = ramp(frame - 2.5, start + 7, end - 2.5, dockEase);
  const yTarget = COLUMN_FIRST_Y + index * COLUMN_STEP;
  const xAt = (p: number) => cubic(644 + index * 16, 685 + index * 20, 450, COLUMN_X, p);
  const yAt = (p: number) => cubic(-210, mix(-140, yTarget * 0.64, 0.56), yTarget + 5, yTarget, p);
  const before = progressAt(frame - 0.5);
  const after = progressAt(frame + 0.5);
  const travel = Math.hypot(xAt(after) - xAt(before), yAt(after) - yAt(before));
  const coast = 1 - orientation;

  return {
    x: xAt(progress),
    y: yAt(progress),
    scale: mix(0.56, COLUMN_WIDTH / CARD_WIDTH, progress),
    yaw: -40 * coast,
    pitch: 23 * coast,
    roll: 28 * coast - 12 * Math.sin(Math.PI * orientation),
    stretch: 1 + Math.min(0.035, 0.0013 * travel),
    lighting: mix(0.6, 1, orientation),
    opacity: 1,
    settled: orientation,
  };
};

const TierCard: React.FC<{
  tier: typeof tiers[number];
  index: number;
  pose: ReturnType<typeof carouselPose>;
}> = ({ tier, index, pose }) => {
  const { x, y, scale, pitch, yaw, roll, opacity, stretch, lighting, settled } = pose;
  const radius = 29 * scale;
  const thickness = mix(8 * scale, 1.5, settled);

  return (
    <div style={{
      position: "absolute",
      left: x - CARD_WIDTH * scale / 2,
      top: y - CARD_HEIGHT * scale / 2,
      width: CARD_WIDTH * scale,
      height: CARD_HEIGHT * scale,
      transform: `perspective(1400px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(${1 / stretch}, ${stretch})`,
      opacity,
      zIndex: Math.round(1 + 92 * lighting) + tiers.length - index,
    }}>
      <AbsoluteFill style={{
        borderRadius: radius,
        background: tier.edge,
        transform: `translateY(${thickness}px)`,
        boxShadow: `0 ${mix(21, 8, settled) * scale}px ${mix(42, 19, settled) * scale}px #0009`,
      }} />
      <AbsoluteFill style={{
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        color: "#121216",
        background: `linear-gradient(122deg, ${tier.light}, ${tier.surface})`,
        boxShadow: "inset 0 1px 0 #fff5",
      }}>
        <div style={{
          fontWeight: 900,
          fontSize: tier.size * scale,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          marginTop: index === 3 ? 0 : 8 * scale,
          whiteSpace: "nowrap",
        }}>{tier.label}</div>
        <AbsoluteFill style={{ background: "#101117", opacity: 0.72 * (1 - lighting) }} />
      </AbsoluteFill>
    </div>
  );
};

const CardExposure: React.FC<{ frame: number }> = ({ frame }) => {
  const turn = turnAt(frame);
  const followTurn = turnAt(frame - 2.4);
  const speed = 23 * (turnAt(frame + 0.5) - turnAt(frame - 0.5));

  return <>
    {tiers.map((tier, index) => {
      const pose = frame < EXIT_END
        ? carouselPose(index, frame, turn, followTurn, speed)
        : dropPose(index, frame);
      // Leave room for the rotated card and its shadow before culling.
      if (pose.opacity === 0 || pose.y < -195 || pose.y > HEIGHT + 195) return null;
      return <TierCard key={tier.label} tier={tier} index={index} pose={pose} />;
    })}
  </>;
};

// Integrate nine sub-frame poses over a 1.65-frame shutter, with a slight
// bias toward earlier poses. Each exposure includes the cards' own occlusion.
const exposureWeights = [0.04, 0.07, 0.11, 0.17, 0.22, 0.17, 0.11, 0.07, 0.04];
const shutterLength = 1.65;
const shutterCenter = -0.23;
const CardMotionBlur: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame >= drops[drops.length - 1].end + 2) return <CardExposure frame={frame} />;

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      {exposureWeights.map((weight, index) => {
        const offset = shutterCenter + shutterLength * (index / (exposureWeights.length - 1) - 0.5);
        return (
          <AbsoluteFill
            key={index}
            style={{ mixBlendMode: "plus-lighter", filter: `opacity(${weight})` }}
          >
            <CardExposure frame={frame + offset} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const FocusFrame: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const landings = [25, ...tiers.map((_, index) => TURN_START + TURN_RAMP / 2 + (index + 1) * TURN_STEP)];
  const distance = Math.min(...landings.map((cue) => Math.abs(frame - cue)));
  const hit = Math.exp(-((distance / 4.8) ** 2));

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none", zIndex: 120 }}>
      <div style={{
        position: "absolute",
        left: FOCUS_X - CARD_WIDTH / 2 - 10,
        top: FOCUS_Y - CARD_HEIGHT / 2 - 10,
        width: CARD_WIDTH + 20,
        height: CARD_HEIGHT + 20,
        boxSizing: "border-box",
        borderRadius: 39,
        border: "2px solid #d4ab63",
        boxShadow: `0 0 ${13 + 22 * hit}px rgba(230, 163, 77, ${0.18 + 0.34 * hit}), inset 0 0 16px #d9a14526`,
      }} />
      <div style={{
        position: "absolute",
        left: FOCUS_X + CARD_WIDTH / 2 + 20,
        top: FOCUS_Y,
        width: 86,
        height: 1,
        background: "linear-gradient(90deg, #c59958, #c599581c)",
      }} />
      <div style={{
        position: "absolute",
        left: FOCUS_X + CARD_WIDTH / 2 + 25,
        top: FOCUS_Y - 3,
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#f2c888",
      }} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ opacity: number }> = ({ opacity }) => (
    <div style={{
      position: "absolute",
      left: 994,
      top: FOCUS_Y,
      width: 845,
      transform: "translateY(-50%)",
      color: "#f6efe4",
      opacity,
      fontSize: 150,
      fontWeight: 900,
      lineHeight: 1.04,
      letterSpacing: "-0.047em",
      zIndex: 121,
      whiteSpace: "nowrap",
    }}>
      <div>从<span style={{ color: "#ffc574", fontSize: "1.15em" }}>夯</span>到<span style={{ color: "#ffc574", fontSize: "1.15em" }}>拉</span></div>
      <div style={{ color: "#e6ddd0", fontSize: 116, marginTop: 9 }}>锐评随身WiFi</div>
    </div>
);

export const 从夯到拉: React.FC = () => {
  const frame = useCurrentFrame();
  const { delayRender, continueRender, cancelRender } = useDelayRender();

  useEffect(() => {
    const handle = delayRender("Loading 从夯到拉 fonts");
    ensureFontsLoaded().then(() => continueRender(handle), cancelRender);
  }, [cancelRender, continueRender, delayRender]);

  const pullback = ramp(frame, EXIT_START, drops[4].end, dockEase);
  const focusOpacity = ramp(frame, 14, 31, easeOut) * (1 - ramp(frame, EXIT_START + 2, EXIT_END, dockEase));

  return (
    <AbsoluteFill style={{ overflow: "hidden", isolation: "isolate", fontFamily: "'Alibaba PuHuiTi', sans-serif" }}>
      <Stage focusOpacity={focusOpacity} pullback={pullback} />
      <CardMotionBlur frame={frame} />
      <FocusFrame frame={frame} opacity={focusOpacity} />
      <Title opacity={ramp(frame, 13, 32, approach)} />
    </AbsoluteFill>
  );
};
