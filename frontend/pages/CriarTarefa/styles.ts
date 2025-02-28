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
        marginBottom: 12,
        color: "#606060",
    },

    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        color: "#606060",
        paddingHorizontal: 12,
        fontSize: 16
    },

    cima: {
        marginTop: 32
    },

    dividir: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    botao_horario: {
        flexDirection: "row",
        gap: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        width: "48%",
        backgroundColor: "#5A189A",
        borderRadius: 4
    },

    botao_horario_texto: {
        color: "white",
        fontFamily: "Inter-Medium"
    },

    horario: {
        flexDirection: "row",
        gap: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        justifyContent: "space-between",
        alignItems: "center",
        width: "48%",
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
    },

    horario_texto: {
        color: "#606060",
        fontFamily: "Inter-Medium"
    },

    roxo: {
        color: "#5A189A",
        fontFamily: "Inter-SemiBold"
    },

    branco: {
        color: "white",
        fontFamily: "Inter-SemiBold"
    },

    lista_integrantes: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12

    },

    lista_botoes: {
        marginRight: -20
    },

    botao_frequencia: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5A189A",
        borderRadius: 4,
        marginRight: 8
    },

    botao_frequencia_normal: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#5A189A",
        color: "#5A189A",
        borderRadius: 4,
        marginRight: 8
    },

    ultimo: {
        marginRight: 20
    },

    lista_semanal: {
        marginTop: 16,
        flexDirection: "row",
        gap: "2%"
    },

    botao_frequencia_semanal: {
        flexDirection: "row",
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5A189A",
        borderRadius: 4,
        width: "12.5714%"
    },

    botao_frequencia_semanal_normal: {
        flexDirection: "row",
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#5A189A",
        color: "#5A189A",
        borderRadius: 4,
        width: "12.5714%"
    },

    lista_intervalo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16
    },

    input_menor: {
        backgroundColor: "#F5F5F5",
        color: "#606060",
        paddingHorizontal: 12,
        fontSize: 16,
        marginHorizontal: 12,
        width: 64
    },

    cimaMetade: {
        marginTop: 16
    },

    botao_add_data: {
        flexDirection: "row",
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.25,
        borderColor: "#5A189A",
        borderRadius: 4
    },

    botao_add_data_texto: {
        fontFamily: "Inter-Medium",
        color: "#5A189A",
    },

    nav_bottom: {
        alignItems: "center",
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#E8E8E8"
    }
});