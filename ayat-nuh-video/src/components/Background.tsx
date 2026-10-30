import {
  AbsoluteFill,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: random(`star-x-${i}`) * 1080,
  y: random(`star-y-${i}`) * 1920,
  r: 0.8 + random(`star-r-${i}`) * 1.8,
  phase: random(`star-p-${i}`) * 200,
  period: 40 + random(`star-t-${i}`) * 60,
}));

const BOKEH = Array.from({ length: 26 }, (_, i) => ({
  x: random(`bk-x-${i}`) * 1080,
  y: random(`bk-y-${i}`) * 1920,
  r: 6 + random(`bk-r-${i}`) * 22,
  speed: 0.25 + random(`bk-s-${i}`) * 0.6,
  drift: (random(`bk-d-${i}`) - 0.5) * 0.4,
  phase: random(`bk-p-${i}`) * 300,
  period: 60 + random(`bk-t-${i}`) * 90,
}));

/** A tiling Islamic star pattern, very faint, slowly drifting. */
const TILE = 180;
const STAR_TILE = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 === 0 ? 80 : 34;
    const t = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(
      `${(90 + Math.cos(t) * rad).toFixed(1)} ${(90 + Math.sin(t) * rad).toFixed(1)}`,
    );
  }
  return `M ${pts.join(" L ")} Z`;
})();

export const Background: React.FC<{ stars?: boolean }> = ({ stars = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      name="Background"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 110%, #16305a 0%, #0b1a35 45%, #040914 100%)",
      }}
    >
      <Interactive.Div
        name="Geometric pattern"
        style={{
          position: "absolute",
          left: -200,
          top: -200,
          width: 1480,
          height: 2320,
          opacity: 0.16,
          translate: interpolate(frame, [0, 300], ["0px 0px", "-60px -60px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          maskImage:
            "radial-gradient(ellipse 60% 45% at 50% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 45% at 50% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <svg width={1480} height={2320}>
          <defs>
            <pattern
              id="bg-tile"
              width={TILE}
              height={TILE}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={STAR_TILE}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={1}
              />
              <rect
                x={60}
                y={60}
                width={60}
                height={60}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={0.8}
                transform="rotate(45 90 90)"
              />
              <circle
                cx={0}
                cy={0}
                r={14}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={0.8}
              />
              <circle
                cx={180}
                cy={0}
                r={14}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={0.8}
              />
              <circle
                cx={0}
                cy={180}
                r={14}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={0.8}
              />
              <circle
                cx={180}
                cy={180}
                r={14}
                fill="none"
                stroke="#e4c46e"
                strokeWidth={0.8}
              />
            </pattern>
          </defs>
          <rect width={1480} height={2320} fill="url(#bg-tile)" />
        </svg>
      </Interactive.Div>
      {stars ? (
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#f6efe0"
              opacity={
                0.2 + 0.6 * Math.abs(Math.sin((frame + s.phase) / s.period))
              }
            />
          ))}
        </svg>
      ) : null}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", filter: "blur(3px)" }}
      >
        {BOKEH.map((b, i) => {
          const y = ((((b.y - frame * b.speed) % 2000) + 2000) % 2000) - 40;
          const x =
            b.x + Math.sin((frame + b.phase) / 50) * 18 + frame * b.drift;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={b.r}
              fill="#e4c46e"
              opacity={
                0.05 + 0.14 * Math.abs(Math.sin((frame + b.phase) / b.period))
              }
            />
          );
        })}
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
