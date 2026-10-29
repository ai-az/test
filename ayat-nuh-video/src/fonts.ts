import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const quranFont = "Amiri Quran";
export const kufiFont = "Reem Kufi";

export const fontsLoaded = Promise.all([
  loadFont({
    family: quranFont,
    url: staticFile("fonts/AmiriQuran-arabic.woff2"),
    weight: "400",
  }),
  loadFont({
    family: kufiFont,
    url: staticFile("fonts/ReemKufi-arabic.woff2"),
    weight: "400",
  }),
]);
