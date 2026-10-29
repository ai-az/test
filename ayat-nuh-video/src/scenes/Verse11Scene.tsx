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

const DROPS = Array.from({ length: 110 }, (_, i) => ({
  x: random(`drop-x-${i}`) * 1080,
  len: 40 + random(`drop-l-${i}`) * 70,
  speed: 22 + random(`drop-s-${i}`) * 16,
  offset: random(`drop-o-${i}`) * 2000,
  opacity: 0.25 + random(`drop-a-${i}`) * 0.5,
}));

const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#c9d4e6">
    <ellipse cx={0} cy={0} rx={120} ry={60} />
    <ellipse cx={-90} cy={20} rx={80} ry={45} />
    <ellipse cx={95} cy={18} rx={90} ry={50} />
    <ellipse cx={20} cy={-30} rx={75} ry={55} />
  </g>
);

export const Verse11Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 11">
      <Background />
      <Interactive.Div
        name="Rain"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          opacity: interpolate(frame, [25, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={1080} height={1920}>
          {DROPS.map((d, i) => {
            const y = ((frame * d.speed + d.offset) % 2100) - 150;
            return (
              <line
                key={i}
                x1={d.x}
                y1={y}
                x2={d.x - 6}
                y2={y + d.len}
                stroke="#9fc3ff"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={d.opacity}
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
          height: 600,
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 50], ["0px -200px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg width={1080} height={600}>
          <Cloud x={230} y={260} s={1.15} />
          <Cloud x={620} y={200} s={1.45} />
          <Cloud x={930} y={300} s={0.95} />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Ground"
        style={{
          position: "absolute",
          left: -200,
          bottom: -520,
          width: 1480,
          height: 700,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #27503a 0%, #163222 100%)",
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
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
