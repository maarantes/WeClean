import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ActionCallbackMap = {
  [action: string]: () => void;
};

export function useLastActionListener(callbacks: ActionCallbackMap) {
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        const last = await AsyncStorage.getItem("lastAction");
        if (!isActive || !last) return;

        await AsyncStorage.removeItem("lastAction");

        const fn = callbacks[last];
        if (fn) {
          fn();
        }
      })();

      return () => {
        isActive = false;
      };
    }, [callbacks])
  );
}
