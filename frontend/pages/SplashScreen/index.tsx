import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";
import { useFonts } from "@/frontend/hooks/UsarFontes";

import LogoWeCleanBranco from "../../../assets/images/logoWeCleanBranco.svg";
import LogoWeClean from "../../../assets/images/logoWeClean.svg";

import BolaBranca from "../../../assets/images/bolinha_branca.svg";

const PaginaSplash = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fontsLoaded = useFonts();

  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current; // Animação da escala da bolinha
  const circleOpacity = useRef(new Animated.Value(0)).current; // Animação da opacidade da bolinha

  const { height, width } = Dimensions.get('window');

  useEffect(() => {
    const startSplash = async () => {
      if (!fontsLoaded) return;

      // Anima o logo aumentando
      await new Promise(resolve => {
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => resolve(true));
      });

      // Espera um pouco antes de mostrar a bolinha
      await new Promise(resolve => setTimeout(resolve, 200));

      // Mostra a bolinha e inicia a expansão
      Animated.parallel([
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 1,
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 200, // Expande para cobrir a tela (escala)
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: -(height / 2) + 100, // Logo sobe
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        // Espera um pouco após a expansão
        await new Promise(resolve => setTimeout(resolve, 300));

        // Navega para Login
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }]
        });
      });
    };

    startSplash();
  }, [fontsLoaded, navigation, height]);

  // Interpolação da opacidade dos logos
  const logoBrancoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0, 0], // Logo branco some enquanto a bolinha cresce
  });

  const logoColoridoOpacity = circleScale.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 1, 1], // Logo colorido aparece após a bolinha crescer
  });

  return (
    <View style={styles.container}>
      {/* Bolinha branca expandindo */}
      <Animated.View
        style={[
          styles.circle,
          {
            opacity: circleOpacity,
            transform: [{ scale: circleScale }],
            width: 100, // Tamanho base para o SVG
            height: 100, // Tamanho base para o SVG
            top: "50%",
            left: "50%",
          }
        ]}
      >
        {/* Bolinha SVG */}
        <BolaBranca width="100%" height="100%" />
      </Animated.View>

      <Animated.View style={{
        transform: [
          { scale: logoScale },
          { translateY: logoTranslateY }
        ],
        width: 200,
        height: 150,
      }}>

        {/* Logo branco */}
        <Animated.View style={[styles.logoOverlay, { opacity: logoBrancoOpacity }]}>
          <LogoWeCleanBranco width={200} height={150} />
        </Animated.View>

        {/* Logo colorido */}
        <Animated.View style={[styles.logoOverlay, { opacity: logoColoridoOpacity }]}>
          <LogoWeClean width={200} height={150} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A189A", // Cor roxa fixa no fundo
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    backgroundColor: "white", // Garante que a cor de fundo seja branca inicialmente
    borderRadius: 50, // Para torná-la redonda
    width: 0, // Inicialmente com largura zero (será controlado pela escala)
    height: 0, // Inicialmente com altura zero (será controlado pela escala)
    marginLeft: -50, // Centraliza horizontalmente para um width de 100
    marginTop: -50, // Centraliza verticalmente para um height de 100
    justifyContent: "center",
    alignItems: "center",
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default PaginaSplash;