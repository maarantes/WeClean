import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    botao_adicionar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 12,
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        marginBottom: 40
    },

    botao_adicionar_texto: {
        color: "#606060",
        fontFamily: "Inter-SemiBold",
        fontSize: 14
    },

    container_cards: {
        gap: 20,
        marginBottom: 32
    },

    nenhuma_tarefa: {
        textAlign: "center",
        borderWidth: 1, 
        borderColor: "#C4C4C4", 
        borderStyle: "solid",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 4,
        color: "#C4C4C4"
    }

});