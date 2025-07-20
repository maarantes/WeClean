import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 23,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 15,
  },

  pressable_container: {
    borderRadius: 100,
    overflow: "hidden",
    width: "100%",
  },

  botao: {
    gap: 6,
    alignItems: "center",
    width: "20%",
  },

  botao_pressable: {
    alignItems: "center",
    paddingVertical: 4,
    width: "100%",
    borderRadius: 100,
    overflow: "hidden",
  },

  texto: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
})
