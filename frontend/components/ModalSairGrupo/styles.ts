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
    paddingHorizontal: 16,
    backgroundColor: "#5A189A",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },

  modal_botao_sair_texto: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold"
  },

  modal_botoes: {
    width: "100%",
    gap: 12
  },

  modal_botao_cancelar: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#DACAFB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },

  modal_botao_cancelar_texto: {
    color: "#5A189A",
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
    marginBottom: -12,
    color: "#404040"
  },

  desativado: {
    backgroundColor: "#C4C4C4"
  }

});