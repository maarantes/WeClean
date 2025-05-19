import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, TouchableWithoutFeedback } from "react-native";
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

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setNovoValor("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

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
      statusBarTranslucent={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0, justifyContent: "flex-end" }}
      customBackdrop={
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Digite seu novo apelido</Text>

        <TextInput
          ref={inputRef}
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