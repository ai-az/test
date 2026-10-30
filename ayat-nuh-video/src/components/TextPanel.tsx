import { Interactive } from "remotion";
import { Ornament } from "./Ornament";

export const TextPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Ornament y={1040} from={0} />
      <Interactive.Div
        name="Text panel"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1090,
          bottom: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Interactive.Div>
    </>
  );
};
