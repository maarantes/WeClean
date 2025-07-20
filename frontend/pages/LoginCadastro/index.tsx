import React, { useState, useRef } from "react"
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  UIManager,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native"
import Modal from "react-native-modal"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import { RootStackParamList } from "../../routes"
import { styles } from "./styles"
import { globalStyles } from "../../globalStyles"

import LogoWeClean from "../../../assets/images/logoWeClean.svg"
import Carrossel from "../../components/Carrossel/Carrossel"
import LoginIcon from "../../../assets/images/login.svg"

import { cadastrarUsuario, loginUsuario } from "../../../backend/services/auth/authService"
import { auth, db } from "@/backend/services/shared/firebaseConfigApp"
import { doc, getDoc } from "firebase/firestore"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import BotaoCTA from "@/frontend/components/BotaoCTA"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type NavigationProps = StackNavigationProp<RootStackParamList>

const PaginaLoginCadastro = () => {
  const navigation = useNavigation<NavigationProps>()
  const [abaSelecionada, setAbaSelecionada] = useState<"login" | "cadastro">("login")
  const scrollRef = useRef<KeyboardAwareScrollView>(null)
  const [loading, setLoading] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const [apelido, setApelido] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const imagens = [
    require("../../../assets/images/quadrado_bolhas.png"),
    require("../../../assets/images/quadrado_cesto.png"),
    require("../../../assets/images/quadrado_comida.png"),
    require("../../../assets/images/quadrado_handshake.png"),
    require("../../../assets/images/quadrado_esponja.png"),
  ]

  const handleOnFocus = (ref: any) => {
    scrollRef.current?.scrollToFocusedInput(ref)
  }

  const salvarInfoUsuarioLocal = async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    try {
      const userRef = doc(db, "Usuarios", uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        if (data.tema) {
          await AsyncStorage.setItem("@userTema", data.tema)
        }
        if (data.apelido) {
          await AsyncStorage.setItem("@userNome", data.apelido)
        }
        if (data.email) {
          await AsyncStorage.setItem("@userEmail", data.email)
        }
      }
    } catch (error) {
      console.error("Erro ao salvar informações locais:", error)
    }
  }

  const handleLoginOuCadastro = async () => {
    setLoading(true)
    try {
      if (abaSelecionada === "login") {
        if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos.")
        await loginUsuario(email, senha)
        await salvarInfoUsuarioLocal()
        navigation.navigate("Início")
      } else {
        if (!apelido || apelido.length > 8)
          return Alert.alert("Erro", "Apelido deve ter até 8 caracteres.")
        if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos.")
        await cadastrarUsuario(email, senha, apelido)
        await AsyncStorage.setItem("@userTema", "azul") // Cadastro novo = tema azul
        await AsyncStorage.setItem("@userNome", apelido)
        await AsyncStorage.setItem("@userEmail", email)
        navigation.navigate("Início")
      }
    } catch (error: any) {
      console.error(error)
      let mensagem = "Erro desconhecido."
      if (error.code === "auth/email-already-in-use") mensagem = "Este e-mail já está em uso."
      else if (error.code === "auth/invalid-email") mensagem = "E-mail inválido."
      else if (error.code === "auth/weak-password")
        mensagem = "A senha deve ter no mínimo 6 caracteres."
      else if (error.code === "auth/user-not-found") mensagem = "Usuário não encontrado."
      else if (error.code === "auth/wrong-password") mensagem = "Senha incorreta."
      Alert.alert("Erro", mensagem)
    } finally {
      setLoading(false)
    }
  }

  const ModalLoading = ({ visible }: { visible: boolean }) => (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      useNativeDriver
      customBackdrop={<View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "HeptaSlab-SemiBold",
            fontSize: 18,
            color: "black",
          }}
        >
          Realizando Login
        </Text>
        <ActivityIndicator size="large" color="#808080" style={{ marginTop: 20 }} />
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="dark" translucent={false} />
      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 20 }}
      >
        {/* Parte de cima: logo e carrossel */}
        <View style={styles.parte_cima}>
          <LogoWeClean width={200} height={150} />
        </View>

        {/* Abas de login/cadastro */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.parte_cima_texto}>Gestão compartilhada de tarefas domésticas</Text>
          <View style={styles.parte_carrossel}>
            <Carrossel
              imagens={imagens}
              itemSize={56}
              gap={12}
              velocidade={20000}
              direcao="esquerda"
            />
            <Carrossel
              imagens={imagens}
              itemSize={56}
              gap={12}
              velocidade={20000}
              direcao="direita"
            />
          </View>
          <View style={styles.parte_login}>
            <TouchableOpacity
              style={[styles.aba_opcao, abaSelecionada !== "login" && styles.desativado]}
              onPress={() => setAbaSelecionada("login")}
            >
              <Text
                style={[
                  styles.aba_opcao_texto,
                  abaSelecionada !== "login" && styles.desativado_texto,
                ]}
              >
                LOGIN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.aba_opcao, abaSelecionada !== "cadastro" && styles.desativado]}
              onPress={() => setAbaSelecionada("cadastro")}
            >
              <Text
                style={[
                  styles.aba_opcao_texto,
                  abaSelecionada !== "cadastro" && styles.desativado_texto,
                ]}
              >
                CADASTRE-SE
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.parte_input}>
            {abaSelecionada === "cadastro" && (
              <>
                <Text style={styles.input_label}>Apelido</Text>
                <TextInput
                  placeholder="Até 8 caracteres"
                  style={styles.input}
                  placeholderTextColor="#999"
                  value={apelido}
                  onChangeText={setApelido}
                  onFocus={(event) => handleOnFocus(event.target)}
                />
              </>
            )}

            <Text style={styles.input_label}>E-mail</Text>
            <TextInput
              placeholder="Digite aqui..."
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              onFocus={(event) => handleOnFocus(event.target)}
            />

            <Text style={styles.input_label}>Senha</Text>
            <TextInput
              placeholder="Digite aqui..."
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              onFocus={(event) => handleOnFocus(event.target)}
            />
          </View>

          {/* Botão */}
          <View style={styles.parte_baixo}>
            <BotaoCTA
              onPress={handleLoginOuCadastro}
              type="primario"
              size="max"
              icon={<LoginIcon width={28} height={28} color="#FFFFFF" />}
            >
              {abaSelecionada === "login" ? "Entrar" : "Criar conta"}
            </BotaoCTA>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

      <ModalLoading visible={loading} />
    </SafeAreaView>
  )
}

export default PaginaLoginCadastro
