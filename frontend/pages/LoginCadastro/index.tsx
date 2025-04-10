import React, { useState, useRef } from "react";
import {
  SafeAreaView, Text, View, TouchableOpacity, TextInput, Platform, UIManager } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, } from '@react-navigation/native';

import { styles } from "./styles";

import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import Carrossel from "@/frontend/components/Carrossel/Carrossel";

import LoginIcon from "../../../assets/images/login.svg";
import { RootStackParamList } from "@/frontend/routes";
import { globalStyles } from "@/frontend/globalStyles";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PaginaLoginCadastro = () => {

  const [abaSelecionada, setAbaSelecionada] = useState<"login" | "cadastro">("login");
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

type NavigationProps = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProps>();

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        extraHeight={20}
        decelerationRate="normal"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20, marginLeft: 20, marginRight: 20 }}>

        <View style={styles.parte_cima}>
          <LogoWeClean width={200} height={150} />
          <Text style={styles.parte_cima_texto}>Gestão compartilhada de tarefas domésticas</Text>
          <Carrossel
            imagens={imagens} itemSize={56}
            gap={12} velocidade={20000}
            direcao="esquerda"
          />
          <Carrossel
            imagens={imagens} itemSize={56}
            gap={12} velocidade={20000}
            direcao="direita"
          />
        </View>

        <View style={styles.parte_login}>
          <TouchableOpacity
            style={[styles.aba_opcao, abaSelecionada !== "login" && styles.desativado]}
            onPress={() => setAbaSelecionada("login")}>
            <Text style={[styles.aba_opcao_texto, abaSelecionada !== "login" && styles.desativado_texto]}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aba_opcao, abaSelecionada !== "cadastro" && styles.desativado]}
            onPress={() => setAbaSelecionada("cadastro")}>
            <Text style={[styles.aba_opcao_texto, abaSelecionada !== "cadastro" && styles.desativado_texto]}>CADASTRE-SE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.parte_input}>
          {abaSelecionada === "cadastro" ? (
            <>
              <Text style={styles.input_label}>Apelido</Text>
              <TextInput
                placeholder="Até 8 caracteres"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={(event) => handleOnFocus(event.target)}
              />
              <Text style={styles.input_label}>E-mail</Text>
              <TextInput
                placeholder="Digite aqui..."
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={(event) => handleOnFocus(event.target)}
              />
              <Text style={styles.input_label}>Senha</Text>
              <TextInput
                placeholder="Digite aqui..."
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={(event) => handleOnFocus(event.target)}
              />
            </>
          ) : (
            <>
              <Text style={styles.input_label}>E-mail</Text>
              <TextInput
                placeholder="Digite aqui..."
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={(event) => handleOnFocus(event.target)}
              />
              <Text style={styles.input_label}>Senha</Text>
              <TextInput
                placeholder="Digite aqui..."
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={(event) => handleOnFocus(event.target)}
              />
            </>
          )}
        </View>

        <View style={styles.parte_baixo}>
        <TouchableOpacity style={globalStyles.botao_primario} onPress={() => navigation.navigate('Início')}>
          <LoginIcon width={28} height={28} color="#FFFFFF" />
          <Text style={globalStyles.botao_primario_texto}>{abaSelecionada === "login" ? "Entrar" : "Criar conta"}</Text>
        </TouchableOpacity>
      </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
    
  );
};

export default PaginaLoginCadastro;