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
    fontSize: 14,
    textAlign: "center"
  },

   modal_botao_sair: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2274A5",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "55%"
  },

  menor: {
    width: "45%"
  },

  modal_botao_sair_texto: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold"
  },

  modal_botoes: {
    width: "100%",
    flexDirection: "row",
    gap: "5%"
  },

  gap_menor: {
    gap: 32
  },

  modal_botao_cancelar: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E9F1F6",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "40%"
  },

  modal_botao_cancelar_texto: {
    color: "#2274A5",
    fontFamily: "Inter-SemiBold"
  },

  lista_integrantes: {
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap"
  },

  selecionado: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    width: "100%",
    borderRadius: 8,
    textAlign: "center",
    fontFamily: "Inter-Medium",
    marginBottom: -8,
    color: "#404040"
  },

  desativado: {
    backgroundColor: "#C4C4C4"
  }

});