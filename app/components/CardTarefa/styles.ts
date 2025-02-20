import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  container: {
    flexDirection: "column",
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 8
  },

  container_cima: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 24
  },

  container_baixo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  container_info: {
    flexDirection: "row",
    gap: 12
  },

  cor_80: {
    color: "#808080",
    marginLeft: 8
  },

  cor_80_normal: {
    color: "#808080",
  },

  botao_concluir: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 4,
    backgroundColor: "transparent"
  },

  container_info_dir: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },

  container_info_relogio: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  texto: {
    fontSize: 16,
    color: "#606060",
  },

  botao_concluido: {
    backgroundColor: "#115614",
    borderWidth: 0,
    paddingHorizontal: 12
  },

  cor_white: {
    color: "#ffffff",
  },
});