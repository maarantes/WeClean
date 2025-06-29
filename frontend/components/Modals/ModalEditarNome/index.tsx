import React, { useEffect, useRef, useState } from "react"
import { TextInput, Alert } from "react-native"
import { styles } from "./styles"
import { atualizarInfoUsuario } from "@/backend/services/auth/editarInfo"
import MaisAdicaoIcon from "../../../../assets/images/mais_adicao.svg"
import ModalWrapper from "../ModalWrapper"

interface EditarInfoModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  valorAtual: string
  onSalvar: (novoValor: string) => void
}

const EditarInfoModal: React.FC<EditarInfoModalProps> = ({
  visible,
  setVisible,
  valorAtual,
  onSalvar,
}) => {
  const [novoValor, setNovoValor] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      setNovoValor("")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [visible])

  const handleSalvar = async () => {
    const texto = novoValor.trim()
    if (!texto || texto === valorAtual) return

    try {
      setLoading(true)
      await atualizarInfoUsuario("apelido", texto)
      onSalvar(texto)
      setVisible(false)
    } catch (err) {
      console.error("Erro ao salvar novo apelido:", err)
      Alert.alert("Erro", "Não foi possível atualizar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={() => setVisible(false)}
      onPrimarioAcao={handleSalvar}
      botaoPrimarioTexto="Salvar"
      botaoSecundarioTexto="Cancelar"
      icone={<MaisAdicaoIcon width={24} color="#FFFFFF" />}
      loading={loading}
      titulo="Digite seu novo apelido"
      disablePrimario={!novoValor.trim() || novoValor.trim() === valorAtual}
      bottomSheet
    >
      <TextInput
        ref={inputRef}
        style={styles.input_modal}
        placeholder="Até 8 caracteres"
        placeholderTextColor="#808080"
        value={novoValor}
        maxLength={8}
        onChangeText={setNovoValor}
      />
    </ModalWrapper>
  )
}

export default EditarInfoModal
