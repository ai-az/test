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

const RAYS = Array.from({ length: 24 }, (_, i) => i);

export const Verse10Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 10">
      <Background />
      <Interactive.Div
        name="Light rays"
        style={{
          position: "absolute",
          left: 40,
          top: 100,
          width: 1000,
          height: 1000,
          opacity: interpolate(frame, [0, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: interpolate(frame, [0, 180], ["0deg", "40deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 80], [0.5, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <svg viewBox="-500 -500 1000 1000" width={1000} height={1000}>
          <defs>
            <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e4c46e" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e4c46e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {RAYS.map((i) => (
            <polygon
              key={i}
              points="0,0 -26,-520 26,-520"
              fill="url(#ray)"
              transform={`rotate(${i * 15})`}
              opacity={i % 2 === 0 ? 0.9 : 0.45}
            />
          ))}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Core light"
        style={{
          position: "absolute",
          left: 390,
          top: 450,
          width: 300,
          height: 300,
          borderRadius: 150,
          background:
            "radial-gradient(circle, rgba(255,246,214,1) 0%, rgba(228,196,110,0.6) 35%, rgba(228,196,110,0) 70%)",
          opacity: interpolate(frame, [10, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 60, 110, 160], [0.3, 1, 1.12, 1], {
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
