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
import { DrawPath, GlowDefs } from "../components/art";

type Frond = {
  d: string;
  leaflets: { x1: number; y1: number; x2: number; y2: number; t: number }[];
};

const makeFronds = (): Frond[] => {
  const angles = [198, 222, 248, 272, 296, 320, 344];
  return angles.map((deg) => {
    const th = (deg * Math.PI) / 180;
    const L = 200;
    const p0 = { x: 0, y: -300 };
    const p1 = {
      x: Math.cos(th) * L * 0.6,
      y: -300 + Math.sin(th) * L * 0.6 - 50,
    };
    const p2 = { x: Math.cos(th) * L, y: -300 + Math.sin(th) * L + 70 };
    const leaflets = [];
    for (let t = 0.22; t <= 0.96; t += 0.075) {
      const x =
        (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const y =
        (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
      const n = Math.hypot(dx, dy) || 1;
      const len = 30 * (1 - t * 0.5);
      // leaflets lean back toward the trunk and droop a little
      const lx = (-dy / n) * len + (dx / n) * len * 0.35;
      const ly = (dx / n) * len + (dy / n) * len * 0.35 + 8;
      leaflets.push({ x1: x, y1: y, x2: x + lx, y2: y + ly, t });
      leaflets.push({
        x1: x,
        y1: y,
        x2: x - lx + (dx / n) * len * 0.7,
        y2: y - ly + (dy / n) * len * 0.7 + 16,
        t,
      });
    }
    return {
      d: `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`,
      leaflets,
    };
  });
};
const FRONDS = makeFronds();

const Palm: React.FC<{
  x: number;
  y: number;
  from: number;
  size: number;
  filter: string;
}> = ({ x, y, from, size, filter }) => {
  const frame = useCurrentFrame();
  const frondProgress = (i: number) =>
    interpolate(frame, [from + 40 + i * 6, from + 95 + i * 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <DrawPath
        d="M -12 0 C -16 -110 -8 -210 0 -300"
        from={from}
        duration={55}
        strokeWidth={3}
        filter={filter}
      />
      <DrawPath
        d="M 12 0 C 16 -110 8 -210 0 -300"
        from={from + 4}
        duration={55}
        strokeWidth={3}
        filter={filter}
      />
      {[-40, -80, -120, -160, -200, -240].map((ty, i) => (
        <DrawPath
          key={ty}
          d={`M ${-11 + i * 0.6} ${ty} Q 0 ${ty - 8} ${11 - i * 0.6} ${ty}`}
          from={from + 10 + i * 6}
          duration={14}
          strokeWidth={1.8}
          opacity={0.75}
        />
      ))}
      {FRONDS.map((f, i) => (
        <g key={i}>
          <DrawPath
            d={f.d}
            from={from + 40 + i * 6}
            duration={55}
            strokeWidth={2.6}
            filter={filter}
          />
          {f.leaflets.map((l, j) => (
            <line
              key={j}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#e4c46e"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={l.t < frondProgress(i) ? 0.85 : 0}
            />
          ))}
        </g>
      ))}
      <g
        opacity={interpolate(frame, [from + 110, from + 135], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      >
        {[-22, -8, 6, 20].map((dx, i) => (
          <circle
            key={i}
            cx={dx}
            cy={-262 + (i % 2) * 10}
            r={5}
            fill="#f7e3a6"
            filter={filter}
          />
        ))}
      </g>
    </g>
  );
};

const WAVE =
  "M 0 60 Q 135 10 270 60 T 540 60 T 810 60 T 1080 60 T 1350 60 T 1620 60 T 1890 60 T 2160 60";

export const Verse12Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verse 12">
      <Background />
      <Interactive.Div
        name="Garden"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
        }}
      >
        <svg width={1080} height={1000} viewBox="0 0 1080 1000">
          <GlowDefs id="v12" />
          <DrawPath
            d="M 40 760 Q 540 700 1040 760"
            from={10}
            duration={50}
            strokeWidth={2.5}
            opacity={0.8}
            filter="url(#v12-soft)"
          />
          <Palm x={250} y={745} from={25} size={0.95} filter="url(#v12-soft)" />
          <Palm x={540} y={735} from={40} size={1.15} filter="url(#v12-soft)" />
          <Palm x={830} y={745} from={55} size={0.95} filter="url(#v12-soft)" />
        </svg>
      </Interactive.Div>
      <Interactive.Div
        name="River"
        style={{
          position: "absolute",
          left: 0,
          top: 790,
          width: 1080,
          height: 200,
          overflow: "hidden",
          opacity: interpolate(frame, [120, 160], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [120, 175], [0.3, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          maskImage:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, #000 15%, #000 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, #000 15%, #000 85%, rgba(0,0,0,0) 100%)",
        }}
      >
        <svg width={2160} height={200} style={{ position: "absolute" }}>
          <GlowDefs id="v12r" />
          <path
            d={WAVE}
            fill="none"
            stroke="#9cc8ff"
            strokeWidth={3}
            opacity={0.9}
            filter="url(#v12r-soft)"
            transform={`translate(${-((frame * 4) % 540)} 0)`}
          />
          <path
            d={WAVE}
            fill="none"
            stroke="#e4c46e"
            strokeWidth={2}
            opacity={0.7}
            transform={`translate(${-((frame * 6.5) % 540)} 34)`}
          />
          <path
            d={WAVE}
            fill="none"
            stroke="#9cc8ff"
            strokeWidth={2}
            opacity={0.5}
            transform={`translate(${-((frame * 9) % 540)} 70)`}
          />
          <path
            d={WAVE}
            fill="none"
            stroke="#e4c46e"
            strokeWidth={1.5}
            opacity={0.35}
            transform={`translate(${-((frame * 12) % 540)} 104)`}
          />
        </svg>
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={60}
          verses={[
            {
              text: "وَيُمْدِدْكُم بِأَمْوَالٍ وَبَنِينَ وَيَجْعَل لَّكُمْ جَنَّاتٍ وَيَجْعَل لَّكُمْ أَنْهَارًا",
              number: "١٢",
              from: 30,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
