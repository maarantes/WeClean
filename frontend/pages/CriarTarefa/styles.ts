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
        paddingVertical: 60,
        paddingHorizontal: 20,
        zIndex: 1
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

    label: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: "#606060",
    },

    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        marginTop: 8,
        color: "#606060",
        paddingHorizontal: 12,
        fontSize: 16
    }

  
});