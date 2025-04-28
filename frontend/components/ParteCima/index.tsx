import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from './styles';

import GrupoIcon from "../../../assets/images/grupo.svg";
import SairIcon from "../../../assets/images/sair.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import LogoutModal from "@/frontend/components/ModalLogout";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '@/frontend/routes';

import { auth, db } from '@/backend/services/shared/firebaseConfigApp';
import { doc, getDoc } from 'firebase/firestore';
import { globalStyles } from '@/frontend/globalStyles';

import AsyncStorage from '@react-native-async-storage/async-storage'; // ➔ IMPORTAR

const ParteCima = () => {
  const [LogoutModalActive, setLogoutModalActive] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [temaUsuario, setTemaUsuario] = useState<string>("azul");

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
            const tema = userData.tema || "azul";
  
            setNomeUsuario(nome);
            setTemaUsuario(tema);
  
            // Atualiza o cache para as próximas vezes serem instantâneas
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
    <View style={styles.container}>
      <View style={styles.usuario_container}>
        <View style={[styles.bolinha, bgClass]}>
          <PerfilIcon width={20} height={20} color={colorClass.color} />
        </View>
        <Text style={[styles.usuario_nome, colorClass]}>{nomeUsuario}</Text>
      </View>

      <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Grupo") }}>
          <GrupoIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setLogoutModalActive(true)}>
          <SairIcon width={24} height={24} color={"#808080"} />
        </TouchableOpacity>
      </View>

      <LogoutModal
        LogoutModalActive={LogoutModalActive}
        setLogoutModalActive={setLogoutModalActive}
      />
    </View>
  );
};

export default ParteCima;