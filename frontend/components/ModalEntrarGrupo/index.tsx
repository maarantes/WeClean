import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Pressable, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import { auth, db } from "../../../backend/services/shared/firebaseConfigApp";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { entrarNoGrupoPorCodigo } from "../../../backend/services/grupos/entrarGrupo";
import { apagarGrupoSozinho } from "../../../backend/services/grupos/apagarGrupoSozinho";

interface EntrarGrupoModalProps {
  EntrarGrupoModalActive: boolean;
  setEntrarGrupoModalActive: (visible: boolean) => void;
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;

const EntrarGrupoModal: React.FC<EntrarGrupoModalProps> = ({
  EntrarGrupoModalActive,
  setEntrarGrupoModalActive
}) => {
  const [codigoInserido, setCodigoInserido] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmarTrocaSozinho, setConfirmarTrocaSozinho] = useState(false);
  const [grupoAtualId, setGrupoAtualId] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  const navigation = useNavigation<NavigationProps>();

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length < codigoInserido.length) {
      setCodigoInserido((prev) => prev.slice(0, -1));
    } else if (numericText.length <= 6) {
      setCodigoInserido(numericText);
    }
  };

  const entrarNoGrupo = async () => {
    if (codigoInserido.length !== 6) {
      Alert.alert("Erro", "Digite um código válido de 6 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Usuário não autenticado.");

      const userSnap = await getDoc(doc(db, "Usuarios", uid));
      if (!userSnap.exists()) throw new Error("Usuário não encontrado.");

      const { grupoId } = userSnap.data();
      setGrupoAtualId(grupoId);

      const grupoAtualRef = doc(db, "Grupos", grupoId);
      const grupoAtualSnap = await getDoc(grupoAtualRef);

      if (grupoAtualSnap.exists()) {
        const grupoAtualData = grupoAtualSnap.data();
        if (grupoAtualData.integrantes.length === 1) {
          setLoading(false);
          setConfirmarTrocaSozinho(true);
          return;
        }
      }

      await entrarContinuando();

    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Erro", "Ocorreu um erro.");
    }
  };

  const entrarContinuando = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
  
    const resultado = await entrarNoGrupoPorCodigo(codigoInserido, uid);
    setLoading(false);
  
    if (resultado.success) {
      Alert.alert("Sucesso", resultado.message);
      setEntrarGrupoModalActive(false);
      setCodigoInserido("");
      setConfirmarTrocaSozinho(false);
      
      navigation.reset({ index: 0, routes: [{ name: "Grupo" }] });
    } else {
      Alert.alert("Erro", resultado.message);
    }
  };
  

  const confirmarTrocaEEntrar = async () => {
    try {
      setLoading(true);

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Usuário não autenticado.");

      if (!grupoAtualId) throw new Error("Grupo atual não encontrado.");

      const gruposRef = collection(db, "Grupos");
      const q = query(gruposRef, where("codigo_convite", "==", codigoInserido));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoading(false);
        Alert.alert("Erro", "Código inválido ou grupo não encontrado.");
        return;
      }

      const grupoDoc = querySnapshot.docs[0];
      const grupoId = grupoDoc.id;

      if (grupoId === grupoAtualId) {
        setLoading(false);
        Alert.alert("Erro", "Você já está neste grupo.");
        return;
      }

      await apagarGrupoSozinho(grupoAtualId);
      await entrarContinuando();

    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Erro", "Não foi possível entrar no grupo.");
    }
  };

  const fecharModal = () => {
    setEntrarGrupoModalActive(false);
    setConfirmarTrocaSozinho(false);
    setCodigoInserido("");
  };


  return (
    <Modal
      isVisible={EntrarGrupoModalActive}
      statusBarTranslucent={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
      <TouchableWithoutFeedback onPress={fecharModal}>
        <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
      </TouchableWithoutFeedback>}
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>
          {confirmarTrocaSozinho ? "Confirmar Saída" : "Entrar em um novo Grupo"}
        </Text>

        <Text style={styles.modal_texto}>
          {confirmarTrocaSozinho
            ? "Você está sozinho no seu grupo atual. Se entrar em outro grupo, seu grupo e todas as suas tarefas serão apagadas. Deseja continuar?"
            : "Insira o código de convite abaixo:"}
        </Text>

        {!confirmarTrocaSozinho && (
          <>
            <Pressable
              style={styles.codigo_input_area}
              onPress={() => inputRef.current?.focus()}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <View key={index}>
                  <Text
                    style={[styles.codigo_input_text, !codigoInserido[index] && styles.sem_nada]}
                  >
                    {codigoInserido[index] || "_"}
                  </Text>
                </View>
              ))}
            </Pressable>

            <TextInput
              ref={inputRef}
              value={codigoInserido}
              onChangeText={handleInputChange}
              keyboardType="number-pad"
              maxLength={6}
              style={{
                position: 'absolute',
                opacity: 0,
                height: 50,
                width: '100%',
                top: 125,
              }}
              autoFocus
            />
          </>
        )}

        <View style={styles.modal_botoes}>
          {confirmarTrocaSozinho ? (
            <>
              <TouchableOpacity
                style={styles.modal_botao_sair}
                onPress={confirmarTrocaEEntrar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modal_botao_sair_texto}>Confirmar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modal_botao_cancelar}
                onPress={() => setConfirmarTrocaSozinho(false)}
              >
                <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.modal_botao_sair}
                onPress={entrarNoGrupo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modal_botao_sair_texto}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modal_botao_cancelar}
                onPress={() => setEntrarGrupoModalActive(false)}
              >
                <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default EntrarGrupoModal;