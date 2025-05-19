import React from "react";
import { View, Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '@/frontend/routes';
import { styles } from "./styles";
import MaisAdicaoIcon from "../../../assets/images/mais_adicao.svg";
import LivroIcon from "../../../assets/images/livro.svg";

interface PerguntaTarefaModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

type NavigationProps = StackNavigationProp<RootStackParamList>;

const PerguntaTarefaModal: React.FC<PerguntaTarefaModalProps> = ({ visible, setVisible }) => {
  const navigation = useNavigation<NavigationProps>();

  const handleCriarDoZero = () => {
    setVisible(false);
    navigation.navigate("CriarTarefa", {});
  };

  const handleVerSugestoes = () => {
    setVisible(false);
    navigation.navigate("Sugestoes");
  };

  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Criar nova tarefa</Text>
        <Text style={styles.modal_texto}>Escolha como deseja criar sua nova tarefa:</Text>
        <View style={styles.modal_botoes}>

        <TouchableOpacity style={styles.modal_card_tipo} onPress={handleCriarDoZero}>
            <View style={styles.card_esq}>
                <View style={styles.card_icone_fundo}>
                    <MaisAdicaoIcon width={40} color={"#FFFFFF"} />
                </View>
                <View style={styles.card_texto}>
                    <Text style={styles.card_titulo}>Criar do zero</Text>
                    <Text style={styles.card_subtitulo}>Crie uma tarefa do zero.</Text>
                </View>
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modal_card_tipo} onPress={handleVerSugestoes}>
            <View style={styles.card_esq}>
                <View style={styles.card_icone_fundo}>
                    <LivroIcon width={40} color={"#FFFFFF"} />
                </View>
                <View style={styles.card_texto}>
                    <Text style={styles.card_titulo}>Ver sugestões</Text>
                    <Text style={styles.card_subtitulo}>Comece com configurações pré-definidas.</Text>
                </View>
            </View>
        </TouchableOpacity>


        </View>

        <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setVisible(false)}>
          <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PerguntaTarefaModal;
