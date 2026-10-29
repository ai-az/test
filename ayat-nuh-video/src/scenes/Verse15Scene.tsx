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

const HEAVENS = [1, 2, 3, 4, 5, 6, 7];

export const Verse15Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 15">
      <Background />
      {HEAVENS.map((n) => (
        <Interactive.Div
          key={n}
          name="Heaven layer"
          style={{
            position: "absolute",
            left: 540 - (90 + n * 70),
            top: 900 - (90 + n * 70),
            width: (90 + n * 70) * 2,
            height: 90 + n * 70,
            borderTopLeftRadius: 90 + n * 70,
            borderTopRightRadius: 90 + n * 70,
            border: "3px solid rgba(228,196,110,0.85)",
            borderBottom: "none",
            background:
              "linear-gradient(180deg, rgba(228,196,110,0.09) 0%, rgba(228,196,110,0) 100%)",
            transformOrigin: "50% 100%",
            opacity: interpolate(frame, [n * 14 + 20, n * 14 + 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [n * 14 + 20, n * 14 + 60], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        />
      ))}
      <Interactive.Div
        name="Base line"
        style={{
          position: "absolute",
          left: 0,
          top: 900,
          width: 1080,
          height: 3,
          background:
            "linear-gradient(90deg, rgba(228,196,110,0), #e4c46e 50%, rgba(228,196,110,0))",
          opacity: interpolate(frame, [10, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
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
