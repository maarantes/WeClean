import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        backgroundColor: "#F8F8F8",
        marginBottom: 20,
        padding: 20,
        borderRadius: 8,
    },

    container_cima: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8"
    },

    usuario_container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    bolinha: {
        width: 24,
        height: 24,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    usuario_nome: {
        fontSize: 14,
        fontFamily: "Inter-SemiBold",
    },

    data_texto: {
        color: "#808080",
        fontFamily: "Inter-Medium",
        fontSize: 12
    },

    conteudo_texto: {
        color: "#606060",
        fontFamily: "Inter-Medium",
        fontSize: 14,
        lineHeight: 16
    }

});