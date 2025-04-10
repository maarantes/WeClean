import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    parte_cima: {
    },

    capa: {
        width: "100%",
        height: 140,
        justifyContent: "center",
        alignItems: "center"
    },

    moldura_perfil: {
        borderRadius: 100,
        width: 120,
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 150
    },

    informacoes: {
        marginTop: 56,
        paddingHorizontal: 20
    },

    parte_input: {
        marginTop: 32,
        gap: 16
    },

    input_label: {
        fontFamily: "Inter-SemiBold",
        fontSize: 14,
        color: "#606060",
        marginBottom: -10
    },

    input: {
        width: "90%",
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
        paddingLeft: 12,
        fontFamily: "Inter-Medium"
    },

    alinhar_editar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 4,
    },

    retangulo_container: {
        width: "48%",
        flexDirection: "row"
    },

    retangulo_tema: {
        flex: 1,
        borderTopRightRadius: 4,
        borderBottomEndRadius: 4,
    },

    retangulo_tema_escrito: {
        flex: 1,
        fontFamily: "Inter-SemiBold",
        paddingVertical: 8,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        fontSize: 14,
        textAlign: "center"
    },
    
    tema_wrapper: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    botao_editar: {
        flexDirection: "row",
        gap: 16,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        backgroundColor: "#F5F5F5",
        borderRadius: 4
    },

    botao_editar_texto: {
        color: "#808080",
        fontFamily: "Inter-SemiBold"
    },

    grupo_texto: {
        width: "55%",
        backgroundColor: "#F5F5F5",
        padding: 12,
        fontFamily: "Inter-SemiBold",
        borderRadius: 4,
        color: "#404040"
    },

    // Modal

    modal_container_descricao: {
        height: "66%",
        width: "100%", 
        alignSelf: "center",
        backgroundColor: "white",
        paddingTop: 20,
        paddingHorizontal: 20,
        margin: 0,
        justifyContent: "flex-start",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },

    modal_notch: {
        width: 64,
        height: 4,
        borderRadius: 20,
        backgroundColor: "#C4C4C4",
        marginBottom: 20
      },
    
    detalhe_cima: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24
    },

    detalhe_cima_topo: {
        alignItems: "center"
    },

    titulo_menor: {
        fontSize: 18,
        color: "#404040"
    },

    cor_opcoes_wrapper: {
        flexDirection: "row",
        gap: "4%",
        flexWrap: "wrap"
    },

    cor_selecionada: {
        backgroundColor: "#F5F5F5",
        padding: 12,
        borderRadius: 4,
        fontFamily: "Inter-SemiBold"
    },

    parte_baixo: {
        marginTop: 32,
        alignItems: "center"
    },

    botao_logout: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        gap: 12,
        backgroundColor: "#F5F5F5",
        borderRadius: 4
    },
    
    botao_logout_texto: {
        color: "#808080",
        fontFamily: "Inter-Medium"
    },

    cima_logout: {
        position: "absolute",
        top: 65,
        right: 20,
        zIndex: 10
    }
    

});