import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles"; 
import { renomearGrupo } from "@/backend/services/grupos/renomearGrupo";
import MaisAdicaoIcon from "../../../assets/images/mais_adicao.svg";

interface RenomearGrupoModalProps {
  RenomearGrupoModalActive: boolean;
  setRenomearGrupoModalActive: (visible: boolean) => void;
  onNomeGrupoAtualizado: (novoNome: string) => void;
}

const RenomearGrupoModal: React.FC<RenomearGrupoModalProps> = ({
  RenomearGrupoModalActive,
  setRenomearGrupoModalActive,
  onNomeGrupoAtualizado,
}) => {
  const [novoNomeGrupo, setNovoNomeGrupo] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRenomear = async () => {
    try {
      setLoading(true);
  
      await renomearGrupo(novoNomeGrupo);
      onNomeGrupoAtualizado(novoNomeGrupo);
      setRenomearGrupoModalActive(false);
  
    } catch (error) {
      console.error("Erro ao renomear grupo:", error);
      Alert.alert("Erro", "Não foi possível renomear o grupo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={RenomearGrupoModalActive}
      statusBarTranslucent={true}
      onBackdropPress={() => setRenomearGrupoModalActive(false)}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
      <TouchableWithoutFeedback onPress={() => setRenomearGrupoModalActive(false)}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Renomear Grupo</Text>
        <Text style={styles.modal_texto}>
          Digite o novo nome para o seu grupo:
        </Text>

        <TextInput
          style={[styles.input_modal]}
          placeholder="Digite aqui..."
          placeholderTextColor="#808080"
          value={novoNomeGrupo}
          onChangeText={setNovoNomeGrupo}
        />

        <View style={styles.modal_botoes}>
          <TouchableOpacity style={styles.modal_botao_sair} onPress={handleRenomear} disabled={loading}>
          {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
              <>
              <MaisAdicaoIcon color="white" />
              <Text style={styles.modal_botao_sair_texto}>Confirmar</Text>
              </>
          )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.modal_botao_cancelar} onPress={() => setRenomearGrupoModalActive(false)}>
            <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RenomearGrupoModal;