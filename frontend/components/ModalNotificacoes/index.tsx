import React from "react";
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback, ScrollView } from "react-native";
import Modal from "react-native-modal";

import FecharIcon from "../../../assets/images/fechar.svg";

import { styles } from "./styles";
import { CardNotificacao } from "../CardNotificacao";


interface NotificacaoModalProps {
  NotificacaoModalActive: boolean;
  setNotificacaoModalActive: (visible: boolean) => void;
}

const NotificacaoModal: React.FC<NotificacaoModalProps> = ({
  NotificacaoModalActive,
  setNotificacaoModalActive,
}) => {

  return (
    <Modal
      isVisible={NotificacaoModalActive}
      statusBarTranslucent={false}
      backdropOpacity={0.5}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      customBackdrop={
      <TouchableWithoutFeedback onPress={() => setNotificacaoModalActive(false)}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <View style={styles.modal_cima}>
          <Text style={styles.modal_titulo}>Notificações (05)</Text>
          <TouchableOpacity onPress={() => setNotificacaoModalActive(false)}>
            <FecharIcon width={24} height={24} color={"#808080"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={styles.sem_notif}>
            <Text style={styles.sem_notif_texto}>Você não tem notificações.</Text>
          </View>

          <View style={styles.notif_lista}>
            <CardNotificacao tipo="add_comentario" />
            <CardNotificacao tipo="add_tarefa" />
            <CardNotificacao tipo="removido_tarefa" />
            <CardNotificacao tipo="removido_grupo" />
            <CardNotificacao tipo="excluido_grupo" />
          </View>
        </ScrollView>

        
      </View>
    </Modal>
  );
};

export default NotificacaoModal;