import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";

export const Ornament: React.FC<{ y: number; from?: number }> = ({
  y,
  from = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Ornament"
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: 1080,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity: interpolate(frame, [from, from + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [from, from + 40], [0.2, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          width: 260,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(228,196,110,0) 0%, #e4c46e 100%)",
        }}
      />
      <div
        style={{
          width: 14,
          height: 14,
          rotate: "45deg",
          background: "#e4c46e",
        }}
      />
      <div
        style={{
          width: 260,
          height: 2,
          background:
            "linear-gradient(270deg, rgba(228,196,110,0) 0%, #e4c46e 100%)",
        }}
      />
    </Interactive.Div>
  );
};
