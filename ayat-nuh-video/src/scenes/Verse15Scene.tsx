import {
  AbsoluteFill,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { TextPanel } from "../components/TextPanel";
import { VerseText } from "../components/VerseText";
import { DrawPath, GlowDefs } from "../components/art";

const CX = 540;
const CY = 860;
const HEAVENS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  n,
  r: 70 + n * 68,
  from: 18 + n * 14,
}));
const arc = (r: number) =>
  `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`;

const DUST = Array.from({ length: 60 }, (_, i) => {
  const ring = 1 + Math.floor(random(`dust-ring-${i}`) * 6);
  const r = 70 + ring * 68 + 34;
  const a = Math.PI + random(`dust-a-${i}`) * Math.PI;
  return {
    x: CX + Math.cos(a) * r,
    y: CY + Math.sin(a) * r,
    s: 1 + random(`dust-s-${i}`) * 1.6,
    from: 40 + ring * 14,
    phase: random(`dust-p-${i}`) * 90,
  };
});

export const Verse15Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 15">
      <Background />
      <Interactive.Div
        name="Horizon glow"
        style={{
          position: "absolute",
          left: 90,
          top: 640,
          width: 900,
          height: 440,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(228,196,110,0.35) 0%, rgba(228,196,110,0) 65%)",
          opacity: interpolate(frame, [10, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Heavens"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
        }}
      >
        <svg width={1080} height={1000} viewBox="0 0 1080 1000">
          <GlowDefs id="v15" />
          {HEAVENS.map((h) => (
            <g key={h.n}>
              <DrawPath
                d={arc(h.r)}
                from={h.from}
                duration={50}
                strokeWidth={h.n === 7 ? 3.5 : 2.2}
                stroke="url(#v15-gold)"
                filter="url(#v15-glow)"
              />
              <DrawPath
                d={arc(h.r - 14)}
                from={h.from + 8}
                duration={50}
                strokeWidth={1}
                opacity={0.45}
                dashed
              />
            </g>
          ))}
          <g transform={`rotate(${frame * 0.15} ${CX} ${CY})`}>
            <circle
              cx={CX}
              cy={CY}
              r={70 + 7 * 68 + 30}
              fill="none"
              stroke="#e4c46e"
              strokeWidth={1}
              strokeDasharray="3 14"
              opacity={interpolate(frame, [120, 160], [0, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          </g>
          {DUST.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.s}
              fill="#f7e3a6"
              opacity={interpolate(
                frame,
                [d.from, d.from + 20],
                [0, 0.3 + 0.7 * Math.abs(Math.sin((frame + d.phase) / 22))],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            />
          ))}
          <line
            x1={0}
            y1={CY}
            x2={1080}
            y2={CY}
            stroke="#e4c46e"
            strokeWidth={2}
            opacity={interpolate(frame, [5, 35], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "أَلَمْ تَرَوْا كَيْفَ خَلَقَ اللَّهُ سَبْعَ سَمَاوَاتٍ طِبَاقًا",
              number: "١٥",
              from: 20,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
