import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Pressable } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

import { auth, db } from "../../../backend/services/shared/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { entrarNoGrupoPorCodigo } from "../../../backend/services/grupos/entrarGrupo";
import { apagarGrupoSozinho } from "../../../backend/services/grupos/apagarGrupoSozinho";

interface EntrarGrupoModalProps {
  EntrarGrupoModalActive: boolean;
  setEntrarGrupoModalActive: (visible: boolean) => void;
}

const EntrarGrupoModal: React.FC<EntrarGrupoModalProps> = ({
  EntrarGrupoModalActive,
  setEntrarGrupoModalActive,
}) => {
  const [codigoInserido, setCodigoInserido] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmarTrocaSozinho, setConfirmarTrocaSozinho] = useState(false);

  const inputRef = useRef<TextInput>(null);

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

      const grupoAtualRef = doc(db, "Grupos", uid);
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
    } else {
      Alert.alert("Erro", resultado.message);
    }
  };

  const confirmarTrocaEEntrar = async () => {
    try {
      setLoading(true);
  
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Usuário não autenticado.");
  
      // Primeiro: Verificar o grupo do código
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
  
      if (grupoId === uid) {
        setLoading(false);
        Alert.alert("Erro", "Você já está neste grupo.");
        return;
      }
  
      await apagarGrupoSozinho();
      await entrarContinuando();
  
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Erro", "Não foi possível entrar no grupo.");
    }
  };
  

  return (
    <Modal
      isVisible={EntrarGrupoModalActive}
      onBackdropPress={() => {
        setEntrarGrupoModalActive(false);
        setConfirmarTrocaSozinho(false);
      }}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
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