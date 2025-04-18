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
    textAlign: "center",
    fontSize: 14
  },

  modal_botao_sair: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#5A189A",
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
    backgroundColor: "#DACAFB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "45%"
  },

  modal_botao_cancelar_texto: {
    color: "#5A189A",
    fontFamily: "Inter-SemiBold"
  },

  codigo_input_area: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24
  },

  codigo_input_text: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 32
  },

  sem_nada: {
    fontFamily: "none",
    marginTop: 6
  }

});