import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  modal_container: {
    backgroundColor: "white",
    height: "105.5%",
    width: "85%",
    position: "absolute",
    padding: 20,
    right: -20,
    top: -20
  },

  modal_cima: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20
  },

  modal_titulo: {
    fontFamily: "HeptaSlab-SemiBold",
    lineHeight: 22,
    fontSize: 18,
  },

  sem_notif: {
    marginTop: 20,
    marginBottom: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 4,
    padding: 20,
    alignItems: "center"
  },

  sem_notif_loading: {
    marginTop: 32
  },

  sem_notif_texto: {
    fontFamily: "Inter-Medium",
    color: "#C4C4C4",
  },

  notif_lista: {
    gap: 16,
    marginBottom: 4
  },

  botao_excluir: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2274A5",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },

  botao_excluir_texto: {
    color: "white",
    fontFamily: "Inter-SemiBold"
  },



});