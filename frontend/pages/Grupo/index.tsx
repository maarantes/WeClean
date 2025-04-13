import React from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import { globalStyles } from "@/frontend/globalStyles";

import { Navbar } from "@/frontend/components/Navbar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/frontend/routes";

import SetaBackIcon from "../../../assets/images/setaBack.svg";
import GrupoPessoaIcon from "../../../assets/images/grupo_pessoa.svg";
import GrupoSemPessoaIcon from "../../../assets/images/grupo_sem_pessoa.svg";
import ConvidarIcon from "../../../assets/images/convidar.svg";
import SairIcon from "../../../assets/images/sair.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";
import AdminIcon from "../../../assets/images/admin.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import FecharIcon from "../../../assets/images/fechar.svg";

const integrantes = [
  { nome: "Integrante 01", tipo: "admin", tema: "roxo" },
  { nome: "Integrante 02", tipo: "comum", tema: "azul" },
  { nome: "Integrante 03", tipo: "comum", tema: "verde" },
  { nome: "Integrante 04", tipo: "comum", tema: "rosa" },
];

const PaginaGrupo = () => {
  type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;
  const navigation = useNavigation<NavigationProps>();

  const totalVagas = 10;
  const integrantesCount = integrantes.length;
  const vagasRestantes = totalVagas - integrantesCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container_cima}>
        <TouchableOpacity
          style={styles.botao_voltar}
          onPress={() => navigation.goBack()}
        >
          <SetaBackIcon width={40} height={16} color={"#808080"} />
        </TouchableOpacity>
        <Text style={styles.titulo_cima}>Seu Grupo</Text>
      </View>

      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}
      >
        <View style={styles.container_titulo}>
          <Text style={styles.grupo_titulo}>Nome da Família Aqui</Text>
        </View>

        <View style={styles.card_grupo}>
          <View style={styles.card_grupo_icones}>
            {Array.from({ length: integrantesCount }).map((_, i) => (
              <GrupoPessoaIcon key={`pessoa_${i}`} width={26} height={26} />
            ))}
            {Array.from({ length: vagasRestantes }).map((_, i) => (
              <GrupoSemPessoaIcon key={`vazio_${i}`} width={26} height={26} />
            ))}
          </View>
          <Text style={styles.texto_integrantes}>
            {integrantesCount} integrantes
          </Text>
        </View>

        <View style={styles.container_botoes_acao}>
          <TouchableOpacity style={[styles.botao_base, styles.botao_convidar]}>
            <ConvidarIcon width={20} height={20} />
            <Text style={[styles.botao_base_texto, styles.botao_convidar_texto]}>
              Convidar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao_base, styles.botao_sair]}>
            <SairIcon width={20} height={20} color={"#5A189A"} />
            <Text style={[styles.botao_base_texto, styles.botao_sair_texto]}>
              Sair do Grupo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao_base, styles.botao_excluir]}>
            <ExcluirIcon width={20} height={20} />
            <Text style={[styles.botao_base_texto, styles.botao_excluir_texto]}>
              Excluir Grupo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container_integrantes}>
          <Text style={styles.texto_integrantes_titulo}>Integrantes</Text>

          {integrantes.map((pessoa, index) => {
          const bgClass = globalStyles[`tema_bg_${pessoa.tema}_secundario` as keyof typeof globalStyles] as { backgroundColor: string };;
          const colorClass = globalStyles[`tema_color_${pessoa.tema}_primario` as keyof typeof globalStyles] as { color: string };
            if (pessoa.tipo === "admin") {
              return (
                <View
                  key={index}
                  style={[styles.container_pessoa_admin, bgClass]}
                >
                  <AdminIcon width={20} height={20} color={colorClass.color} />
                  <Text style={[styles.container_pessoa_nome, colorClass]}>
                    {pessoa.nome}
                  </Text>
                </View>
              );
            }

            return (
              <View key={index} style={[styles.container_pessoa_normal, bgClass]}>
                <View style={styles.pessoa_normal_esq}>
                  <PerfilIcon width={20} height={20} color={colorClass.color} />
                  <Text style={[styles.container_pessoa_nome, colorClass]}>
                    {pessoa.nome}
                  </Text>
                </View>
                <TouchableOpacity>
                  <FecharIcon width={20} height={20} color={colorClass.color} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaGrupo;