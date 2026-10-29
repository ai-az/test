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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro">
      <Background />
      <Interactive.Div
        name="Glow"
        style={{
          position: "absolute",
          left: 240,
          top: 660,
          width: 600,
          height: 600,
          borderRadius: 300,
          background:
            "radial-gradient(circle, rgba(228,196,110,0.35) 0%, rgba(228,196,110,0) 65%)",
          opacity: interpolate(frame, [0, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 110], [0.6, 1.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Ornament y={760} from={10} />
      <Interactive.Div
        name="Surah title"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 820,
          textAlign: "center",
          direction: "rtl",
          fontFamily: quranFont,
          fontSize: 150,
          lineHeight: 1.6,
          color: "#f6efe0",
          textShadow: "0 0 40px rgba(228,196,110,0.4)",
          opacity: interpolate(frame, [12, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [12, 60], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        سُورَةُ نُوحٍ
      </Interactive.Div>
      <Interactive.Div
        name="Verse range"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1090,
          textAlign: "center",
          direction: "rtl",
          fontFamily: kufiFont,
          fontSize: 62,
          letterSpacing: 2,
          color: "#e4c46e",
          opacity: interpolate(frame, [40, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [40, 70], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        الآيات ١٠ – ٢٠
      </Interactive.Div>
      <Ornament y={1200} from={50} />
    </AbsoluteFill>
  );
};
