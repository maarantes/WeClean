import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";

import { styles } from "./styles";
import { globalStyles } from "../../globalStyles";

import { Navbar } from "../../components/Navbar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes";

import ConvidarModal from "../../components/ModalConvidar";
import EntrarGrupoModal from "../../components/ModalEntrarGrupo";

import SetaBackIcon from "../../../assets/images/setaBack.svg";
import GrupoPessoaIcon from "../../../assets/images/grupo_pessoa.svg";
import GrupoSemPessoaIcon from "../../../assets/images/grupo_sem_pessoa.svg";
import ConvidarIcon from "../../../assets/images/convidar.svg";
import SairIcon from "../../../assets/images/sair.svg";1
import AdminIcon from "../../../assets/images/admin.svg";
import PerfilIcon from "../../../assets/images/user.svg";
import FecharIcon from "../../../assets/images/fechar.svg";

import { auth, db } from "../../../backend/services/shared/firebaseConfigApp";
import { doc, getDoc } from "firebase/firestore";
import GrupoMenu from "@/frontend/components/GrupoMenu";
import RenomearGrupoModal from "@/frontend/components/ModalRenomearGrupo";
import AlertaSimples from "@/frontend/components/AlertaSimples";
import KickIntegranteModal from "@/frontend/components/ModalTirarIntegrante";
import { kickarIntegrante } from "@/backend/services/grupos/removerIntegrante";
import ModalSairGrupo from "@/frontend/components/ModalSairGrupo";

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;

const PaginaGrupo = () => {

  const navigation = useNavigation<NavigationProps>();

  const [grupoNome, setGrupoNome] = useState("");
  const [integrantes, setIntegrantes] = useState<
    { uid: string, nome: string; tipo: string; tema: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [userAdmin, setUserAdmin] = useState(false);
  const [grupoIdAtual, setGrupoIdAtual] = useState<string>("");

  const totalVagas = 10;

  const [convidarModalActive, setConvidarModalActive] = useState(false);
  const [entrarGrupoModalActive, setEntrarGrupoModalActive] = useState(false);
  const [renameGroupModalActive, setRenameGroupModalActive] = useState(false);

  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [integranteSelecionadoNome, setIntegranteSelecionadoNome] = useState<string | null>(null);
  const [integranteSelecionadoUID, setIntegranteSelecionadoUID] = useState<string | null>(null);

  const [sairGrupoModalVisible, setSairGrupoModalVisible] = useState(false);  

  const [toastVisible, setToastVisible] = useState(false);
  const [mensagemToast, setMensagemToast] = useState("");

  const carregarGrupo = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
  
    try {
      const userRef = doc(db, "Usuarios", uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        console.log("Usuário não encontrado.");
        return;
      }
  
      const userData = userSnap.data();
      const grupoId = userData.grupoId || uid;
      setGrupoIdAtual(grupoId);
  
      const grupoRef = doc(db, "Grupos", grupoId);
      const grupoSnap = await getDoc(grupoRef);
  
      if (grupoSnap.exists()) {
        const grupoData = grupoSnap.data();
        setGrupoNome(grupoData.nome || "Grupo");
  
        const integrantesData: { uid: string; tipo: string }[] = grupoData.integrantes || [];
  
        // Aqui a gente verifica se o usuário atual é admin
        const souAdminAtual = integrantesData.find((i) => i.uid === uid && i.tipo === "admin");
        setUserAdmin(!!souAdminAtual);
  
        const promises = integrantesData.map(async ({ uid: membroUid, tipo }) => {
          const userRef = doc(db, "Usuarios", membroUid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          return {
            uid: membroUid,
            nome: userData.apelido || "Desconhecido",
            tema: userData.tema || "azul",
            tipo,
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

  useFocusEffect(
    useCallback(() => {
      carregarGrupo();
    }, [])
  );

  const integrantesCount = integrantes.length;
  const vagasRestantes = totalVagas - integrantesCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container_cima}>
        <TouchableOpacity style={styles.botao_voltar} onPress={() => navigation.goBack()}>
          <SetaBackIcon width={40} height={16} color={"#808080"} />
        </TouchableOpacity>
        <Text style={styles.titulo_cima}>Seu Grupo</Text>
      </View>
      {loading ? (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}>
          <ActivityIndicator size="large" color="#5A189A" />
        </View>
            ) : (

      <ScrollView
        style={globalStyles.containerPagina}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 80 }}
      >
        <View style={styles.container_titulo}>
          <Text style={styles.grupo_titulo}>{grupoNome}</Text>
          <GrupoMenu
            isAdmin={userAdmin}
            sozinho={integrantes.length === 1}
            onSairGrupo={() => setSairGrupoModalVisible(true)}
            onRenomearGrupo={() => setRenameGroupModalActive(true)}
            onExcluirGrupo={() => console.log("Excluir grupo")}
          />
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
              {integrantesCount.toString().padStart(2, "0")} {integrantesCount === 1 ? "integrante" : "integrantes"}
            </Text>
          </View>
          
          <View style={styles.botoes_container}>
            {/* Botão Convidar */}
            <TouchableOpacity
              style={[
                styles.botao_base,
                styles.botao_convidar,
                integrantesCount === 1 && styles.botao_menor,
              ]}
              onPress={() => setConvidarModalActive(true)}
            >
              <ConvidarIcon width={20} height={20} />
              <Text style={[styles.botao_base_texto, styles.botao_convidar_texto]}>
                Convidar
              </Text>
            </TouchableOpacity>

            {/* Botão Trocar Grupo */}
            {integrantesCount === 1 && (
              <TouchableOpacity
                style={[styles.botao_base, styles.botao_sair, styles.botao_menor]}
                onPress={() => setEntrarGrupoModalActive(true)}
              >
                <SairIcon width={20} height={20} color={"#5A189A"}/>
                <Text style={[styles.botao_base_texto, styles.botao_sair_texto]}>
                  Trocar Grupo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.container_integrantes}>
          <Text style={styles.texto_integrantes_titulo}>Integrantes</Text>

          {integrantes
          .sort((a, b) => {
            if (a.tipo === "admin" && b.tipo !== "admin") return -1;
            if (a.tipo !== "admin" && b.tipo === "admin") return 1;
            return a.nome.localeCompare(b.nome);
          })
            .map((pessoa, index) => {
              const bgClass = globalStyles[`tema_bg_${pessoa.tema}_secundario` as keyof typeof globalStyles] as { backgroundColor: string };
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
                    <PerfilIcon width={20} height={20} strokeWidth={1.25} color={colorClass.color} />
                    <Text style={[styles.container_pessoa_nome, colorClass]}>
                      {pessoa.nome}
                    </Text>
                  </View>
                  {userAdmin && (
                    <TouchableOpacity
                      onPress={() => {
                        setIntegranteSelecionadoNome(pessoa.nome);
                        setIntegranteSelecionadoUID(pessoa.uid);
                        setKickModalVisible(true);
                      }}
                    >
                      <FecharIcon width={20} height={20} color={colorClass.color} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>
      )}

      <ConvidarModal
        ConvidarModalActive={convidarModalActive}
        setConvidarModalActive={setConvidarModalActive}
      />

      <EntrarGrupoModal
        EntrarGrupoModalActive={entrarGrupoModalActive}
        setEntrarGrupoModalActive={setEntrarGrupoModalActive}
      />

    <RenomearGrupoModal
      RenomearGrupoModalActive={renameGroupModalActive}
      setRenomearGrupoModalActive={setRenameGroupModalActive}
      onNomeGrupoAtualizado={(novoNome) => {
        setGrupoNome(novoNome);
        setMensagemToast("Nome do grupo alterado com sucesso!");
        setToastVisible(true);
      }}
    />

    <KickIntegranteModal
      visible={kickModalVisible}
      setVisible={setKickModalVisible}
      nomeIntegrante={integranteSelecionadoNome || ""}
      onConfirmKick={async () => {
        try {
          if (integranteSelecionadoUID) {
            await kickarIntegrante(integranteSelecionadoUID, grupoIdAtual);
            setMensagemToast(`"${integranteSelecionadoNome}" foi removido do grupo com sucesso!`);
            setToastVisible(true);
            carregarGrupo();
          }
        } catch (error) {
          console.error("Erro ao kickar integrante:", error);
        }
        
      }}
    />

    <ModalSairGrupo
      visible={sairGrupoModalVisible}
      setVisible={setSairGrupoModalVisible}
    />



    <AlertaSimples 
      visible={toastVisible}
      message={mensagemToast}
      onClose={() => setToastVisible(false)}
    />

    <Navbar />
      
    </SafeAreaView>
    
  );
};

export default PaginaGrupo;