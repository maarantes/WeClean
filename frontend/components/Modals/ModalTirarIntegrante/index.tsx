import React, { useState } from "react"
import ModalWrapper from "../ModalWrapper"
import RetiradoIcon from "../../../../assets/images/retirado_grupo.svg"

interface KickIntegranteModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  nomeIntegrante: string
  onConfirmKick: () => Promise<void>
}

const KickIntegranteModal: React.FC<KickIntegranteModalProps> = ({
  visible,
  setVisible,
  nomeIntegrante,
  onConfirmKick,
}) => {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirmKick()
      setVisible(false)
    } catch (err) {
      console.error("Erro ao remover integrante:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={() => setVisible(false)}
      onPrimarioAcao={handleConfirm}
      botaoPrimarioTexto="Confirmar"
      botaoSecundarioTexto="Cancelar"
      titulo="Remover Integrante"
      descricao={`Deseja remover ${nomeIntegrante} do grupo? O integrante será removido de todas as tarefas.`}
      loading={loading}
      icone={<RetiradoIcon width={20} height={20} color="white" />}
    />
  )
}

export default KickIntegranteModal
