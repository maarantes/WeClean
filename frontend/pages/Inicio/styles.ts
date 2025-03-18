import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container_sem_tarefa: {
        borderWidth: 1, 
        borderColor: "#C4C4C4", 
        borderStyle: "solid",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 4
    },

    texto_sem_tarefa: {
        color: "#C4C4C4",
    },

    container_dia_semana: {
        gap: 20,
        marginBottom: 32
    },

    flex_between: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },

    data_dia: {
        color: "#C4C4C4",
        fontSize: 14
    }
    
});