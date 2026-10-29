import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
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

export const AyatNuh: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Intro" durationInFrames={110}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verse 10" durationInFrames={180}>
        <Verse10Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verse 11" durationInFrames={180}>
        <Verse11Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verse 12" durationInFrames={240}>
        <Verse12Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verses 13-14" durationInFrames={240}>
        <Verse13_14Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verse 15" durationInFrames={200}>
        <Verse15Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verse 16" durationInFrames={210}>
        <Verse16Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verses 17-18" durationInFrames={260}>
        <Verse17_18Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Verses 19-20" durationInFrames={260}>
        <Verse19_20Scene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Outro" durationInFrames={120}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
