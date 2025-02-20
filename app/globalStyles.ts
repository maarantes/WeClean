import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({

  containerPagina: {
    paddingTop: 60,
    paddingHorizontal: 20,
    // Padding Bottom não funciona pelo StyleSheet
    // Tem que colocar contentContainerStyle={{paddingBottom: 80 }} no ScrollableView
},

  titulo: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 24,
    color: "#5A189A",
  },

  textoNormal: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#404040",
  },

  mbottom32: {
    marginBottom: 32
  },

  mbottom16: {
    marginBottom: 16
  }
  
});