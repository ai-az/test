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

const FAR =
  "M 0 520 C 120 440 220 400 330 430 C 430 300 520 330 600 420 C 700 360 820 300 900 380 C 980 330 1040 380 1080 420 L 1080 1000 L 0 1000 Z";
const MID =
  "M 0 640 C 150 560 260 540 360 600 C 470 500 560 520 650 600 C 760 540 860 520 1080 600 L 1080 1000 L 0 1000 Z";
const NEAR =
  "M 0 780 C 200 700 400 720 540 760 C 700 700 900 720 1080 790 L 1080 1000 L 0 1000 Z";

const ROAD =
  "M -20 880 C 160 850 260 780 420 760 C 560 740 600 690 640 640 C 690 580 820 580 900 540 C 980 500 1040 470 1100 440";
const ROAD2 = "M -20 960 C 200 920 420 900 560 860 C 700 820 760 780 1100 700";

export const Verse19_20Scene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Verses 19-20">
      <Background />
      {[
        { d: FAR, from: 10, fill: "#13244a", name: "Far hills" },
        { d: MID, from: 28, fill: "#0d1a38", name: "Mid hills" },
        { d: NEAR, from: 46, fill: "#070f22", name: "Near ground" },
      ].map((l) => (
        <Interactive.Div
          key={l.name}
          name={l.name}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1000,
            transformOrigin: "50% 100%",
            scale: interpolate(frame, [l.from, l.from + 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            opacity: interpolate(frame, [l.from, l.from + 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <svg width={1080} height={1000} viewBox="0 0 1080 1000">
            <GlowDefs id={`v19-${l.from}`} />
            <path d={l.d} fill={l.fill} />
            <DrawPath
              d={l.d.replace(/ L 1080 1000 L 0 1000 Z$/, "")}
              from={l.from + 10}
              duration={70}
              strokeWidth={2}
              stroke={`url(#v19-${l.from}-gold)`}
              filter={`url(#v19-${l.from}-glow)`}
              opacity={0.9}
            />
          </svg>
        </Interactive.Div>
      ))}
      <Interactive.Div
        name="Roads"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1000,
        }}
      >
        <svg width={1080} height={1000} viewBox="0 0 1080 1000">
          <GlowDefs id="v19r" />
          <DrawPath
            d={ROAD2}
            from={120}
            duration={110}
            strokeWidth={2}
            opacity={0.5}
            dashed
          />
          <DrawPath
            d={ROAD}
            from={105}
            duration={110}
            strokeWidth={3.5}
            stroke="url(#v19r-gold)"
            filter="url(#v19r-glow)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 22,
            height: 22,
            marginLeft: -11,
            marginTop: -11,
            borderRadius: 11,
            background:
              "radial-gradient(circle, #fff8dc 0%, #f7e3a6 40%, rgba(247,227,166,0) 75%)",
            boxShadow: "0 0 30px 8px rgba(247,227,166,0.55)",
            offsetPath: `path("${ROAD}")`,
            offsetRotate: "0deg",
            offsetDistance: `${interpolate(frame, [110, 220], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) })}%`,
            opacity: interpolate(frame, [110, 125, 215, 235], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </Interactive.Div>
      <TextPanel>
        <VerseText
          fontSize={62}
          verses={[
            {
              text: "وَاللَّهُ جَعَلَ لَكُمُ الْأَرْضَ بِسَاطًا",
              number: "١٩",
              from: 15,
            },
            {
              text: "لِّتَسْلُكُوا مِنْهَا سُبُلًا فِجَاجًا",
              number: "٢٠",
              from: 105,
            },
          ]}
        />
      </TextPanel>
    </AbsoluteFill>
  );
};
