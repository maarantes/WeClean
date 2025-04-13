import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import GrupoIcon from "../../../assets/images/grupo.svg";
import SairIcon from "../../../assets/images/sair.svg";
import LogoutModal from "@/frontend/components/LogoutModal";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '@/frontend/routes';

const ParteCima = () => {

  const [LogoutModalActive, setLogoutModalActive] = useState(false);

  type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
        <LogoWeClean />
        <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botao} onPress={() => { navigation.navigate("Grupo")}}>
          <GrupoIcon width={24} height={24}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setLogoutModalActive(true)}>
          <SairIcon width={24} height={24} color={"#808080"}/>
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
