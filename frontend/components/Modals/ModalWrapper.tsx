import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native"
import Modal from "react-native-modal"
import { styles } from "./styles"
import BotaoCTA from "../BotaoCTA"

interface ModalWrapperProps {
  isVisible: boolean
  onClose: () => void
  onPrimarioAcao: () => void
  mostrarBotaoPrimario?: boolean
  botaoPrimarioTexto?: string
  icone?: React.ReactNode
  botaoSecundarioTexto?: string
  loading?: boolean
  children?: React.ReactNode
  titulo?: string
  descricao?: string | React.ReactNode
  disablePrimario?: boolean
  botaoPrimarioMaior?: boolean
  acaoPerigosa?: boolean
  bottomSheet?: boolean
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isVisible,
  onClose,
  onPrimarioAcao,
  mostrarBotaoPrimario = true,
  botaoPrimarioTexto = "Confirmar",
  icone,
  botaoSecundarioTexto = "Cancelar",
  loading = false,
  children,
  titulo,
  descricao,
  disablePrimario = false,
  botaoPrimarioMaior = false,
  acaoPerigosa = false,
  bottomSheet = false,
}) => {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!acaoPerigosa || !isVisible) {
      setCountdown(5)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [acaoPerigosa, isVisible])

  const primarioDesabilitado = disablePrimario || loading || (acaoPerigosa && countdown > 0)

  const textoPrimario =
    acaoPerigosa && countdown > 0 ? `${botaoPrimarioTexto} (${countdown})` : botaoPrimarioTexto

  return (
    <Modal
      isVisible={isVisible}
      statusBarTranslucent
      backdropOpacity={0.5}
      animationIn={bottomSheet ? "slideInUp" : "zoomIn"}
      animationOut={bottomSheet ? "slideOutDown" : "zoomOut"}
      onBackdropPress={onClose}
      style={bottomSheet ? { margin: 0, justifyContent: "flex-end" } : undefined}
      customBackdrop={
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              backgroundColor: "#404040",
              ...Dimensions.get("screen"),
              position: "absolute",
            }}
          />
        </TouchableWithoutFeedback>
      }
    >
      <View style={[styles.modal_container, bottomSheet && styles.bottom_sheet]}>
        {!!titulo && <Text style={styles.modal_titulo}>{titulo}</Text>}
        {!!descricao && <Text style={styles.modal_texto}>{descricao}</Text>}

        {children}

        <View style={styles.modal_botoes}>
          {mostrarBotaoPrimario && (
            <BotaoCTA
              onPress={onPrimarioAcao}
              type="primario"
              danger={acaoPerigosa}
              dangerCountdown={acaoPerigosa}
              size={botaoPrimarioMaior ? "grande" : "normal"}
              icon={icone}
              loading={loading}
              disabled={disablePrimario}
            >
              {botaoPrimarioTexto}
            </BotaoCTA>
          )}

          <BotaoCTA
            onPress={onClose}
            type="secundario"
            size={botaoPrimarioMaior ? "pequeno" : "normal"}
            disabled={loading}
          >
            {botaoSecundarioTexto}
          </BotaoCTA>
        </View>
      </View>
    </Modal>
  )
}

export default ModalWrapper