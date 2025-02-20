import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    zIndex: 1000,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 12
},


  containerBotoes: {
    flexDirection: "row",
    gap: 16
  },

  botao: {
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4
  }

});