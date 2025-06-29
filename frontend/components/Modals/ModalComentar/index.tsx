import React, { useEffect, useRef, useState } from "react"
import { TextInput } from "react-native"
import { styles } from "./styles"

import { auth } from "@/backend/services/shared/firebaseConfigApp"
import { criarComentario } from "@/backend/services/comentario/criarComentario"

import EnviarIcon from "../../../../assets/images/enviar.svg"
import ModalWrapper from "../ModalWrapper"

interface ComentarioModalProps {
  visible: boolean
  setVisible: (v: boolean) => void
  instanceId: string
  onCommentAdded?: () => void
}

const ComentarioModal: React.FC<ComentarioModalProps> = ({
  visible,
  setVisible,
  instanceId,
  onCommentAdded,
}) => {
  const [loading, setLoading] = useState(false)
  const [comentario, setComentario] = useState("")
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      setComentario("")
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [visible])

  const handleAddComment = async () => {
    const texto = comentario.trim()
    if (!texto || loading) return

    const userId = auth.currentUser?.uid
    if (!userId) {
      console.error("Usuário não autenticado")
      return
    }

    try {
      setLoading(true)
      await criarComentario(userId, instanceId, texto)
      onCommentAdded?.()
      setVisible(false)
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={() => setVisible(false)}
      onPrimarioAcao={handleAddComment}
      botaoPrimarioTexto="Enviar"
      botaoSecundarioTexto="Cancelar"
      icone={<EnviarIcon color="white" strokeWidth={1.5} />}
      loading={loading}
      titulo="Adicionar Comentário"
      disablePrimario={!comentario.trim()}
      bottomSheet
    >
      <TextInput
        ref={inputRef}
        style={styles.modal_input}
        placeholder="Digite aqui..."
        placeholderTextColor="#808080"
        value={comentario}
        onChangeText={setComentario}
        multiline
      />
    </ModalWrapper>
  )
}

export default ComentarioModal
