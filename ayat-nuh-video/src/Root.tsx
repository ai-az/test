import { Composition, Folder } from "remotion";
import "./fonts";
import { AyatNuh } from "./AyatNuh";
import { IntroScene } from "./scenes/IntroScene";
import { Verse10Scene } from "./scenes/Verse10Scene";
import { Verse11Scene } from "./scenes/Verse11Scene";
import { Verse12Scene } from "./scenes/Verse12Scene";
import { Verse13_14Scene } from "./scenes/Verse13_14Scene";
import { Verse15Scene } from "./scenes/Verse15Scene";
import { Verse16Scene } from "./scenes/Verse16Scene";
import { Verse17_18Scene } from "./scenes/Verse17_18Scene";
import { Verse19_20Scene } from "./scenes/Verse19_20Scene";
import { OutroScene } from "./scenes/OutroScene";

// 110+180+180+240+240+200+210+260+260+120 = 2000 frames, minus 9 fades × 20 = 1820 frames
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AyatNuh"
        component={AyatNuh}
        durationInFrames={1820}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="AyatNuh-Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          durationInFrames={110}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse10"
          component={Verse10Scene}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse11"
          component={Verse11Scene}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse12"
          component={Verse12Scene}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse13-14"
          component={Verse13_14Scene}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse15"
          component={Verse15Scene}
          durationInFrames={200}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse16"
          component={Verse16Scene}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse17-18"
          component={Verse17_18Scene}
          durationInFrames={260}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Verse19-20"
          component={Verse19_20Scene}
          durationInFrames={260}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Outro"
          component={OutroScene}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
