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

const Sprout: React.FC<{ x: number; from: number; size: number }> = ({
  x,
  from,
  size,
}) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Sprout"
      style={{
        position: "absolute",
        left: x,
        top: 560,
        width: 240,
        height: 300,
        transformOrigin: "50% 100%",
        scale: interpolate(frame, [from, from + 45], [0, size], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 15, stiffness: 100 }),
        }),
      }}
    >
      <svg viewBox="-120 -280 240 300" width={240} height={300}>
        <path
          d="M 0 20 C 0 -60 -10 -140 0 -240"
          stroke="#4fb06a"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 0 -120 C -40 -130 -95 -110 -110 -60 C -60 -50 -10 -70 0 -120 Z"
          fill="#5fc47a"
        />
        <path
          d="M 0 -180 C 40 -195 95 -175 110 -125 C 60 -110 10 -135 0 -180 Z"
          fill="#5fc47a"
        />
        <path
          d="M 0 -240 C -30 -265 -55 -270 -70 -250 C -45 -225 -15 -225 0 -240 Z"
          fill="#7edc97"
        />
        <path
          d="M 0 -240 C 30 -265 55 -270 70 -250 C 45 -225 15 -225 0 -240 Z"
          fill="#7edc97"
        />
      </svg>
    </Interactive.Div>
  );
};

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
          height: 860,
          overflow: "hidden",
          translate: interpolate(
            frame,
            [110, 150, 165, 210],
            ["0px 0px", "0px 320px", "0px 320px", "0px 0px"],
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
        <Sprout x={160} from={40} size={0.8} />
        <Sprout x={420} from={25} size={1} />
        <Sprout x={690} from={55} size={0.85} />
      </Interactive.Div>
      <Interactive.Div
        name="Earth"
        style={{
          position: "absolute",
          left: -120,
          top: 850,
          width: 1320,
          height: 320,
          borderTopLeftRadius: "50%",
          borderTopRightRadius: "50%",
          background: "linear-gradient(180deg, #6b4a2b 0%, #3b2816 100%)",
          boxShadow: "0 -10px 50px rgba(0,0,0,0.4)",
          opacity: interpolate(frame, [0, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Earth highlight"
        style={{
          position: "absolute",
          left: 0,
          top: 852,
          width: 1080,
          height: 6,
          background:
            "linear-gradient(90deg, rgba(228,196,110,0), rgba(228,196,110,0.8) 50%, rgba(228,196,110,0))",
          opacity: interpolate(frame, [0, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
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
