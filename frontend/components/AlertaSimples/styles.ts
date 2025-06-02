import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    alerta_container: {
        position: "absolute",
        width: "90%",
        left: 20,
        right: 20,
        bottom: 100,
        backgroundColor: "#F5F5F5",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 5,
        justifyContent: "space-between",
      },
      
      alerta_texto: {
        color: "#404040",
        fontFamily: "Inter-Medium",
        fontSize: 14
      },
    
      alerta_desfazer: {
        color: "black",
        fontFamily: "Inter-SemiBold",
        fontSize: 14
      }
    
});