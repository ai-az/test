import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { Ornament } from "../components/Ornament";
import { kufiFont, quranFont } from "../fonts";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro">
      <Background />
      <Ornament y={800} from={0} />
      <Interactive.Div
        name="Closing"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 850,
          textAlign: "center",
          direction: "rtl",
          fontFamily: quranFont,
          fontSize: 96,
          lineHeight: 1.8,
          color: "#f6efe0",
          textShadow: "0 0 40px rgba(228,196,110,0.4)",
          opacity: interpolate(frame, [10, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 70], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        صَدَقَ اللَّهُ الْعَظِيمُ
      </Interactive.Div>
      <Interactive.Div
        name="Source"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1060,
          textAlign: "center",
          direction: "rtl",
          fontFamily: kufiFont,
          fontSize: 44,
          color: "#e4c46e",
          opacity: interpolate(frame, [40, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        سورة نوح · الآيات ١٠ – ٢٠
      </Interactive.Div>
      <Ornament y={1150} from={30} />
    </AbsoluteFill>
  );
};
