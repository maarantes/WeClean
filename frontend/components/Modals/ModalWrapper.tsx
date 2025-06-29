import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native"
import Modal from "react-native-modal"
import { styles } from "./styles"

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
            <TouchableOpacity
              style={[
                styles.modal_botao_primario,
                botaoPrimarioMaior && styles.botao_primario_maior,
                acaoPerigosa && styles.modal_botao_vermelho,
                primarioDesabilitado && styles.desabilitado,
              ]}
              onPress={onPrimarioAcao}
              disabled={primarioDesabilitado}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {!!icone && <View style={{ marginRight: 8 }}>{icone}</View>}
                  <Text style={styles.modal_botao_primario_texto}>{textoPrimario}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.modal_botao_cancelar,
              botaoPrimarioMaior && styles.botao_secundario_menor,
            ]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.modal_botao_cancelar_texto}>{botaoSecundarioTexto}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ModalWrapper
