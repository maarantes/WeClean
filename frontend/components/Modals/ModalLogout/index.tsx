import React, { useState } from "react"

import ModalWrapper from "../ModalWrapper"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@/frontend/routes"
import { signOut } from "firebase/auth"
import { auth } from "../../../../backend/services/shared/firebaseConfigApp"
import AsyncStorage from "@react-native-async-storage/async-storage"

import SairIcon from "../../../../assets/images/sair.svg"

interface LogoutModalProps {
  LogoutModalActive: boolean
  setLogoutModalActive: (visible: boolean) => void
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Login">

const LogoutModal: React.FC<LogoutModalProps> = ({ LogoutModalActive, setLogoutModalActive }) => {
  const navigation = useNavigation<NavigationProps>()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut(auth)
      await AsyncStorage.multiRemove(["@userNome", "@userTema", "@userEmail"])
      setLogoutModalActive(false)
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper
      isVisible={LogoutModalActive}
      onClose={() => setLogoutModalActive(false)}
      onPrimarioAcao={handleLogout}
      botaoPrimarioTexto="Sair"
      botaoSecundarioTexto="Cancelar"
      titulo="Deseja sair da conta?"
      descricao="Você será redirecionado para a tela de login."
      loading={loading}
      icone={<SairIcon width={20} height={18} color="white" strokeWidth={1.5} />}
    />
  )
}

export default LogoutModal
