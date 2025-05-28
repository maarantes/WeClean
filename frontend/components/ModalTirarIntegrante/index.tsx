import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

interface KickIntegranteModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  nomeIntegrante: string;
  onConfirmKick: () => Promise<void>;
}

const KickIntegranteModal: React.FC<KickIntegranteModalProps> = ({
  visible,
  setVisible,
  nomeIntegrante,
  onConfirmKick,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirmKick();
      setVisible(false);
    } catch (error) {
      console.error("Erro ao remover integrante:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
        <TouchableWithoutFeedback  onPress={() => setVisible(false)}>
          <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
        </TouchableWithoutFeedback>
      }
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Remover Integrante</Text>
        <Text style={styles.modal_texto}>
          Deseja remover {nomeIntegrante} do grupo? O integrante será removido de todas as tarefas.
        </Text>

        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleConfirm} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.modal_botao_sair_texto}>Confirmar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setVisible(false)} disabled={loading}>
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default KickIntegranteModal;