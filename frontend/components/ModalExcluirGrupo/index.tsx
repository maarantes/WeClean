import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

interface ModalExcluirGrupoProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirmarExclusao: () => Promise<void>;
}

const ModalExcluirGrupo: React.FC<ModalExcluirGrupoProps> = ({ visible, setVisible, onConfirmarExclusao }) => {
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(false);

  // Começa o countdown sempre que o modal abrir
  useEffect(() => {
    if (!visible) {
      setCountdown(10);
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const handleConfirmar = async () => {
    try {
      setLoading(true);
      await onConfirmarExclusao();
    } finally {
      setLoading(false);
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
        <Text style={styles.modal_titulo}>Deseja excluir este grupo?</Text>
        <Text style={styles.modal_texto}>
          Todos os integrantes serão realocados para seus grupos pessoais e todas as tarefas do grupo atual serão apagadas.
        </Text>

        <Text style={styles.modal_texto_baixo}>
          Deseja continuar?
        </Text>
        

        <View style={styles.modal_botoes}>
          <TouchableOpacity
            style={[styles.modal_botao_sair, countdown > 0 && { opacity: 0.5 }]}
            onPress={handleConfirmar}
            disabled={countdown > 0}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modal_botao_sair_texto}>
                {countdown > 0 ? `Excluir (${countdown})` : "Excluir"}
              </Text>
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

export default ModalExcluirGrupo;