import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 48,
    paddingVertical: 12,
    backgroundColor: "white",
    elevation: 15
  },

  botao: {
    gap: 6,
    alignItems: "center"
  },

  texto: {
    fontFamily: "Inter-Medium",
    fontSize: 12
  }

});