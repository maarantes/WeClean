import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";
import { useFonts } from "@/frontend/hooks/UsarFontes";
import * as NavigationBar from "expo-navigation-bar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/backend/services/shared/firebaseConfigApp";

import LogoWeCleanBranco from "../../../assets/images/logoWeCleanBranco.svg";
import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import BolaBranca from "../../../assets/images/bolinha_branca.svg";

const PaginaSplash = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const fontsLoaded = useFonts();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);

  const logoScale = useRef(new Animated.Value(0.5)).current;
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
    if (!fontsLoaded) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthInitialized(true);
      setUsuarioLogado(firebaseUser ? firebaseUser.uid : null);

      // Iniciar animação do logo
      await new Promise<void>((resolve) =>
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => resolve())
      );

      if (firebaseUser) {
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
          console.log("Animação concluída, navegando para Início");
          navigation.reset({ index: 0, routes: [{ name: "Início" }] });
        });
      } else {
        // Animação para usuário não logado
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
          console.log("Animação concluída, navegando para Login");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        });
      }
    });

    return () => {
      console.log("Limpando listener onAuthStateChanged");
      unsubscribe();
    };
  }, [fontsLoaded, navigation, height]);

  const logoBrancoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0, 0],
  });

  const logoColoridoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 1, 1],
  });

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" style={styles.gradient}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFBF00" stopOpacity="1" />
            <Stop offset="50%" stopColor="#E83F6F" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2274A5" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
      </Svg>

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
    </View>
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