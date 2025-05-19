// src/components/CardTarefa/DeleteConfirmationModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

interface DeleteModalProps {
  visible: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  visible, loading, onConfirm, onCancel
}: DeleteModalProps) {
  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      onBackdropPress={onCancel}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={<View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />}
    >
      <View style={styles.modal_exclusao_container}>
        <Text style={styles.modal_exclusao_titulo}>Confirmação de Exclusão</Text>
        <Text style={styles.modal_exclusao_texto}>
          Tem certeza que deseja excluir esta tarefa?
        </Text>
        <View style={styles.modal_exclusao_botoes}>
          <TouchableOpacity
            style={styles.modal_excluir_botao_excluir}
            onPress={onConfirm}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#E7516E" />
            ) : (
              <Text style={styles.modal_botao_excluir_texto}>Excluir</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modal_excluir_botao_cancelar}
            onPress={onCancel}
          >
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
