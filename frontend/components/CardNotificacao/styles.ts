import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    card_container: {
        backgroundColor: "#FBFBFB",
        borderRadius: 8,
        padding: 12
    },

    card_icon: {
        backgroundColor: "#C4C4C4",
        padding: 6,
        borderRadius: 50,
    },

    card_cima: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#C4C4C4"
    },

    card_esq: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },

    card_titulo: {
        fontFamily: "Inter-Medium",
        color: "#404040"
    },

    card_descricao: {
        fontFamily: "Inter-Medium",
        fontSize: 14,
        lineHeight: 22,
        color: "#606060"
    },

    card_horario: {
        fontFamily: "Inter-Medium",
        fontSize: 12,
        color: "#C4C4C4"
    }

});