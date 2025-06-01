import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";

import SairIcon from "../../../assets/images/sair.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import SininhoIcon from "../../../assets/images/sininho.svg";

import LogoutModal from "../ModalLogout";
import NotificacaoModal from "../ModalNotificacoes";

import { StatusBar } from "expo-status-bar";
import { globalStyles } from "@/frontend/globalStyles";
import { useUsuario } from "@/frontend/context/usuarioContext";

const ParteCima = () => {
  const [LogoutModalActive, setLogoutModalActive] = useState(false);
  const [NotificacaoModalActive, setNotificacaoModalActive] = useState(false);

  const { apelido, tema, temNotificacoes, recarregarNotificacoes } = useUsuario();

  const bgClass = globalStyles[`tema_bg_${tema}_secundario` as keyof typeof globalStyles] as { backgroundColor: string };
  const colorClass = globalStyles[`tema_color_${tema}_primario` as keyof typeof globalStyles] as { color: string };

  return (
    <>
      <StatusBar style="dark" translucent={true} />
      <View style={styles.container}>
        <View style={styles.usuario_container}>
          <View style={[styles.bolinha, bgClass]}>
            <PerfilIcon width={24} height={24} color={colorClass.color} />
          </View>
          <Text style={[styles.usuario_nome, colorClass]}>{apelido}</Text>
        </View>

        <View style={styles.containerBotoes}>
          <TouchableOpacity style={styles.botao} onPress={() => setLogoutModalActive(true)}>
            <SairIcon width={24} height={24} color={"#808080"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => setNotificacaoModalActive(true)}>
            <SininhoIcon width={24} height={24} color={"#808080"} />
            {temNotificacoes && <View style={styles.bolinha_notificacao} />}
          </TouchableOpacity>
        </View>

        <LogoutModal
          LogoutModalActive={LogoutModalActive}
          setLogoutModalActive={setLogoutModalActive}
        />

        <NotificacaoModal
          NotificacaoModalActive={NotificacaoModalActive}
          setNotificacaoModalActive={(v) => {
          setNotificacaoModalActive(v);
            if (!v) recarregarNotificacoes();
          }}
        />
      </View>
    </>
  );
};

export default ParteCima;