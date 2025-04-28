import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";
import { atualizarInfoUsuario } from "@/backend/services/auth/editarInfo";

interface EditarInfoModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  valorAtual: string;
  onSalvar: (novoValor: string) => void;
}

const EditarInfoModal: React.FC<EditarInfoModalProps> = ({
  visible,
  setVisible,
  valorAtual,
  onSalvar,
}) => {
  const [novoValor, setNovoValor] = useState("");

  useEffect(() => {
    if (visible) {
      setNovoValor("");
    }
  }, [visible, valorAtual]);

  const handleSalvar = async () => {
    if (novoValor.trim() !== "") {
      try {
        await atualizarInfoUsuario("apelido", novoValor.trim());
        onSalvar(novoValor.trim());
        setVisible(false);
      } catch (err) {
        console.error("Erro ao salvar novo apelido:", err);
        Alert.alert("Erro", "Não foi possível atualizar. Tente novamente.");
      }
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Digite seu novo apelido</Text>

        <TextInput
          style={styles.input_modal}
          placeholder="Até 8 caracteres"
          value={novoValor}
          maxLength={8}
          onChangeText={setNovoValor}
        />

        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleSalvar}>
            <Text style={styles.modal_botao_sair_texto}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setVisible(false)}>
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditarInfoModal;