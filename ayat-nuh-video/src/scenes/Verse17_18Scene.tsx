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

const GROUND_Y = 830;

const Sprout: React.FC<{
  x: number;
  from: number;
  size: number;
  lean?: number;
}> = ({ x, from, size, lean = 0 }) => (
  <g transform={`translate(${x} ${GROUND_Y}) scale(${size}) skewX(${lean})`}>
    <DrawPath
      d="M 0 0 C 4 -70 -8 -140 2 -230"
      from={from}
      duration={55}
      strokeWidth={3.2}
      stroke="url(#v17-gold)"
      filter="url(#v17-soft)"
    />
    <DrawPath
      d="M -2 -110 C -45 -118 -95 -95 -112 -45 C -70 -38 -20 -60 -2 -110 Z"
      from={from + 25}
      duration={40}
      strokeWidth={2.2}
      fill="rgba(228,196,110,0.1)"
      fillFrom={from + 55}
    />
    <DrawPath
      d="M -2 -110 C -40 -100 -70 -85 -95 -60"
      from={from + 40}
      duration={25}
      strokeWidth={1.2}
      opacity={0.7}
    />
    <DrawPath
      d="M 0 -170 C 40 -180 95 -160 112 -110 C 70 -100 20 -120 0 -170 Z"
      from={from + 38}
      duration={40}
      strokeWidth={2.2}
      fill="rgba(228,196,110,0.1)"
      fillFrom={from + 68}
    />
    <DrawPath
      d="M 0 -170 C 40 -162 70 -145 95 -118"
      from={from + 52}
      duration={25}
      strokeWidth={1.2}
      opacity={0.7}
    />
    <DrawPath
      d="M 2 -230 C -22 -255 -48 -262 -62 -245 C -40 -222 -14 -220 2 -230 Z"
      from={from + 55}
      duration={30}
      strokeWidth={2}
      fill="rgba(247,227,166,0.14)"
      fillFrom={from + 80}
    />
    <DrawPath
      d="M 2 -230 C 26 -255 52 -262 66 -245 C 44 -222 18 -220 2 -230 Z"
      from={from + 58}
      duration={30}
      strokeWidth={2}
      fill="rgba(247,227,166,0.14)"
      fillFrom={from + 83}
    />
  </g>
);

const SOIL = Array.from({ length: 40 }, (_, i) => ({
  x: 120 + random(`soil-x-${i}`) * 840,
  y: GROUND_Y + 10 + random(`soil-y-${i}`) * 110,
  r: 1 + random(`soil-r-${i}`) * 2,
  phase: random(`soil-p-${i}`) * 80,
}));

export const Verse17_18Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verses 17-18">
      <Background />
      <Interactive.Div
        name="Plants"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: GROUND_Y + 4,
          overflow: "hidden",
          translate: interpolate(
            frame,
            [110, 150, 165, 215],
            ["0px 0px", "0px 300px", "0px 300px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: [
                Easing.inOut(Easing.cubic),
                Easing.linear,
                Easing.bezier(0.16, 1, 0.3, 1),
              ],
            },
          ),
        }}
      >
        <svg
          width={1080}
          height={GROUND_Y + 4}
          viewBox={`0 0 1080 ${GROUND_Y + 4}`}
        >
          <GlowDefs id="v17" />
          <Sprout x={250} from={40} size={0.8} lean={-4} />
          <Sprout x={540} from={22} size={1} />
          <Sprout x={830} from={55} size={0.85} lean={4} />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="Earth"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
        }}
      >
        <svg width={1080} height={1100} viewBox="0 0 1080 1100">
          <GlowDefs id="v17e" />
          <defs>
            <linearGradient id="v17-earth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a2b4d" />
              <stop offset="0.3" stopColor="#0a1530" />
              <stop offset="1" stopColor="#0a1530" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${GROUND_Y + 2} L 1080 ${GROUND_Y + 2} L 1080 1100 L 0 1100 Z`}
            fill="url(#v17-earth)"
            opacity={interpolate(frame, [0, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          <DrawPath
            d={`M 20 ${GROUND_Y} L 1060 ${GROUND_Y}`}
            from={0}
            duration={45}
            strokeWidth={2.5}
            stroke="url(#v17e-gold)"
            filter="url(#v17e-glow)"
          />
          <DrawPath
            d={`M 60 ${GROUND_Y + 40} Q 540 ${GROUND_Y + 20} 1020 ${GROUND_Y + 40}`}
            from={20}
            duration={45}
            strokeWidth={1}
            opacity={0.4}
            dashed
          />
          <DrawPath
            d={`M 120 ${GROUND_Y + 85} Q 540 ${GROUND_Y + 60} 960 ${GROUND_Y + 85}`}
            from={35}
            duration={45}
            strokeWidth={1}
            opacity={0.25}
            dashed
          />
          {SOIL.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={
                s.y -
                (frame > 165
                  ? interpolate(frame, [165, 215], [0, 120], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }) *
                    ((i % 5) / 5)
                  : 0)
              }
              r={s.r}
              fill="#e4c46e"
              opacity={0.25 + 0.4 * Math.abs(Math.sin((frame + s.phase) / 25))}
            />
          ))}
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={60}
          verses={[
            {
              text: "وَاللَّهُ أَنبَتَكُم مِّنَ الْأَرْضِ نَبَاتًا",
              number: "١٧",
              from: 15,
            },
            {
              text: "ثُمَّ يُعِيدُكُمْ فِيهَا وَيُخْرِجُكُمْ إِخْرَاجًا",
              number: "١٨",
              from: 110,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
