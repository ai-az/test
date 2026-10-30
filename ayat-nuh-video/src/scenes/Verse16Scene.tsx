import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { TextPanel } from "../components/TextPanel";
import { VerseText } from "../components/VerseText";
import { DrawPath, GlowDefs } from "../components/art";

const RAYS = Array.from({ length: 36 }, (_, i) => i);
const MOON_STARS = Array.from({ length: 12 }, (_, i) => ({
  x: 110 + random(`ms-x-${i}`) * 330,
  y: 250 + random(`ms-y-${i}`) * 330,
  s: 1.5 + random(`ms-s-${i}`) * 2.5,
  from: 50 + random(`ms-f-${i}`) * 50,
}));

// Crescent: outer circle r=110, inner cut circle offset to the right
const CRESCENT = "M 120 10 A 110 110 0 1 0 120 230 A 92 92 0 1 1 120 10 Z";

export const Verse16Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 16">
      <Background />
      <Interactive.Div
        name="Moon glow"
        style={{
          position: "absolute",
          left: 60,
          top: 230,
          width: 440,
          height: 440,
          borderRadius: 220,
          background:
            "radial-gradient(circle, rgba(236,240,255,0.45) 0%, rgba(236,240,255,0) 68%)",
          opacity: interpolate(frame, [15, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [15, 110], [0.3, 1.25], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Moon"
        style={{
          position: "absolute",
          left: 160,
          top: 330,
          width: 240,
          height: 240,
          rotate: interpolate(frame, [10, 80], ["-30deg", "-12deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg
          viewBox="0 0 240 240"
          width={240}
          height={240}
          style={{ overflow: "visible" }}
        >
          <GlowDefs id="v16m" />
          <DrawPath
            d={CRESCENT}
            from={10}
            duration={60}
            stroke="#f3f1e6"
            strokeWidth={3}
            filter="url(#v16m-glow)"
            fill="rgba(243,241,230,0.92)"
            fillFrom={55}
          />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Moon stars"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
        }}
      >
        <svg width={1080} height={1000}>
          {MOON_STARS.map((s, i) => (
            <g
              key={i}
              transform={`translate(${s.x} ${s.y})`}
              opacity={interpolate(
                frame,
                [s.from, s.from + 15],
                [0, 0.5 + 0.5 * Math.abs(Math.sin((frame + i * 9) / 18))],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )}
            >
              <path
                d={`M 0 ${-s.s * 3} Q 0 0 ${s.s * 3} 0 Q 0 0 0 ${s.s * 3} Q 0 0 ${-s.s * 3} 0 Q 0 0 0 ${-s.s * 3} Z`}
                fill="#f6efe0"
              />
            </g>
          ))}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Sun"
        style={{
          position: "absolute",
          left: 520,
          top: 250,
          width: 520,
          height: 520,
          opacity: interpolate(frame, [95, 125], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [95, 160], [0.3, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <svg viewBox="-260 -260 520 520" width={520} height={520}>
          <GlowDefs id="v16s" />
          <defs>
            <radialGradient id="v16-core">
              <stop offset="0" stopColor="#fff6d2" />
              <stop offset="0.55" stopColor="#f7d777" />
              <stop offset="1" stopColor="#e0a53a" />
            </radialGradient>
            <radialGradient id="v16-halo">
              <stop offset="0.45" stopColor="#f7d777" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f7d777" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle r={250} fill="url(#v16-halo)" />
          <g transform={`rotate(${frame * 0.4})`}>
            {RAYS.map((i) => (
              <line
                key={i}
                x1={0}
                y1={-128}
                x2={0}
                y2={i % 3 === 0 ? -215 : i % 3 === 1 ? -170 : -150}
                stroke="#f7e3a6"
                strokeWidth={i % 3 === 0 ? 3 : 1.5}
                strokeLinecap="round"
                opacity={interpolate(
                  frame,
                  [120 + i * 1.2, 135 + i * 1.2],
                  [0, 0.9],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                )}
                transform={`rotate(${i * 10})`}
              />
            ))}
          </g>
          <g transform={`rotate(${-frame * 0.25})`}>
            <circle
              r={118}
              fill="none"
              stroke="#e4c46e"
              strokeWidth={1.2}
              strokeDasharray="4 10"
              opacity={0.8}
            />
          </g>
          <circle
            r={104}
            fill="none"
            stroke="#f7e3a6"
            strokeWidth={2}
            filter="url(#v16s-glow)"
          />
          <circle r={88} fill="url(#v16-core)" filter="url(#v16s-glow)" />
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "وَجَعَلَ الْقَمَرَ فِيهِنَّ نُورًا وَجَعَلَ الشَّمْسَ سِرَاجًا",
              number: "١٦",
              from: 15,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
