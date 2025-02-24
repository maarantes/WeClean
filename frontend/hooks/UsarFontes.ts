import * as Font from "expo-font";
import { useState, useEffect } from "react";

export const useFonts = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "HeptaSlab-SemiBold": require("../../assets/fonts/HeptaSlab-SemiBold.ttf"),
        "Inter-Medium": require("../../assets/fonts/Inter-Medium.ttf"),
        "Inter-SemiBold": require("../../assets/fonts/Inter-SemiBold.ttf"),
      });

      setFontLoaded(true);
    }

    loadFonts();
  }, []);

  return fontLoaded;
};