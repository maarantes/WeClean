import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import * as Clipboard from "expo-clipboard"
import { styles } from "./styles"

import { auth, db } from "@/backend/services/shared/firebaseConfigApp"
import { doc, getDoc } from "firebase/firestore"

import CopiarIcon from "../../../../assets/images/copiar.svg"
import ConcluirIcon from "../../../../assets/images/concluir.svg"

import ModalWrapper from "../ModalWrapper"

interface ConvidarModalProps {
  ConvidarModalActive: boolean
  setConvidarModalActive: (visible: boolean) => void
}

const ConvidarModal: React.FC<ConvidarModalProps> = ({
  ConvidarModalActive,
  setConvidarModalActive,
}) => {
  const [codigoConvite, setCodigoConvite] = useState("")
  const [copiado, setCopiado] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ConvidarModalActive) {
      carregarCodigoConvite()
      setCopiado(false)
    }
  }, [ConvidarModalActive])

  const carregarCodigoConvite = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    try {
      setLoading(true)
      const userRef = doc(db, "Usuarios", uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        console.log("Usuário não encontrado")
        return
      }

      const userData = userSnap.data()
      const grupoId = userData.grupoId || uid

      const grupoRef = doc(db, "Grupos", grupoId)
      const grupoSnap = await getDoc(grupoRef)

      if (grupoSnap.exists()) {
        const grupoData = grupoSnap.data()
        setCodigoConvite(grupoData.codigo_convite || "------")
      } else {
        console.log("Grupo não encontrado")
      }
    } catch (error) {
      console.error("Erro ao carregar código de convite:", error)
    } finally {
      setLoading(false)
    }
  }

  const copiarCodigo = async () => {
    Clipboard.setString(codigoConvite)
    setCopiado(true)
  }

  return (
    <ModalWrapper
      isVisible={ConvidarModalActive}
      onClose={() => setConvidarModalActive(false)}
      onPrimarioAcao={copiarCodigo}
      botaoPrimarioTexto={copiado ? "Copiado!" : "Copiar"}
      botaoSecundarioTexto="Fechar"
      icone={
        copiado ? (
          <ConcluirIcon width={16} height={16} color="#FFFFFF" />
        ) : (
          <CopiarIcon width={20} height={20} color="#FFFFFF" strokeWidth={1.5} />
        )
      }
      titulo="Código de Convite"
      descricao="Compartilhe este código para alguém entrar no seu grupo:"
      disablePrimario={loading || !codigoConvite}
    >
      <View style={styles.modal_codigo_container}>
        {loading ? (
          <ActivityIndicator size="large" color="#808080" />
        ) : (
          <Text style={styles.modal_codigo_texto}>{codigoConvite}</Text>
        )}
      </View>
    </ModalWrapper>
  )
}

export default ConvidarModal
