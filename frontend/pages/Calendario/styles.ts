import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  
  container_cima: {
    flexDirection: "row",
    gap: "2%",
  },

  container_cima_esq: {
    flexDirection: "column",
    width: "49%",
    gap: 8
  },

  linha_semana: {
    flexDirection: "row",
    alignItems: "center",
  },

  botao_semana: {
    alignItems: "center",
    backgroundColor: "#5A189A",
    padding: 8,
    width: "50%",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4
  },

  desativado: {
    backgroundColor: "#DACAFB",
  },

  desativado_texto: {
    color: "#5A189A",
  },

  botao_semana_texto: {
    color: "white",
    fontFamily: "Inter-Medium"
  },

  dias_semana_texto: {
    backgroundColor: "#F5F5F5",
    fontFamily: "Inter-Medium",
    fontSize: 12,
    paddingVertical: 10,
    paddingLeft: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    color: "#606060",
    width: "50%"
  },

  sem_semana_06: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 4,
    width: "100%"
  },
  
  sem_semana_06_texto: {
    color: "#C4C4C4",
    fontFamily: "Inter-Medium",
    fontSize: 14
  },

  container_cima_dir: {
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
    width: "49%",
    padding: 12,
    borderRadius: 4
  },

  mes: {
    color: "#606060",
    fontFamily: "Inter-SemiBold"
  },

  semana_info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  semana_info_titulo: {
    color: "#404040",
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 12
  },

  semana_info_num: {
    color: "#808080",
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 12
  },

  container_baixo: {
    gap: 4
  },

  container_escolher: {
    flexDirection: "row",
    marginTop: 32,
    gap: "2%"
  },

  dia_botao: {
    backgroundColor: "#5A189A",
    width: "18%",
    paddingVertical: 12,
    borderRadius: 2,
    alignItems: "center"
  },

  rotate: {
    transform: [{ rotate: "180deg" }]
  },

  dia_atual: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    width: "60%",
    borderRadius: 2
  },

  dia_atual_esq: {
    fontFamily: "Inter-Medium",
    color: "#404040"
  },

  dia_atual_dir: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#808080"
  },

  cards: {
    flexDirection: "row",
    columnGap: "2%",
    rowGap: "4%",
    marginTop: 16,
    flexWrap: "wrap"
  }

});