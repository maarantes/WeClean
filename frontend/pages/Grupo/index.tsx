import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";

import { Navbar } from "../../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes";

import SetaBackIcon from "../../../assets/images/setaBack.svg";
import GrupoPessoaIcon from "../../../assets/images/grupo_pessoa.svg";
import GrupoSemPessoaIcon from "../../../assets/images/grupo_sem_pessoa.svg";
import ConvidarIcon from "../../../assets/images/convidar.svg";
import SairIcon from "../../../assets/images/sair.svg";
import ExcluirIcon from "../../../assets/images/excluir.svg";
import AdminIcon from "../../../assets/images/admin.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import FecharIcon from "../../../assets/images/fechar.svg";

import { auth, db } from "../../../backend/services/shared/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;

const PaginaGrupo = () => {
  const navigation = useNavigation<NavigationProps>();

  const [grupoNome, setGrupoNome] = useState("Carregando...");
  const [integrantes, setIntegrantes] = useState<
    { nome: string; tipo: string; tema: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const totalVagas = 10;

  useEffect(() => {
    const carregarGrupo = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        // 1. Buscar o grupo
        const grupoRef = doc(db, "Grupos", uid);
        const grupoSnap = await getDoc(grupoRef);

        if (grupoSnap.exists()) {
          const grupoData = grupoSnap.data();
          setGrupoNome(grupoData.nome || "Grupo");

          // 2. Buscar os integrantes (nome + tema de cada um)
          const integrantesData: { uid: string; tipo: string }[] = grupoData.integrantes || [];

          const promises = integrantesData.map(async ({ uid: membroUid, tipo }) => {
            const userRef = doc(db, "Usuarios", membroUid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};
            return {
              nome: userData.apelido || "Desconhecido",
              tema: userData.tema || "azul",
              tipo
            };
          });

          const integrantesCompletos = await Promise.all(promises);
          setIntegrantes(integrantesCompletos);
        }
      } catch (e) {
        console.error("Erro ao carregar grupo:", e);
      } finally {
        setLoading(false);
      }
    };

    carregarGrupo();
  }, []);

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
          <Text style={styles.grupo_titulo}>{grupoNome}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#5A189A" />
        ) : (
          <>
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
          </>
        )}
      </ScrollView>

      <Navbar />
    </SafeAreaView>
  );
};

export default PaginaGrupo;