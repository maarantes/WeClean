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

  roxo: {
    color: "#5A189A"
  },

  // Modal

  modal_container: {
    margin: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  modal_content: {
    width: "100%",
    minHeight: "25%",
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    alignItems: "center",
  },

  titulo_menor: {
    fontSize: 18
  },

  texto_modal: {
    color: "#404040",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginVertical: 32
  },

  texto_modal_anual: {
    color: "#404040",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    maxWidth: "90%",
    lineHeight: 32,
    flexWrap: "wrap",
    marginVertical: 32,
    textAlign: "center"
  },

  botao_fechar: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#5A189A",
    borderRadius: 4
},

  botao_fechar_texto: {
    color: "white",
    fontFamily: "Inter-Medium"
},

});