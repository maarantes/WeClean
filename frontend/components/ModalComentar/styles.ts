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

  modal_botao_sair: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "black",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "45%"
  },

  modal_botao_sair_texto: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold"
  },

  modal_botoes: {
    flexDirection: "row",
    gap: 32
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

  modal_input: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    paddingHorizontal: 12,
    borderRadius: 4,
    fontFamily: "Inter-Medium",
    color: "#404040",
    height: 40,
  }

});