import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import Modal from "react-native-modal"
import { styles } from "./styles"
import { CardNotificacao } from "../CardNotificacao"

import FecharIcon from "../../../assets/images/fechar.svg"
import LixeiraIcon from "../../../assets/images/excluir.svg"

import { buscarNotificacoes } from "@/backend/services/notificacoes/BuscarNotificacoes"
import { auth } from "@/backend/services/shared/firebaseConfigApp"
import { useTema } from "@/frontend/hooks/useTema"
import { excluirTodasNotificacoes } from "@/backend/services/notificacoes/ExcluirTodasNotificacoes"

interface NotificacaoSidebarProps {
  NotificacaoSidebarActive: boolean
  setNotificacaoSidebarActive: (visible: boolean) => void
}

export const NotificacaoSidebar: React.FC<NotificacaoSidebarProps> = ({
  NotificacaoSidebarActive,
  setNotificacaoSidebarActive,
}) => {
  const [notificacoes, setNotificacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    if (!NotificacaoSidebarActive) return

    const carregarNotificacoes = async () => {
      setLoading(true)
      const userId = auth.currentUser?.uid
      if (!userId) return

      try {
        const resultado = await buscarNotificacoes(userId)
        setNotificacoes(resultado)
      } catch (e) {
        console.error("Erro ao buscar notificações:", e)
      } finally {
        setLoading(false)
      }
    }

    carregarNotificacoes()
  }, [NotificacaoSidebarActive])

  const handleLimparNotificacoes = async () => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    setExcluindo(true)
    try {
      await excluirTodasNotificacoes(userId)
      setNotificacoes([])
      setNotificacaoSidebarActive(false)
    } catch (e) {
      console.error("Erro ao excluir notificações:", e)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Modal
      isVisible={NotificacaoSidebarActive}
      statusBarTranslucent={false}
      backdropOpacity={0.5}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      customBackdrop={
        <TouchableWithoutFeedback onPress={() => setNotificacaoSidebarActive(false)}>
          <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
        </TouchableWithoutFeedback>
      }
    >
      <View style={styles.modal_container}>
        <View style={styles.modal_cima}>
          <Text style={styles.modal_titulo}>Notificações ({notificacoes.length})</Text>
          <TouchableOpacity onPress={() => setNotificacaoSidebarActive(false)}>
            <FecharIcon width={24} height={24} color={"#808080"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.botao_excluir]}
          onPress={handleLimparNotificacoes}
          disabled={excluindo}
        >
          {excluindo ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <LixeiraIcon width={24} height={24} color="white" />
          )}
          <Text style={styles.botao_excluir_texto}>Limpar Notificações</Text>
        </TouchableOpacity>

        <ScrollView style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.sem_notif_loading}>
              <ActivityIndicator size="large" color={"#808080"} />
            </View>
          ) : notificacoes.length === 0 ? (
            <View style={styles.sem_notif}>
              <Text style={styles.sem_notif_texto}>Você não tem notificações.</Text>
            </View>
          ) : (
            <>
              <View style={styles.notif_lista}>
                {notificacoes
                  .slice()
                  .reverse()
                  .map((n, index) => (
                    <CardNotificacao
                      key={index}
                      tipo={n.tipo}
                      nomeTarefa={n.nomeTarefa}
                      data={n.data}
                      nomeGrupo={n.nomeGrupo}
                      dataCriacao={n.dataCriacao}
                    />
                  ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

export default NotificacaoSidebar
