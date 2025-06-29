import React, { useState, useRef, useEffect } from "react"
import { Text, TextInput, Alert, Pressable, View } from "react-native"
import { styles } from "./styles"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@/frontend/routes"

import { auth, db } from "@/backend/services/shared/firebaseConfigApp"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { entrarNoGrupoPorCodigo } from "@/backend/services/grupos/entrarGrupo"
import { apagarGrupoSozinho } from "@/backend/services/grupos/apagarGrupoSozinho"

import GrupoIcon from "../../../../assets/images/grupo.svg"
import ModalWrapper from "../ModalWrapper"

interface EntrarGrupoModalProps {
  EntrarGrupoModalActive: boolean
  setEntrarGrupoModalActive: (visible: boolean) => void
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">

const EntrarGrupoModal: React.FC<EntrarGrupoModalProps> = ({
  EntrarGrupoModalActive,
  setEntrarGrupoModalActive,
}) => {
  const [codigoInserido, setCodigoInserido] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmarTrocaSozinho, setConfirmarTrocaSozinho] = useState(false)
  const [grupoAtualId, setGrupoAtualId] = useState<string | null>(null)

  const inputRef = useRef<TextInput>(null)
  const navigation = useNavigation<NavigationProps>()

  const handleInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "")

    if (numericText.length < codigoInserido.length) {
      setCodigoInserido((prev) => prev.slice(0, -1))
    } else if (numericText.length <= 6) {
      setCodigoInserido(numericText)
    }
  }

  const entrarNoGrupo = async () => {
    if (codigoInserido.length !== 6) {
      Alert.alert("Erro", "Digite um código válido de 6 dígitos.")
      return
    }

    setLoading(true)

    try {
      const uid = auth.currentUser?.uid
      if (!uid) throw new Error("Usuário não autenticado.")

      const userSnap = await getDoc(doc(db, "Usuarios", uid))
      if (!userSnap.exists()) throw new Error("Usuário não encontrado.")

      const { grupoId } = userSnap.data()
      setGrupoAtualId(grupoId)

      const grupoAtualRef = doc(db, "Grupos", grupoId)
      const grupoAtualSnap = await getDoc(grupoAtualRef)

      if (grupoAtualSnap.exists()) {
        const grupoAtualData = grupoAtualSnap.data()
        if (grupoAtualData.integrantes.length === 1) {
          setLoading(false)
          setConfirmarTrocaSozinho(true)
          return
        }
      }

      await entrarContinuando()
    } catch (error) {
      console.error(error)
      setLoading(false)
      Alert.alert("Erro", "Ocorreu um erro.")
    }
  }

  const entrarContinuando = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const resultado = await entrarNoGrupoPorCodigo(codigoInserido, uid)
    setLoading(false)

    if (resultado.success) {
      Alert.alert("Sucesso", resultado.message)
      fecharModal()
      navigation.reset({ index: 0, routes: [{ name: "Grupo" }] })
    } else {
      Alert.alert("Erro", resultado.message)
    }
  }

  const confirmarTrocaEEntrar = async () => {
    try {
      setLoading(true)

      const uid = auth.currentUser?.uid
      if (!uid) throw new Error("Usuário não autenticado.")
      if (!grupoAtualId) throw new Error("Grupo atual não encontrado.")

      const gruposRef = collection(db, "Grupos")
      const q = query(gruposRef, where("codigo_convite", "==", codigoInserido))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setLoading(false)
        Alert.alert("Erro", "Código inválido ou grupo não encontrado.")
        return
      }

      const grupoDoc = querySnapshot.docs[0]
      const grupoId = grupoDoc.id

      if (grupoId === grupoAtualId) {
        setLoading(false)
        Alert.alert("Erro", "Você já está neste grupo.")
        return
      }

      await apagarGrupoSozinho(grupoAtualId)
      await entrarContinuando()
    } catch (error) {
      console.error(error)
      setLoading(false)
      Alert.alert("Erro", "Não foi possível entrar no grupo.")
    }
  }

  const fecharModal = () => {
    setEntrarGrupoModalActive(false)
    setConfirmarTrocaSozinho(false)
    setCodigoInserido("")
  }

  const renderInputCodigo = () => (
    <>
      <Pressable style={styles.codigo_input_area} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: 6 }).map((_, index) => {
          const preenchido = !!codigoInserido[index]
          const ehAtual = index === codigoInserido.length

          return (
            <View
              key={index}
              style={[styles.codigo_input_item, ehAtual && styles.item_selecionado]}
            >
              <Text style={[styles.codigo_input_text, !preenchido && styles.sem_nada]}>
                {preenchido ? codigoInserido[index] : "_"}
              </Text>
            </View>
          )
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={codigoInserido}
        onChangeText={handleInputChange}
        keyboardType="number-pad"
        maxLength={6}
        style={{
          position: "absolute",
          opacity: 0,
          height: 50,
          width: "100%",
          top: 125,
        }}
        autoFocus
      />
    </>
  )

  return (
    <ModalWrapper
      isVisible={EntrarGrupoModalActive}
      onClose={fecharModal}
      onPrimarioAcao={confirmarTrocaSozinho ? confirmarTrocaEEntrar : entrarNoGrupo}
      botaoPrimarioTexto={confirmarTrocaSozinho ? "Confirmar" : "Entrar"}
      botaoSecundarioTexto={confirmarTrocaSozinho ? "Cancelar" : "Cancelar"}
      icone={<GrupoIcon width={20} height={20} color="white" />}
      loading={loading}
      titulo={confirmarTrocaSozinho ? "Confirmar Saída" : "Entrar em um novo Grupo"}
      descricao={
        confirmarTrocaSozinho ? (
          <>
            Você está sozinho no seu grupo atual. Ao entrar em outro grupo, todas as suas tarefas
            serão apagadas.
            {"\n\n"}
            Deseja continuar?
          </>
        ) : (
          "Insira o código de convite abaixo:"
        )
      }
      disablePrimario={loading || (!confirmarTrocaSozinho && codigoInserido.length !== 6)}
    >
      {!confirmarTrocaSozinho && renderInputCodigo()}
    </ModalWrapper>
  )
}

export default EntrarGrupoModal
