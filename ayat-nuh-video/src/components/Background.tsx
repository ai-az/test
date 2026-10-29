import { AbsoluteFill, random, useCurrentFrame } from "remotion";

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: random(`star-x-${i}`) * 1080,
  y: random(`star-y-${i}`) * 1920,
  r: 1 + random(`star-r-${i}`) * 2.2,
  phase: random(`star-p-${i}`) * 200,
  period: 40 + random(`star-t-${i}`) * 60,
}));

export const Background: React.FC<{ stars?: boolean }> = ({ stars = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      name="Background"
      style={{
        background:
          "linear-gradient(180deg, #050b18 0%, #0b1a33 45%, #10264a 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 15%, rgba(214,178,92,0.14) 0%, rgba(214,178,92,0) 70%)",
        }}
      />
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
                0.25 + 0.65 * Math.abs(Math.sin((frame + s.phase) / s.period))
              }
            />
          ))}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
