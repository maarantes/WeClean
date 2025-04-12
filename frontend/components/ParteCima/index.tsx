import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

import LogoWeClean from "../../../assets/images/logoWeClean.svg";
import GrupoIcon from "../../../assets/images/grupo.svg";
import SairIcon from "../../../assets/images/sair.svg";
import LogoutModal from "@/frontend/components/LogoutModal";

const ParteCima = () => {

  const [LogoutModalActive, setLogoutModalActive] = useState(false);

  return (
    <View style={styles.container}>
        <LogoWeClean />
        <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botao}>
          <GrupoIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setLogoutModalActive(true)}>
          <SairIcon width={24} height={24} />
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
