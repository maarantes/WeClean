import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../routes";
import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";

import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import Carrossel from "../../components/Carrossel/Carrossel";
import LoginIcon from "../../../assets/images/login.svg";

import { cadastrarUsuario, loginUsuario } from "../../../backend/services/auth/authService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavigationProps = StackNavigationProp<RootStackParamList>;

const PaginaLoginCadastro = () => {
  const navigation = useNavigation<NavigationProps>();
  const [abaSelecionada, setAbaSelecionada] = useState<"login" | "cadastro">("login");
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  // Estados dos inputs
  const [apelido, setApelido] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const imagens = [
    require("../../../assets/images/quadrado_bolhas.png"),
    require("../../../assets/images/quadrado_cesto.png"),
    require("../../../assets/images/quadrado_comida.png"),
    require("../../../assets/images/quadrado_handshake.png"),
    require("../../../assets/images/quadrado_esponja.png"),
  ];

  const handleOnFocus = (ref: any) => {
    scrollRef.current?.scrollToFocusedInput(ref);
  };

  const handleLoginOuCadastro = async () => {
    try {
      if (abaSelecionada === "login") {
        if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos.");
        await loginUsuario(email, senha);
        navigation.navigate("Início");
      } else {
        if (!apelido || apelido.length > 8) return Alert.alert("Erro", "Apelido deve ter até 8 caracteres.");
        if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos.");
        await cadastrarUsuario(email, senha, apelido);
        navigation.navigate("Início");
      }
    } catch (error: any) {
      console.error(error);
      let mensagem = "Erro desconhecido.";
      if (error.code === "auth/email-already-in-use") mensagem = "Este e-mail já está em uso.";
      else if (error.code === "auth/invalid-email") mensagem = "E-mail inválido.";
      else if (error.code === "auth/weak-password") mensagem = "A senha deve ter no mínimo 6 caracteres.";
      else if (error.code === "auth/user-not-found") mensagem = "Usuário não encontrado.";
      else if (error.code === "auth/wrong-password") mensagem = "Senha incorreta.";
      Alert.alert("Erro", mensagem);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
          <Text style={styles.parte_cima_texto}>Gestão compartilhada de tarefas domésticas</Text>
          <Carrossel imagens={imagens} itemSize={56} gap={12} velocidade={20000} direcao="esquerda" />
          <Carrossel imagens={imagens} itemSize={56} gap={12} velocidade={20000} direcao="direita" />
        </View>

        {/* Abas de login/cadastro */}
        <View style={styles.parte_login}>
          <TouchableOpacity
            style={[styles.aba_opcao, abaSelecionada !== "login" && styles.desativado]}
            onPress={() => setAbaSelecionada("login")}
          >
            <Text style={[styles.aba_opcao_texto, abaSelecionada !== "login" && styles.desativado_texto]}>
              LOGIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba_opcao, abaSelecionada !== "cadastro" && styles.desativado]}
            onPress={() => setAbaSelecionada("cadastro")}
          >
            <Text style={[styles.aba_opcao_texto, abaSelecionada !== "cadastro" && styles.desativado_texto]}>
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
          <TouchableOpacity style={globalStyles.botao_primario} onPress={handleLoginOuCadastro}>
            <LoginIcon width={28} height={28} color="#FFFFFF" />
            <Text style={globalStyles.botao_primario_texto}>
              {abaSelecionada === "login" ? "Entrar" : "Criar conta"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PaginaLoginCadastro;