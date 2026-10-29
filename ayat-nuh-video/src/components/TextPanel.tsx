import { Interactive } from "remotion";

export const TextPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Interactive.Div
      name="Text panel"
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 1080,
        bottom: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Interactive.Div>
  );
};
