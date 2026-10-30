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

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro">
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
          rotate: interpolate(frame, [0, 120], ["0deg", "12deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg viewBox="-450 -450 900 900" width={900} height={900}>
          <GlowDefs id="outro" />
          <Rosette r={380} from={0} filter="url(#outro-glow)" />
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
          textShadow: "0 0 40px rgba(228,196,110,0.5)",
          opacity: interpolate(frame, [20, 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [20, 80], [0.9, 1], {
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
          top: 1050,
          textAlign: "center",
          direction: "rtl",
          fontFamily: kufiFont,
          fontSize: 44,
          color: "#e4c46e",
          opacity: interpolate(frame, [50, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        سورة نوح · الآيات ١٠ – ٢٠
      </Interactive.Div>
    </AbsoluteFill>
  );
};
