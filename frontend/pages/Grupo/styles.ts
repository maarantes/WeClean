import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container_cima: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 1,
    elevation: 2
  },
  
  titulo_cima: {
    color: "#5A189A",
    fontSize: 16,
    fontFamily: "HeptaSlab-SemiBold"
  },

  botao_voltar: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2
  },

  container_titulo: {
    marginTop: 20
  },

  grupo_titulo: {
    fontSize: 20,
    fontFamily: "HeptaSlab-SemiBold"
  },

  card_grupo: {
    marginTop: 12,
    backgroundColor: "#FAFAFA",
    padding: 20,
    borderRadius: 8
  },

  card_grupo_icones: {
    flexDirection: "row",
    gap: 4
  },

  texto_integrantes: {
    marginTop: 12,
    color: "#606060",
    fontFamily: "Inter-Medium"
  },

  container_botoes_acao: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    rowGap: 8,
    columnGap: "2%"
  },

  botao_base: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 4,
},

  botao_base_texto: {
      fontFamily: "Inter-Medium"
  },

  botao_convidar: {
    width: "100%",
    backgroundColor: "#5A189A",
  },

  botao_convidar_texto: {
    color: "white"
  },

  botao_sair: {
    width: "49%",
    backgroundColor: "#DACAFB",
  },

  botao_sair_texto: {
    color: "#5A189A"
  },

  botao_excluir: {
    width: "49%",
    backgroundColor: "#FADEE8",
  },

  botao_excluir_texto: {
    color: "#C22E63"
  },

  container_integrantes: {
    marginTop: 32,
    gap: 12,
  },

  texto_integrantes_titulo: {
    color: "#404040",
    fontSize: 18,
    fontFamily: "Inter-Medium"
  },

  container_pessoa_admin: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 4
  },

  container_pessoa_normal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 4
  },

  pessoa_normal_esq: {
    flexDirection: "row",
    gap: 12
  },

  container_pessoa_nome: {
    fontFamily: "Inter-SemiBold"
  }




});