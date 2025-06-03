import React from "react";
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "./styles";
import { RootStackParamList } from "@/frontend/routes";

import { signOut } from "firebase/auth";
import { auth } from "../../../backend/services/shared/firebaseConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SairIcon from "../../../assets/images/sair.svg";

interface LogoutModalProps {
  LogoutModalActive: boolean;
  setLogoutModalActive: (visible: boolean) => void;
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Login">;

const LogoutModal: React.FC<LogoutModalProps> = ({
  LogoutModalActive,
  setLogoutModalActive,
}) => {
  const navigation = useNavigation<NavigationProps>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(["@userNome", "@userTema", "@userEmail"]);
      setLogoutModalActive(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Modal
      isVisible={LogoutModalActive}
      statusBarTranslucent={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
      <TouchableWithoutFeedback onPress={() => setLogoutModalActive(false)}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Deseja sair da conta?</Text>
        <Text style={styles.modal_texto}>
          Você será redirecionado para a tela de login.
        </Text>
        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleLogout}>
            <SairIcon width={20} height={18} color="white" strokeWidth={1.5} />
            <Text style={styles.modal_botao_sair_texto}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setLogoutModalActive(false)}>
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;