import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

import { auth } from "@/backend/services/shared/firebaseConfigApp";
import { criarComentario } from "../../../backend/services/comentario/criarComentario"

import EnviarIcon from "../../../assets/images/enviar.svg"

interface ComentarioModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  instanceId: string;
  onCommentAdded?: () => void;
}

const ComentarioModal: React.FC<ComentarioModalProps> = ({
  visible,
  setVisible,
  instanceId,
  onCommentAdded,
}) => {
  
  const [loading, setloading] = useState(false);
  const [comentario, setComentario] = useState("");
  const inputRef = useRef<TextInput>(null);
  

  useEffect(() => {
    if (visible) {
      setComentario("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [visible]);

  const handleAddComment = async () => {
    const text = comentario.trim();
    if (!text || loading) return;

    const userId = auth.currentUser?.uid;
    if (!userId) return console.error("Usuário não autenticado");

    try {
      setloading(true);
      await criarComentario(userId, instanceId, text);
      onCommentAdded?.();
      setVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
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
        <Text style={styles.modal_titulo}>Adicionar Comentário</Text>
        <TextInput
          ref={inputRef}
          style={styles.modal_input}
          placeholder="Digite seu comentário..."
          value={comentario}
          onChangeText={setComentario}
          multiline
        />
        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleAddComment}>
          {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
              <EnviarIcon color="white" strokeWidth={1.5} />
              <Text style={styles.modal_botao_sair_texto}>Enviar</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setVisible(false)}>
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ComentarioModal;