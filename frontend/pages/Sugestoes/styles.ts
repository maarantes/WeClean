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
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        zIndex: 1
    },
  
    titulo_cima: {
        color: "black",
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

    card_fundo: {
        borderRadius: 8,
        resizeMode: "cover",
    },

    card_cima: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        borderRadius: 8,
        padding: 16,
        marginTop: 60,
        marginHorizontal: 20
    },

    card_texto: {
        width: "75%",
    },

    card_titulo: {
        fontFamily: "HeptaSlab-SemiBold",
        fontSize: 20,
        color: "white",
        marginBottom: 8
    },

    card_subtitulo: {
        fontFamily: "Inter-SemiBold",
        color: "white",
        fontSize: 12,
        lineHeight: 18
    },

    wrapper_tipo_tarefa: {
        width: "100%",
        marginTop: 16,
        marginLeft: 8
    },

    botao_tipo_tarefa: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: "#F5F5F5",
        marginLeft: 12,
        borderRadius: 4
    },

    botao_tipo_tarefa_texto: {
        fontFamily: "Inter-Medium"
    },

    titulo_tipo_tarefa: {
        paddingHorizontal: 20,
        fontFamily: "Inter-SemiBold",
        marginTop: 16,
        fontSize: 16,
        color: "#606060"
    },

    ultimo: {
        marginRight: 28
    },

    nav_bottom: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#E8E8E8",
        gap: "4%"
    },

    botao: {
        flexDirection: "row",
        gap: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        width: "28%",
        backgroundColor: "black",
        borderRadius: 4
    },

    botao_texto: {
        color: "white",
        fontFamily: "Inter-SemiBold"
    },

    lista_cards: {
        marginTop: 12,
        paddingHorizontal: 20,
        gap: 20
    },

    lista_cards_titulo: {
        paddingHorizontal: 20,
        marginTop: 24,
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: "#606060"
    }

});