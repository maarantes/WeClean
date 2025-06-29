import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  modal_container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 24,
  },

  bottom_sheet: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  modal_titulo: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 16,
  },

  modal_texto: {
    fontFamily: "Inter-Medium",
    color: "#606060",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },

  modal_botao_primario: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2274A5",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },

  modal_botao_vermelho: {
    backgroundColor: "#E83F6F",
  },

  desabilitado: {
    opacity: 0.75,
  },

  modal_botao_primario_texto: {
    color: "#FFFFFF",
    fontFamily: "Inter-SemiBold",
  },

  botao_primario_maior: {
    width: "58%",
  },

  modal_botoes: {
    flexDirection: "row",
    gap: "4%",
  },

  modal_botao_cancelar: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E9F1F6",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },

  modal_botao_cancelar_texto: {
    color: "#2274A5",
    fontFamily: "Inter-SemiBold",
  },

  botao_secundario_menor: {
    width: "38%",
  },
})