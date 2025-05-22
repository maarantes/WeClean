import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  container: {
    flexDirection: "column",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8
  },

  menor: {
    width: "100%"
  },

  texto_menor: {
    fontSize: 14,
  },

  none: {
    display: "none"
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
    alignItems: "center",
    gap: 12
  },

  cor_80: {
    color: "#808080",
    marginLeft: 8,
  },

  cor_80_normal: {
    color: "#808080",
  },

  botao_concluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: 40,
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
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    color: "black"
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
    backgroundColor: "black",
    borderRadius: 4
},

  botao_fechar_texto: {
    color: "white",
    fontFamily: "Inter-Medium"
},

  texto_integrantes_extras: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: "#808080",
    fontFamily: "Inter-SemiBold",
    marginLeft: -5,
    borderRadius: 2
  },

  modal_container_descricao: {
    width: "100%", 
    height: "85%",
    alignSelf: "center",
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 20,
    margin: 0,
    justifyContent: "flex-start",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  detalhe_secao: {
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 4,
    marginTop: 16
  },
  
  detalhe_cima_topo: {
    alignItems: "center"
  },

  modal_notch: {
    width: 64,
    height: 4,
    borderRadius: 20,
    backgroundColor: "#C4C4C4",
    marginBottom: 20
  },

  detalhe_cima: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },

  modal_scroll: {
    marginTop: -20,
    paddingBottom: 40
  },

  detalhe_botoes: {
    flexDirection: "row",
    gap: "4%",
    marginBottom: 16
  },

  detalhe_botao_editar: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "black",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "48%"
  },

  detalhe_botao_editar_texto: {
    color: "white",
    fontFamily: "Inter-SemiBold"
  },

  detalhe_botao_excluir: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FBDFE4",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "48%"
  },

  detalhe_botao_excluir_texto: {
    color: "#C22E63",
    fontFamily: "Inter-SemiBold"
  },

  detalhe_botao_comentar: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "black",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },

  detalhe_botao_comentar_texto: {
    color: "white",
    fontFamily: "Inter-SemiBold"
  },

  detalhe_campo_titulo: {
    color: "#606060",
    marginBottom: 12,
    fontFamily: "Inter-SemiBold"
  },

  detalhe_campo_texto: {
    color: "#404040",
    fontSize: 16,
    fontFamily: "Inter-SemiBold"
  },

  detalhe_campo_texto_descricao: {
    color: "#404040",
    fontSize: 14,
    fontFamily: "Inter-Medium"
  },

  flex_row_between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flex_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  flex_wrap: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },

  detalhe_campo_texto_horario: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "Inter-Medium"
  },

  alarme_ativado: {
    color: "#115614",
    fontFamily: "Inter-SemiBold"
  },

  detalhe_campo_texto_cinza: {
    color: "#808080",
    fontSize: 14,
    fontFamily: "Inter-Medium"
  },

  modal_exclusao_container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    gap: 24
  },

  modal_exclusao_titulo: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 16,
  },

  modal_exclusao_texto: {
    fontFamily: "Inter-Medium",
    color: "#606060",
    fontSize: 14
  },

  modal_excluir_botao_excluir: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FBDFE4",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "45%"
  },

  modal_botao_excluir_texto: {
    color: "#E7516E",
    fontFamily: "Inter-SemiBold"
  },

  modal_exclusao_botoes: {
    flexDirection: "row",
    gap: 32
  },

  modal_excluir_botao_cancelar: {
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

  badge_ninguem: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
    color: "#808080",
    fontFamily: "Inter-Medium"
  },

  parte_abas: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },

  aba_opcao: {
      width: "50%",
      paddingBottom: 8,
      alignItems: "center",
      borderBottomWidth: 4,
      borderBottomColor: "black"
  },

  aba_opcao_texto: {
      color: "black",
      fontFamily: "Inter-SemiBold",
      fontSize: 14
  },

  desativado: {
      borderBottomColor: "#C4C4C4"
  },

  desativado_texto: {
      color: "#C4C4C4"
  },

  sem_comentarios_texto: {
    backgroundColor: "#F8F8F8",
    padding: 32,
    fontFamily: "Inter-SemiBold",
    color: "#808080",
    textAlign: "center"
  }

});