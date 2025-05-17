import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    card_container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        overflow: "hidden"
    },

    card_esq: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        width: 60,
        height: 80,
    },

    card_dir: {
        paddingLeft: 20,
        gap: 8
    },

    card_dir_baixo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    card_tarefa_nome: {
        fontSize: 14,
        color: "#606060",
        fontFamily: "Inter-SemiBold"
    },

    card_frequencia: {
        fontSize: 14,
        color: "#808080",
        fontFamily: "Inter-Medium"
    }

});