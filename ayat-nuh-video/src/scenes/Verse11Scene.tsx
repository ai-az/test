import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Background } from "../components/Background";
import { TextPanel } from "../components/TextPanel";
import { VerseText } from "../components/VerseText";
import { DrawPath, GlowDefs } from "../components/art";

const FAR = Array.from({ length: 90 }, (_, i) => ({
  x: random(`far-x-${i}`) * 1080,
  len: 30 + random(`far-l-${i}`) * 50,
  speed: 14 + random(`far-s-${i}`) * 8,
  offset: random(`far-o-${i}`) * 2000,
  opacity: 0.12 + random(`far-a-${i}`) * 0.2,
}));
const NEAR = Array.from({ length: 50 }, (_, i) => ({
  x: random(`near-x-${i}`) * 1080,
  len: 70 + random(`near-l-${i}`) * 90,
  speed: 28 + random(`near-s-${i}`) * 14,
  offset: random(`near-o-${i}`) * 2000,
  opacity: 0.35 + random(`near-a-${i}`) * 0.45,
}));
const RIPPLES = Array.from({ length: 14 }, (_, i) => ({
  x: 60 + random(`rip-x-${i}`) * 960,
  offset: random(`rip-o-${i}`) * 50,
  size: 18 + random(`rip-s-${i}`) * 26,
}));

const CLOUD_A =
  "M 150 300 C 90 300 60 250 95 215 C 70 160 150 130 185 165 C 200 95 320 85 345 155 C 400 125 460 170 440 220 C 500 225 500 300 440 300 Z";
const CLOUD_B =
  "M 560 250 C 500 250 470 200 505 170 C 490 110 580 85 615 125 C 640 55 770 50 790 130 C 850 105 910 150 885 200 C 950 205 950 250 890 250 Z";

export const Verse11Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 11">
      <Background />
      <Interactive.Div
        name="Far rain"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          filter: "blur(1.5px)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.25) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.25) 100%)",
          opacity: interpolate(frame, [40, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={1920}>
          {FAR.map((d, i) => {
            const y = ((frame * d.speed + d.offset) % 2100) - 150;
            return (
              <line
                key={i}
                x1={d.x}
                y1={y}
                x2={d.x - 4}
                y2={y + d.len}
                stroke="#cfe0ff"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={d.opacity}
              />
            );
          })}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Near rain"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.25) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.25) 100%)",
          opacity: interpolate(frame, [45, 95], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={1920}>
          <defs>
            <linearGradient id="v11-drop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#dbe9ff" stopOpacity="0" />
              <stop offset="1" stopColor="#f3f8ff" stopOpacity="1" />
            </linearGradient>
          </defs>
          {NEAR.map((d, i) => {
            const y = ((frame * d.speed + d.offset) % 2100) - 150;
            return (
              <rect
                key={i}
                x={d.x}
                y={y}
                width={3}
                height={d.len}
                rx={1.5}
                fill="url(#v11-drop)"
                opacity={d.opacity}
                transform={`skewX(-4)`}
              />
            );
          })}
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Clouds"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 400,
          translate: interpolate(frame, [0, 60], ["0px -120px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg width={1080} height={400}>
          <GlowDefs id="v11" />
          <DrawPath
            d={CLOUD_A}
            from={0}
            duration={55}
            strokeWidth={3}
            filter="url(#v11-glow)"
            fill="rgba(228,196,110,0.07)"
            fillFrom={40}
          />
          <DrawPath
            d={CLOUD_B}
            from={12}
            duration={55}
            strokeWidth={3}
            filter="url(#v11-glow)"
            fill="rgba(228,196,110,0.07)"
            fillFrom={52}
          />
          <DrawPath
            d="M 320 345 C 360 330 400 330 440 345"
            from={50}
            duration={20}
            strokeWidth={2}
            opacity={0.6}
          />
          <DrawPath
            d="M 700 300 C 740 285 780 285 820 300"
            from={56}
            duration={20}
            strokeWidth={2}
            opacity={0.6}
          />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Ground line"
        style={{
          position: "absolute",
          left: 0,
          top: 900,
          width: 1080,
          height: 120,
          opacity: interpolate(frame, [20, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={120}>
          <line
            x1={0}
            y1={60}
            x2={1080}
            y2={60}
            stroke="#e4c46e"
            strokeWidth={2}
            opacity={0.7}
          />
          {RIPPLES.map((r, i) => {
            const t = ((frame + r.offset) % 45) / 45;
            return (
              <ellipse
                key={i}
                cx={r.x}
                cy={60}
                rx={r.size * t}
                ry={r.size * t * 0.28}
                fill="none"
                stroke="#dbe9ff"
                strokeWidth={1.5}
                opacity={(1 - t) * 0.8}
              />
            );
          })}
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={68}
          verses={[
            {
              text: "يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا",
              number: "١١",
              from: 25,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
