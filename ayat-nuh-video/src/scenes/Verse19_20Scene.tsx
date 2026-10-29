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

const PATHS = [
  "M -40 760 C 200 700 260 560 520 520 C 780 480 860 380 1120 330",
  "M -40 820 C 240 820 380 640 600 640 C 820 640 900 540 1120 470",
  "M -40 650 C 160 640 220 520 420 480 C 640 440 760 420 1120 380",
];

export const Verse19_20Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verses 19-20">
      <Background />
      <Interactive.Div
        name="Spread earth"
        style={{
          position: "absolute",
          left: 0,
          top: 230,
          width: 1080,
          height: 700,
          transformOrigin: "50% 50%",
          scale: interpolate(frame, [10, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg viewBox="0 0 1080 700" width={1080} height={700}>
          <defs>
            <linearGradient id="earthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3c7a4f" />
              <stop offset="1" stopColor="#1e4630" />
            </linearGradient>
          </defs>
          <path
            d="M 0 320 C 200 160 420 120 540 130 C 700 140 900 220 1080 300 L 1080 700 L 0 700 Z"
            fill="url(#earthGrad)"
          />
          <path
            d="M 0 330 C 200 180 420 140 540 150 C 700 160 900 240 1080 310"
            stroke="rgba(228,196,110,0.7)"
            strokeWidth={5}
            fill="none"
          />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Roads"
        style={{
          position: "absolute",
          left: 0,
          top: 230,
          width: 1080,
          height: 700,
        }}
      >
        <svg viewBox="0 0 1080 700" width={1080} height={700}>
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="#f1d78a"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray="22 26"
              fill="none"
              opacity={0.95}
              pathLength={1}
              strokeDashoffset={0}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: interpolate(
                  frame,
                  [105 + i * 18, 190 + i * 18],
                  [1, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.3, 0, 0.2, 1),
                  },
                ),
              }}
            />
          ))}
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "وَاللَّهُ جَعَلَ لَكُمُ الْأَرْضَ بِسَاطًا",
              number: "١٩",
              from: 15,
            },
            {
              text: "لِّتَسْلُكُوا مِنْهَا سُبُلًا فِجَاجًا",
              number: "٢٠",
              from: 105,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
