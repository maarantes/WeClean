import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet, ViewStyle } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

interface Props {
  style?: ViewStyle;
}

const SkeletonLoaderSvg: React.FC<Props> = ({ style }) => {
  const translateX = useRef(new Animated.Value(-1)).current;

useEffect(() => {
  const loopAnimation = () => {
    translateX.setValue(-1);
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(100),
    ]).start(() => loopAnimation());
  };

  loopAnimation();
}, []);

  const animatedTransform = {
    transform: [
      {
        translateX: translateX.interpolate({
          inputRange: [-1, 1],
          outputRange: [-400, 400],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { pointerEvents: "none" },
          animatedTransform,
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="white" stopOpacity="0" />
              <Stop offset="50%" stopColor="white" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="white" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#shimmer)" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
    position: "relative",
    borderRadius: 8,
    width: "100%",
    height: 102,
  },
});

export default SkeletonLoaderSvg;