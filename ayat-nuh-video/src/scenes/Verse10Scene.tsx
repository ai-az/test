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
import { GlowDefs, Rosette } from "../components/art";

const RAYS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i * 360) / 14 + random(`ray-a-${i}`) * 12,
  width: 30 + random(`ray-w-${i}`) * 60,
  length: 420 + random(`ray-l-${i}`) * 260,
  opacity: 0.25 + random(`ray-o-${i}`) * 0.5,
}));

const SPARKS = Array.from({ length: 40 }, (_, i) => ({
  x: 540 + (random(`sp-x-${i}`) - 0.5) * 700,
  y: random(`sp-y-${i}`) * 900,
  r: 1.5 + random(`sp-r-${i}`) * 3,
  speed: 0.6 + random(`sp-s-${i}`) * 1.4,
  phase: random(`sp-p-${i}`) * 100,
}));

export const Verse10Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 10">
      <Background />
      <Interactive.Div
        name="Soft rays"
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 1000,
          height: 1000,
          filter: "blur(22px)",
          opacity: interpolate(frame, [0, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: interpolate(frame, [0, 180], ["0deg", "25deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 90], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <svg viewBox="-500 -500 1000 1000" width={1000} height={1000}>
          <defs>
            <linearGradient id="v10-ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f7e3a6" stopOpacity="0.9" />
              <stop offset="1" stopColor="#e4c46e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {RAYS.map((r, i) => (
            <polygon
              key={i}
              points={`0,0 ${-r.width / 2},${-r.length} ${r.width / 2},${-r.length}`}
              fill="url(#v10-ray)"
              opacity={r.opacity}
              transform={`rotate(${r.angle})`}
            />
          ))}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Rosette ring"
        style={{
          position: "absolute",
          left: 190,
          top: 190,
          width: 700,
          height: 700,
          rotate: interpolate(frame, [0, 180], ["0deg", "30deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg viewBox="-350 -350 700 700" width={700} height={700}>
          <GlowDefs id="v10" />
          <Rosette r={290} from={10} filter="url(#v10-glow)" />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Core light"
        style={{
          position: "absolute",
          left: 400,
          top: 400,
          width: 280,
          height: 280,
          borderRadius: 140,
          background:
            "radial-gradient(circle, rgba(255,250,230,1) 0%, rgba(247,227,166,0.8) 22%, rgba(228,196,110,0.25) 50%, rgba(228,196,110,0) 72%)",
          opacity: interpolate(frame, [10, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 70, 120, 170], [0.2, 1, 1.15, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.inOut(Easing.sin),
              Easing.inOut(Easing.sin),
            ],
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Rising sparks"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
          opacity: interpolate(frame, [30, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={1000}>
          {SPARKS.map((s, i) => {
            const y = (((s.y - frame * s.speed) % 1000) + 1000) % 1000;
            return (
              <circle
                key={i}
                cx={s.x + Math.sin((frame + s.phase) / 30) * 10}
                cy={y}
                r={s.r}
                fill="#f7e3a6"
                opacity={0.3 + 0.7 * Math.abs(Math.sin((frame + s.phase) / 25))}
              />
            );
          })}
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={64}
          verses={[
            {
              text: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
              number: "١٠",
              from: 20,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
