import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@/frontend/routes"
import { styles } from "./styles"
import MaisAdicaoIcon from "../../../../assets/images/mais_adicao.svg"
import LivroIcon from "../../../../assets/images/livro.svg"
import ModalWrapper from "../ModalWrapper"

interface PerguntaTarefaModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

type NavigationProps = StackNavigationProp<RootStackParamList>

const PerguntaTarefaModal: React.FC<PerguntaTarefaModalProps> = ({ visible, setVisible }) => {
  const navigation = useNavigation<NavigationProps>()

  const handleCriarDoZero = () => {
    setVisible(false)
    navigation.navigate("CriarTarefa", {})
  }

  const handleVerSugestoes = () => {
    setVisible(false)
    navigation.navigate("Sugestoes")
  }

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={() => setVisible(false)}
      onPrimarioAcao={() => {}}
      mostrarBotaoPrimario={false}
      titulo="Criar nova tarefa"
      descricao="Escolha como deseja criar sua nova tarefa:"
      botaoPrimarioTexto=""
      botaoSecundarioTexto="Cancelar"
    >
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
    </ModalWrapper>
  )
}

export default PerguntaTarefaModal
