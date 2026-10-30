import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { TextPanel } from "../components/TextPanel";
import { VerseText } from "../components/VerseText";
import { DrawPath, GlowDefs } from "../components/art";

const PHASES = [0.06, 0.22, 0.38, 0.5, 0.64, 0.82, 1];
const R = 44;

/** Lit part of a moon at phase p (0 = new, 0.5 = half, 1 = full), right side lit. */
const litPath = (p: number) => {
  const rx = Math.abs(Math.cos(Math.PI * p)) * R;
  const sweep = p < 0.5 ? 0 : 1;
  if (p >= 0.995)
    return `M 0 ${-R} A ${R} ${R} 0 1 1 0 ${R} A ${R} ${R} 0 1 1 0 ${-R} Z`;
  return `M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${rx} ${R} 0 0 ${sweep} 0 ${-R} Z`;
};

const MOONS = PHASES.map((p, i) => ({
  p,
  x: 120 + i * 140,
  y: 600 - Math.sin((i / 6) * Math.PI) * 150,
  from: 105 + i * 13,
}));

const ARC = `M ${MOONS[0].x} ${MOONS[0].y} Q 540 ${600 - 150 - 90} ${MOONS[6].x} ${MOONS[6].y}`;

export const Verse13_14Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verses 13-14">
      <Background />
      {[0, 1, 2].map((i) => (
        <Interactive.Div
          key={i}
          name="Pulse ring"
          style={{
            position: "absolute",
            left: 540 - 60,
            top: 520 - 60,
            width: 120,
            height: 120,
            borderRadius: 60,
            border: "1.5px solid rgba(228,196,110,0.8)",
            boxShadow: "0 0 24px rgba(228,196,110,0.35)",
            opacity: interpolate(
              frame,
              [i * 22, i * 22 + 10, 70 + i * 22, 95 + i * 22],
              [0, 0.9, 0.5, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            scale: interpolate(frame, [i * 22, 95 + i * 22], [0.2, 6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      ))}
      <Interactive.Div
        name="Moon phases"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
          opacity: interpolate(frame, [95, 115], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={1000} viewBox="0 0 1080 1000">
          <GlowDefs id="v13" />
          <DrawPath
            d={ARC}
            from={100}
            duration={90}
            strokeWidth={1.5}
            opacity={0.55}
            dashed
          />
          {MOONS.map((m, i) => (
            <g
              key={i}
              transform={`translate(${m.x} ${m.y}) scale(${interpolate(
                frame,
                [m.from, m.from + 28],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.spring({ damping: 13, stiffness: 120 }),
                },
              )})`}
            >
              <circle
                r={R + 18}
                fill="#f7e3a6"
                opacity={0.12 * m.p}
                filter="url(#v13-glow)"
              />
              <circle
                r={R}
                fill="#101c33"
                stroke="rgba(228,196,110,0.5)"
                strokeWidth={1.2}
              />
              <path
                d={litPath(m.p)}
                fill="url(#v13-gold)"
                filter="url(#v13-soft)"
              />
            </g>
          ))}
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "مَّا لَكُمْ لَا تَرْجُونَ لِلَّهِ وَقَارًا",
              number: "١٣",
              from: 15,
            },
            { text: "وَقَدْ خَلَقَكُمْ أَطْوَارًا", number: "١٤", from: 100 },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
