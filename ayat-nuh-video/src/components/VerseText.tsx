import { Easing, interpolate, useCurrentFrame } from "remotion";
import { quranFont } from "../fonts";

export type Verse = { text: string; number: string; from: number };

export const VerseText: React.FC<{
  verses: Verse[];
  fontSize?: number;
}> = ({ verses, fontSize = 58 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: quranFont,
        fontSize,
        lineHeight: 2.1,
        color: "#f6efe0",
        textAlign: "center",
        direction: "rtl",
        width: "100%",
        textShadow: "0 4px 30px rgba(0,0,0,0.55)",
      }}
    >
      {verses.map((v) => {
        const words = v.text.split(" ");
        const last = words.length - 1;
        return (
          <div key={v.number}>
            {words.map((w, i) => (
              // The last word and the ayah marker share one non-breaking box
              // so the marker never drops to a line of its own.
              <span
                key={i}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    marginInline: "0.17em",
                    opacity: interpolate(
                      frame,
                      [v.from + i * 5, v.from + i * 5 + 16],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    ),
                    translate: interpolate(
                      frame,
                      [v.from + i * 5, v.from + i * 5 + 16],
                      ["0px 26px", "0px 0px"],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
                  }}
                >
                  {w}
                </span>
                {i === last ? (
                  <span
                    style={{
                      display: "inline-block",
                      marginInline: "0.2em",
                      color: "#e4c46e",
                      fontSize: fontSize * 0.9,
                      opacity: interpolate(
                        frame,
                        [
                          v.from + words.length * 5 + 4,
                          v.from + words.length * 5 + 22,
                        ],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        },
                      ),
                      scale: interpolate(
                        frame,
                        [
                          v.from + words.length * 5 + 4,
                          v.from + words.length * 5 + 22,
                        ],
                        [0.6, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.spring({ damping: 200 }),
                          output: "perceptual-scale",
                        },
                      ),
                    }}
                  >
                    ﴿{v.number}﴾
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
