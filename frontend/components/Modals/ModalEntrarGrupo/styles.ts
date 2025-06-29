import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  
  codigo_input_area: {
    flexDirection: "row",
    gap: "2%",
    marginBottom: 24,
  },

  codigo_input_item: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 8,
    width: "15%",
    height: 64,
    borderRadius: 4
  },

  item_selecionado: {
    borderWidth: 2,
    borderColor: "#2274A5"
  },

  codigo_input_text: {
    fontFamily: "HeptaSlab-SemiBold",
    fontSize: 24,
    color: "#404040"
  },

  sem_nada: {
    color: "#C4C4C4",
  },
})
