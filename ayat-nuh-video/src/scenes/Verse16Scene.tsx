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

const RAYS = Array.from({ length: 16 }, (_, i) => i);

export const Verse16Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 16">
      <Background />
      <Interactive.Div
        name="Moon glow"
        style={{
          position: "absolute",
          left: 90,
          top: 300,
          width: 440,
          height: 440,
          borderRadius: 220,
          background:
            "radial-gradient(circle, rgba(230,236,255,0.5) 0%, rgba(230,236,255,0) 70%)",
          opacity: interpolate(frame, [10, 50, 120, 150], [0, 1, 1, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 90], [0.3, 1.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Moon"
        style={{
          position: "absolute",
          left: 190,
          top: 400,
          width: 240,
          height: 240,
          opacity: interpolate(frame, [10, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 60], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [10, 60], ["-40deg", "0deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg viewBox="0 0 240 240" width={240} height={240}>
          <defs>
            <mask id="crescent">
              <rect width="240" height="240" fill="white" />
              <circle cx="165" cy="100" r="95" fill="black" />
            </mask>
          </defs>
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="#f3f1e6"
            mask="url(#crescent)"
          />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Sun rays"
        style={{
          position: "absolute",
          left: 540,
          top: 320,
          width: 460,
          height: 460,
          opacity: interpolate(frame, [95, 130], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: interpolate(frame, [0, 210], ["0deg", "90deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [95, 150], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <svg viewBox="-230 -230 460 460" width={460} height={460}>
          {RAYS.map((i) => (
            <line
              key={i}
              x1={0}
              y1={-120}
              x2={0}
              y2={i % 2 === 0 ? -215 : -180}
              stroke="#f0b63a"
              strokeWidth={14}
              strokeLinecap="round"
              transform={`rotate(${i * 22.5})`}
            />
          ))}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Sun"
        style={{
          position: "absolute",
          left: 670,
          top: 450,
          width: 200,
          height: 200,
          borderRadius: 100,
          background:
            "radial-gradient(circle at 40% 35%, #fff2b0 0%, #f6c445 55%, #e0931f 100%)",
          boxShadow: "0 0 90px rgba(246,196,69,0.7)",
          opacity: interpolate(frame, [95, 125], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [95, 150], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      />
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "وَجَعَلَ الْقَمَرَ فِيهِنَّ نُورًا وَجَعَلَ الشَّمْسَ سِرَاجًا",
              number: "١٦",
              from: 15,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
