import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { GlowDefs, Rosette } from "../components/art";
import { kufiFont, quranFont } from "../fonts";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro">
      <Background />
      <Interactive.Div
        name="Rosette"
        style={{
          position: "absolute",
          left: 90,
          top: 510,
          width: 900,
          height: 900,
          opacity: 0.55,
          rotate: interpolate(frame, [0, 110], ["-8deg", "4deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 110], [0.9, 1.02], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg viewBox="-450 -450 900 900" width={900} height={900}>
          <GlowDefs id="intro" />
          <Rosette r={380} from={0} filter="url(#intro-glow)" />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Text backdrop"
        style={{
          position: "absolute",
          left: 190,
          top: 610,
          width: 700,
          height: 700,
          borderRadius: 350,
          background:
            "radial-gradient(circle, rgba(6,12,26,0.95) 0%, rgba(6,12,26,0.85) 35%, rgba(6,12,26,0) 70%)",
          opacity: interpolate(frame, [15, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
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
            "radial-gradient(circle, rgba(228,196,110,0.28) 0%, rgba(228,196,110,0) 65%)",
          opacity: interpolate(frame, [20, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Surah title"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 800,
          textAlign: "center",
          direction: "rtl",
          fontFamily: quranFont,
          fontSize: 150,
          lineHeight: 1.6,
          color: "#f6efe0",
          textShadow: "0 0 40px rgba(228,196,110,0.5)",
          opacity: interpolate(frame, [30, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [30, 80], [0.85, 1], {
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
          top: 1070,
          textAlign: "center",
          direction: "rtl",
          fontFamily: kufiFont,
          fontSize: 56,
          letterSpacing: 2,
          color: "#e4c46e",
          opacity: interpolate(frame, [55, 85], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [55, 85], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        الآيات ١٠ – ٢٠
      </Interactive.Div>
    </AbsoluteFill>
  );
};
