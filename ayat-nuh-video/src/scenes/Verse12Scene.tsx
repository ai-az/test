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

const FRONDS = [-70, -40, -12, 12, 40, 70];

const Palm: React.FC<{ x: number; y: number; from: number; size: number }> = ({
  x,
  y,
  from,
  size,
}) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Palm"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 300,
        height: 420,
        transformOrigin: "50% 100%",
        scale: interpolate(frame, [from, from + 50], [0, size], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 14, stiffness: 90 }),
        }),
      }}
    >
      <svg viewBox="-150 -360 300 420" width={300} height={420}>
        <path d="M -14 60 Q -6 -120 0 -260 Q 6 -120 14 60 Z" fill="#7a5230" />
        {FRONDS.map((a) => (
          <path
            key={a}
            d="M 0 0 C 30 -60 110 -90 170 -40 C 110 -70 50 -40 0 0 Z"
            fill="#3f9a5a"
            transform={`translate(0 -260) rotate(${a - 90}) `}
          />
        ))}
        <circle cx={-10} cy={-250} r={9} fill="#e4a84c" />
        <circle cx={8} cy={-244} r={9} fill="#e4a84c" />
        <circle cx={0} cy={-236} r={9} fill="#d9892c" />
      </svg>
    </Interactive.Div>
  );
};

export const Verse12Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 12">
      <Background />
      <Interactive.Div
        name="Hills"
        style={{
          position: "absolute",
          left: -150,
          top: 700,
          width: 1380,
          height: 500,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #2e6b45 0%, #1b4029 100%)",
          opacity: interpolate(frame, [0, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Palm x={110} y={540} from={30} size={1} />
      <Palm x={380} y={480} from={45} size={1.2} />
      <Palm x={690} y={540} from={60} size={1} />
      <Interactive.Div
        name="River"
        style={{
          position: "absolute",
          left: 0,
          top: 880,
          width: 1080,
          height: 220,
          overflow: "hidden",
          opacity: interpolate(frame, [110, 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [110, 160], [0.1, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg width={2160} height={220} style={{ position: "absolute" }}>
          <path
            d="M 0 110 Q 135 40 270 110 T 540 110 T 810 110 T 1080 110 T 1350 110 T 1620 110 T 1890 110 T 2160 110 L 2160 220 L 0 220 Z"
            fill="#2f7fd1"
            transform={`translate(${-((frame * 5) % 540)} 0)`}
          />
          <path
            d="M 0 150 Q 135 90 270 150 T 540 150 T 810 150 T 1080 150 T 1350 150 T 1620 150 T 1890 150 T 2160 150 L 2160 220 L 0 220 Z"
            fill="#5aa8f0"
            opacity={0.8}
            transform={`translate(${-((frame * 8) % 540)} 0)`}
          />
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={60}
          verses={[
            {
              text: "وَيُمْدِدْكُم بِأَمْوَالٍ وَبَنِينَ وَيَجْعَل لَّكُمْ جَنَّاتٍ وَيَجْعَل لَّكُمْ أَنْهَارًا",
              number: "١٢",
              from: 30,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
