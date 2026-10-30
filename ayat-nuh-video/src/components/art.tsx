import { Easing, interpolate, useCurrentFrame } from "remotion";

export const GOLD = "#e4c46e";
export const GOLD_LIGHT = "#f7e3a6";

/** SVG filter definitions shared by the line-art scenes. Pass a unique id prefix per scene. */
export const GlowDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f7e3a6" />
      <stop offset="0.5" stopColor="#e4c46e" />
      <stop offset="1" stopColor="#b8923c" />
    </linearGradient>
  </defs>
);

/** A stroke that draws itself on between `from` and `from + duration`. */
export const DrawPath: React.FC<{
  d: string;
  from: number;
  duration: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  filter?: string;
  fill?: string;
  fillFrom?: number;
  dashed?: boolean;
}> = ({
  d,
  from,
  duration,
  stroke = "#e4c46e",
  strokeWidth = 3,
  opacity = 1,
  filter,
  fill = "none",
  fillFrom,
  dashed = false,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const fillOpacity =
    fill === "none"
      ? 0
      : interpolate(
          frame,
          [fillFrom ?? from + duration, (fillFrom ?? from + duration) + 25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
  return (
    <>
      {fill !== "none" ? (
        <path d={d} fill={fill} opacity={fillOpacity} stroke="none" />
      ) : null}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={filter}
        opacity={opacity}
        style={{
          strokeDasharray: dashed ? "0.012 0.012" : 1,
          strokeDashoffset: dashed ? 0 : 1 - progress,
          opacity: dashed ? opacity * progress : opacity,
        }}
      />
    </>
  );
};

/** Islamic eight-point rosette drawn as line art. Centered at 0,0 with radius r. */
export const Rosette: React.FC<{
  r: number;
  from: number;
  stroke?: string;
  filter?: string;
}> = ({ r, from, stroke = "#e4c46e", filter }) => {
  const sq = (rot: number) => {
    const pts = [0, 90, 180, 270].map((a) => {
      const t = ((a + rot) * Math.PI) / 180;
      return `${(Math.cos(t) * r).toFixed(1)} ${(Math.sin(t) * r).toFixed(1)}`;
    });
    return `M ${pts[0]} L ${pts[1]} L ${pts[2]} L ${pts[3]} Z`;
  };
  const star = (() => {
    const pts: string[] = [];
    for (let i = 0; i < 16; i++) {
      const rad = i % 2 === 0 ? r * 0.62 : r * 0.3;
      const t = (i * Math.PI) / 8 - Math.PI / 2;
      pts.push(
        `${(Math.cos(t) * rad).toFixed(1)} ${(Math.sin(t) * rad).toFixed(1)}`,
      );
    }
    return `M ${pts.join(" L ")} Z`;
  })();
  const circle = `M ${r * 1.12} 0 A ${r * 1.12} ${r * 1.12} 0 1 1 ${-r * 1.12} 0 A ${r * 1.12} ${r * 1.12} 0 1 1 ${r * 1.12} 0`;
  return (
    <g>
      <DrawPath
        d={circle}
        from={from}
        duration={60}
        stroke={stroke}
        strokeWidth={1.5}
        opacity={0.6}
      />
      <DrawPath
        d={sq(0)}
        from={from + 10}
        duration={50}
        stroke={stroke}
        strokeWidth={2.5}
        filter={filter}
      />
      <DrawPath
        d={sq(45)}
        from={from + 20}
        duration={50}
        stroke={stroke}
        strokeWidth={2.5}
        filter={filter}
      />
      <DrawPath
        d={star}
        from={from + 40}
        duration={60}
        stroke={stroke}
        strokeWidth={2}
        filter={filter}
        fill="rgba(228,196,110,0.08)"
      />
    </g>
  );
};
