import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  modal_container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 24
  },

  modal_titulo: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 16,
  },

  modal_texto: {
    fontFamily: "Inter-Medium",
    color: "#606060",
    fontSize: 14
  },

  modal_botao_sair_texto: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold"
  },

  modal_botoes: {
    gap: 20,
  },

  modal_botao_cancelar: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "45%"
  },

  modal_botao_cancelar_texto: {
    color: "#808080",
    fontFamily: "Inter-SemiBold"
  },

  modal_card_tipo: {
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
  },

  card_icone_fundo: {
    width: "20%",
    height: 80,
    padding: 24,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center"
  },

  card_esq: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap"
  },

  card_titulo: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#404040",
    marginBottom: 2
  },

  card_subtitulo: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#808080"
  },

  card_texto: {
    width: "71%"
  }

});