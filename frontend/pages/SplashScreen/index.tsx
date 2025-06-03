import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, ImageBackground } from "react-native";

import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";
import { useFonts } from "@/frontend/hooks/UsarFontes";
import * as NavigationBar from "expo-navigation-bar";

import FundoSplash from "../../../assets/images/splash_background.png";
import LogoWeCleanBranco from "../../../assets/images/logoWeCleanBranco.svg";
import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import BolaBranca from "../../../assets/images/bolinha_branca.svg";
import { StatusBar } from "expo-status-bar";

type Props = StackScreenProps<RootStackParamList, "Splash"> & {
  authInitialized: boolean;
  usuarioLogado: string | null;
};

const PaginaSplash: React.FC<Props> = ({ navigation, route, authInitialized, usuarioLogado }) => {
  const fontsLoaded = useFonts();

  const logoScale = useRef(new Animated.Value(0.0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;

  const { height } = Dimensions.get("window");

  useEffect(() => {
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#FFFFFF");
    NavigationBar.setBehaviorAsync("overlay-swipe");
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !authInitialized) return;

    const animate = async () => {
      await new Promise<void>((resolve) =>
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start(() => resolve())
      );

      if (usuarioLogado) {
        // Animação para usuário logado
        logoTranslateY.setValue(0);
        Animated.sequence([
          Animated.timing(circleOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale, {
            toValue: 30,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          navigation.reset({ index: 0, routes: [{ name: "Início" }] });
        });
      } else {
        // Animação para usuário não logado
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(circleOpacity, {
              toValue: 1,
              duration: 1,
              useNativeDriver: true,
            }),
            Animated.timing(circleScale, {
              toValue: 200,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(logoTranslateY, {
              toValue: -(height / 2) + 100,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          });
        }, 1000);
      }
    };

    animate();
  }, [fontsLoaded, authInitialized, usuarioLogado, height, navigation]);

  const logoBrancoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0, 0],
  });

  const logoColoridoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 1, 1],
  });

  return (
    <ImageBackground source={FundoSplash} style={styles.container} resizeMode="cover">

      <StatusBar style="light" translucent />

      {/* Bolinha atrás do logo (usuário não logado) */}
      {(!authInitialized || !usuarioLogado) && (
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
              width: 100,
              height: 100,
              top: "50%",
              left: "50%",
              zIndex: 0,
            },
          ]}
        >
          <BolaBranca width="100%" height="100%" />
        </Animated.View>
      )}

      {/* Logo */}
      <Animated.View
        style={{
          transform: [{ scale: logoScale }, { translateY: logoTranslateY }],
          width: 200,
          height: 150,
          zIndex: 5,
        }}
      >
        <Animated.View style={[styles.logoOverlay, { opacity: logoBrancoOpacity }]}>
          <LogoWeCleanBranco width={200} height={150} />
        </Animated.View>

        <Animated.View style={[styles.logoOverlay, { opacity: logoColoridoOpacity }]}>
          <LogoWeClean width={200} height={150} />
        </Animated.View>
      </Animated.View>

      {/* Bolinha acima do logo (usuário já logado) */}
      {authInitialized && usuarioLogado && (
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
              width: 100,
              height: 100,
              top: "50%",
              left: "50%",
              zIndex: 10,
            },
          ]}
        >
          <BolaBranca width="100%" height="100%" />
        </Animated.View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
    width: 0,
    height: 0,
    marginLeft: -50,
    marginTop: -50,
    justifyContent: "center",
    alignItems: "center",
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});

export default PaginaSplash;