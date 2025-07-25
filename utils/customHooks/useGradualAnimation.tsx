import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

interface KeyboardEvent {
  height: number;
}

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e: KeyboardEvent) => {
      "worklet";
      height.value = e.height;
    },
    onEnd: (e: KeyboardEvent) => {
      "worklet";
      height.value = e.height;
    },
  });
  return { height };
};

export default useGradualAnimation;
