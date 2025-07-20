import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  GestureResponderEvent
} from "react-native"
import { styles } from "./styles"

interface BotaoCTAProps {
  onPress: (event: GestureResponderEvent) => void
  children?: React.ReactNode
  icon?: React.ReactNode
  type?: "primario" | "secundario"
  danger?: boolean
  size?: "max" | "grande" | "normal" | "pequeno" | "auto"
  disabled?: boolean
  loading?: boolean
  dangerCountdown?: boolean
  countdownSeconds?: number
  fontWeight?: "medium" | "semiBold"
}

const BotaoCTA: React.FC<BotaoCTAProps> = ({
  onPress,
  children,
  icon,
  type = "primario",
  danger = false,
  size = "normal",
  disabled = false,
  loading = false,
  dangerCountdown = false,
  countdownSeconds = 5,
  fontWeight = "semiBold"
}) => {
  const isPrimario = type === "primario"
  const [countdown, setCountdown] = useState(countdownSeconds)

  const isDangerWithCountdown = danger && dangerCountdown
  const isBotaoDesabilitado = disabled || loading || (isDangerWithCountdown && countdown > 0)

  useEffect(() => {
    if (!isDangerWithCountdown) {
      setCountdown(countdownSeconds)
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
  }, [isDangerWithCountdown])

  const renderText = () => {
    if (loading) {
      return (
        <ActivityIndicator size="small" color={isPrimario ? "#FFF" : "#2274A5"} />
      )
    }

    const texto =
      typeof children === "string" && isDangerWithCountdown && countdown > 0
        ? `${children} (${countdown})`
        : children

    return (
      <Text style={[
        styles.textBase,
        isPrimario ? styles.textPrimario : styles.textSecundario,
        fontWeight === "medium" && styles.fontWeightMedium,
      ]}>
        {texto}
      </Text>
    )
  }

  const buttonStyle = [
    styles.buttonBase,
    isPrimario ? styles.botaoPrimario : styles.botaoSecundario,
    size === "max" && styles.sizeMaximo,
    size === "grande" && styles.sizeGrande,
    size === "pequeno" && styles.sizePequeno,
    size === "auto" && styles.sizeAuto,
    danger && styles.danger,
    isBotaoDesabilitado && styles.desabilitado,
  ]

  return (
    <View style={[styles.wrapper]}>
      <Pressable
        onPress={onPress}
        disabled={isBotaoDesabilitado}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
        style={buttonStyle}
      >
        <View style={styles.innerContainer}>
          {!loading && icon && <View style={styles.iconContainer}>{icon}</View>}
          {renderText()}
        </View>
      </Pressable>
    </View>
  )
}

export default BotaoCTA