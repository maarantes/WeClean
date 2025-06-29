import React, { useState } from "react"
import { Text } from "react-native"
import LixeiraIcon from "../../../../assets/images/excluir.svg"
import ModalWrapper from "../ModalWrapper"

interface ModalExcluirGrupoProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onConfirmarExclusao: () => Promise<void>
}

const ModalExcluirGrupo: React.FC<ModalExcluirGrupoProps> = ({
  visible,
  setVisible,
  onConfirmarExclusao,
}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirmar = async () => {
    try {
      setLoading(true)
      await onConfirmarExclusao()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={() => setVisible(false)}
      onPrimarioAcao={handleConfirmar}
      botaoPrimarioTexto="Excluir"
      botaoSecundarioTexto="Cancelar"
      icone={<LixeiraIcon width={24} height={24} color="white" />}
      loading={loading}
      titulo="Confirmar Exclusão"
      descricao={
        <>
          Todos os integrantes serão realocados para seus grupos pessoais e todas as tarefas do
          grupo atual serão apagadas.{"\n\n"}
          Deseja continuar?
        </>
      }
      acaoPerigosa
      botaoPrimarioMaior
    />
  )
}

export default ModalExcluirGrupo
