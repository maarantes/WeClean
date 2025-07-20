import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

  wrapper: {
    borderRadius: 4,
    overflow: "hidden",
  },

  buttonBase: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "48%",
    overflow: "hidden",
  },

  sizeMaximo: {
    width: "100%",
  },

  sizeGrande: {
    width: "58%",
  },

  sizePequeno: {
    width: "38%",
  },

  sizeAuto: {
    width: "auto",
  },

  fontWeightMedium: {
    fontFamily: "Inter-Medium",
  },

  botaoPrimario: {
    backgroundColor: "#2274A5",
  },

  botaoSecundario: {
    backgroundColor: "#E9F1F6",
  },

  danger: {
    backgroundColor: "#E83F6F",
  },

  desabilitado: {
    opacity: 0.6,
  },

  textBase: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },

  textPrimario: {
    color: "#FFFFFF",
  },

  textSecundario: {
    color: "#2274A5",
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },

  iconContainer: {
    marginRight: 4,
  },
})
