import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "./styles";
import { RootStackParamList } from '@/frontend/routes';

import { signOut } from "firebase/auth";
import { auth } from "../../../backend/services/shared/firebaseConfig";

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
      onBackdropPress={() => setLogoutModalActive(false)}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Deseja sair da conta?</Text>
        <Text style={styles.modal_texto}>
          Você será redirecionado para a tela de login.
        </Text>
        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleLogout}>
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