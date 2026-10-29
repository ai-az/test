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

const STAGES = [
  { x: 140, r: 22, from: 100 },
  { x: 340, r: 40, from: 118 },
  { x: 540, r: 60, from: 136 },
  { x: 740, r: 82, from: 154 },
  { x: 940, r: 106, from: 172 },
];

export const Verse13_14Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verses 13-14">
      <Background />
      <Interactive.Div
        name="Question glow"
        style={{
          position: "absolute",
          left: 190,
          top: 250,
          width: 700,
          height: 700,
          borderRadius: 350,
          border: "2px solid rgba(228,196,110,0.5)",
          opacity: interpolate(frame, [0, 30, 90, 120], [0, 0.9, 0.9, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 120], [0.4, 1.25], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Question glow 2"
        style={{
          position: "absolute",
          left: 290,
          top: 350,
          width: 500,
          height: 500,
          borderRadius: 250,
          border: "2px solid rgba(228,196,110,0.35)",
          opacity: interpolate(frame, [15, 45, 90, 120], [0, 0.9, 0.9, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [15, 120], [0.4, 1.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Stages line"
        style={{
          position: "absolute",
          left: 140,
          top: 598,
          height: 4,
          background: "linear-gradient(90deg, rgba(228,196,110,0.2), #e4c46e)",
          width: interpolate(frame, [100, 190], [0, 800], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      {STAGES.map((s, i) => (
        <Interactive.Div
          key={i}
          name="Stage"
          style={{
            position: "absolute",
            left: s.x - s.r,
            top: 600 - s.r,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #fff1c2 0%, #e4c46e 45%, #9b7a2c 100%)",
            boxShadow: "0 0 40px rgba(228,196,110,0.45)",
            scale: interpolate(frame, [s.from, s.from + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12, stiffness: 110 }),
            }),
          }}
        />
      ))}
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "مَّا لَكُمْ لَا تَرْجُونَ لِلَّهِ وَقَارًا",
              number: "١٣",
              from: 15,
            },
            {
              text: "وَقَدْ خَلَقَكُمْ أَطْوَارًا",
              number: "١٤",
              from: 100,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
