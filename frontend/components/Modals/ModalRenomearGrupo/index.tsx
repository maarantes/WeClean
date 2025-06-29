import React, { useState } from "react"
import { TextInput, Alert } from "react-native"
import { styles } from "./styles"
import { renomearGrupo } from "@/backend/services/grupos/renomearGrupo"
import MaisAdicaoIcon from "../../../../assets/images/mais_adicao.svg"
import ModalWrapper from "../ModalWrapper"

interface RenomearGrupoModalProps {
  RenomearGrupoModalActive: boolean
  setRenomearGrupoModalActive: (visible: boolean) => void
  onNomeGrupoAtualizado: (novoNome: string) => void
}

const RenomearGrupoModal: React.FC<RenomearGrupoModalProps> = ({
  RenomearGrupoModalActive,
  setRenomearGrupoModalActive,
  onNomeGrupoAtualizado,
}) => {
  const [novoNomeGrupo, setNovoNomeGrupo] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRenomear = async () => {
    try {
      setLoading(true)
      await renomearGrupo(novoNomeGrupo.trim())
      onNomeGrupoAtualizado(novoNomeGrupo.trim())
      setRenomearGrupoModalActive(false)
    } catch (error) {
      console.error("Erro ao renomear grupo:", error)
      Alert.alert("Erro", "Não foi possível renomear o grupo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={RenomearGrupoModalActive}
      onClose={() => setRenomearGrupoModalActive(false)}
      onPrimarioAcao={handleRenomear}
      botaoPrimarioTexto="Confirmar"
      botaoSecundarioTexto="Cancelar"
      icone={<MaisAdicaoIcon color="white" />}
      loading={loading}
      titulo="Renomear Grupo"
      descricao="Digite o novo nome para o seu grupo:"
      disablePrimario={!novoNomeGrupo.trim()}
    >
      <TextInput
        style={styles.input_modal}
        placeholder="Digite aqui..."
        placeholderTextColor="#808080"
        value={novoNomeGrupo}
        onChangeText={setNovoNomeGrupo}
      />
    </ModalWrapper>
  )
}

export default RenomearGrupoModal