import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';

import SairIcon from "../../../assets/images/sair.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import SininhoIcon from "../../../assets/images/sininho.svg";

import LogoutModal from "../ModalLogout";
import NotificacaoModal from '../ModalNotificacoes';

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '@/frontend/routes';

import { auth, db } from '@/backend/services/shared/firebaseConfigApp';
import { doc, getDoc } from 'firebase/firestore';
import { globalStyles } from '@/frontend/globalStyles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const ParteCima = () => {
  const [LogoutModalActive, setLogoutModalActive] = useState(false);
  const [NotificacaoModalActive, setNotificacaoModalActive] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [temaUsuario, setTemaUsuario] = useState<string>("undefined");

  type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const nomeCache = await AsyncStorage.getItem('@userNome');
        const temaCache = await AsyncStorage.getItem('@userTema');
  
        if (nomeCache) setNomeUsuario(nomeCache);
        if (temaCache) setTemaUsuario(temaCache);
  
        // Só busca no Firebase se não achar no cache
        if (!nomeCache || !temaCache) {
          const uid = auth.currentUser?.uid;
          if (!uid) return;
  
          const userSnap = await getDoc(doc(db, "Usuarios", uid));
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const nome = userData.apelido || "Usuário";
            const tema = userData.tema || "undefined";
  
            setNomeUsuario(nome);
            setTemaUsuario(tema);
  
            await AsyncStorage.setItem('@userNome', nome);
            await AsyncStorage.setItem('@userTema', tema);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar cache de usuário:', error);
      }
    };
  
    carregarDadosUsuario();
  }, []);
  

  const bgClass = globalStyles[`tema_bg_${temaUsuario}_secundario` as keyof typeof globalStyles] as { backgroundColor: string };
  const colorClass = globalStyles[`tema_color_${temaUsuario}_primario` as keyof typeof globalStyles] as { color: string };

  return (
    <>
    <StatusBar style="dark" translucent={true} />
    <View style={styles.container}>
      <View style={styles.usuario_container}>
        <View style={[styles.bolinha, bgClass]}>
          <PerfilIcon width={24} height={24} color={colorClass.color} />
        </View>
        <Text style={[styles.usuario_nome, colorClass]}>{nomeUsuario}</Text>
      </View>

      <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botao} onPress={() => setLogoutModalActive(true)}>
          <SairIcon width={24} height={24} color={"#808080"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setNotificacaoModalActive(true)}>
          <SininhoIcon width={24} height={24} color={"#808080"} />
        </TouchableOpacity>
      </View>

      <LogoutModal
        LogoutModalActive={LogoutModalActive}
        setLogoutModalActive={setLogoutModalActive}
      />

      <NotificacaoModal
        NotificacaoModalActive={NotificacaoModalActive}
        setNotificacaoModalActive={setNotificacaoModalActive}
      />

    </View>
    </>
  );
};

export default ParteCima;