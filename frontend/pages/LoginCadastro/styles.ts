import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    parte_cima: {
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    parte_cima_texto: {
        fontSize: 18,
        fontFamily: "Inter-Medium",
        textAlign: "center",
        lineHeight: 26,
        color: "#404040",
        marginBottom: 20
    },

    parte_login: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    aba_opcao: {
        width: "50%",
        paddingBottom: 8,
        alignItems: "center",
        borderBottomWidth: 4,
        borderBottomColor: "#5A189A"
    },

    aba_opcao_texto: {
        color: "#5A189A",
        fontFamily: "Inter-SemiBold",
        fontSize: 14
    },

    desativado: {
        borderBottomColor: "#C4C4C4"
    },

    desativado_texto: {
        color: "#C4C4C4"
    },

    parte_input: {
        marginTop: 20,
        gap: 16
    },

    input_label: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: "#606060",
        marginBottom: -10
    },

    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        paddingLeft: 12,
        fontFamily: "Inter-Medium"
    },

    botao_login: {
        flexDirection: "row",
        gap: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        width: "48%",
        backgroundColor: "#5A189A",
        borderRadius: 4
    },

    botao_login_texto: {
        color: "white",
        fontFamily: "Inter-Medium"
    },

    parte_baixo: {
        position: "fixed",
        top: 32,
        alignItems: "center"
    }

});