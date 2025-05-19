import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "./styles";
import { RootStackParamList } from '@/frontend/routes';
import { sairDoGrupo } from '@/backend/services/grupos/SairGrupo';
import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { doc, getDoc } from "firebase/firestore";
import Badge from "../Badge";
import { getCoresDoTema } from "@/frontend/utils/temaStyles";

interface ModalSairGrupoProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onSuccess?: () => void; // Adicionando o onSuccess!
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">;

const ModalSairGrupo: React.FC<ModalSairGrupoProps> = ({ visible, setVisible, onSuccess }) => {
  const navigation = useNavigation<NavigationProps>();

  const [isAdmin, setIsAdmin] = useState(false);
  const [integrantes, setIntegrantes] = useState<any[]>([]);
  const [novoAdminUID, setNovoAdminUID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    if (visible) carregarDados();
  }, [visible]);

  const fecharModal = () => {
    setNovoAdminUID(null);
    setVisible(false);
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userSnap = await getDoc(doc(db, "Usuarios", uid));
      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const grupoId = userData.grupoId;
      const grupoSnap = await getDoc(doc(db, "Grupos", grupoId));
      if (!grupoSnap.exists()) return;

      const grupoData = grupoSnap.data();
      const lista = grupoData.integrantes || [];

      setIsAdmin(lista.find((i: any) => i.uid === uid && i.tipo === "admin") !== undefined);

      // Remove o próprio usuário da lista
      const outrosIntegrantes = lista.filter((i: any) => i.uid !== uid);
      const detalhes = await Promise.all(
        outrosIntegrantes.map(async (i: any) => {
          const u = await getDoc(doc(db, "Usuarios", i.uid));
          const data = u.data();
          const tema = data?.tema || "undefined";
          const { cor_primaria, cor_secundaria } = getCoresDoTema(tema);

          return {
            uid: i.uid,
            nome: data?.apelido || "Desconhecido",
            cor_primaria,
            cor_secundaria,
          };
        })
      );

      // Ordenar em ordem alfabética
      const detalhesOrdenados = detalhes.sort((a, b) => a.nome.localeCompare(b.nome));

      setIntegrantes(detalhesOrdenados);
      if (detalhesOrdenados.length > 0) {
        setNovoAdminUID(detalhesOrdenados[0].uid);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSairDoGrupo = async () => {
    try {
      setSaindo(true);
      await sairDoGrupo(novoAdminUID ?? undefined);
      setVisible(false);
      navigation.reset({ index: 0, routes: [{ name: "Grupo" }] });
    } catch (error) {
      console.error("Erro ao sair do grupo:", error);
    } finally {
      setSaindo(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      statusBarTranslucent={true}
      onBackdropPress={fecharModal}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      customBackdrop={
        <TouchableWithoutFeedback onPress={fecharModal}>
          <View style={{ backgroundColor: "#404040", ...Dimensions.get("screen") }} />
        </TouchableWithoutFeedback>
      }
    >
      <View style={styles.modal_container}>
        {loading ? (
          <ActivityIndicator size="large" color="#808080" />
        ) : isAdmin ? (
          <>
            <Text style={styles.modal_titulo}>Sair do Grupo</Text>
            <Text style={styles.modal_texto}>
              Antes de sair do grupo, escolha uma pessoa para ser o novo administrador.
            </Text>

            <View style={styles.lista_integrantes}>
              {integrantes.map((integrante) => (
                <Badge
                  key={integrante.uid}
                  text={integrante.nome}
                  isSelected={novoAdminUID === integrante.uid}
                  onPress={() => setNovoAdminUID(integrante.uid)}
                  clicavel
                  backgroundColor={
                    novoAdminUID === integrante.uid ? integrante.cor_primaria : "#D9D9D9"
                  }
                  iconColor={
                    novoAdminUID === integrante.uid ? integrante.cor_secundaria : "#8C8C8C"
                  }
                />
              ))}
            </View>

            <Text style={styles.selecionado}>
              Selecionado:{" "}
              <Text style={{ fontFamily: "Inter-SemiBold" }}>
                {integrantes.find((i) => i.uid === novoAdminUID)?.nome || "Nenhum"}
              </Text>
            </Text>

            <View style={styles.modal_botoes}>
              <TouchableOpacity
                style={[styles.modal_botao_sair, (!novoAdminUID) && { opacity: 0.5 }]}
                onPress={handleSairDoGrupo}
                disabled={!novoAdminUID || saindo}
              >
                {saindo ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modal_botao_sair_texto}>Confirmar e Sair</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modal_botao_cancelar}
                onPress={fecharModal}
              >
                <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.modal_titulo}>Deseja sair do grupo?</Text>
            <Text style={styles.modal_texto}>
              Você não fará mais parte deste grupo.
            </Text>

            <View style={styles.modal_botoes}>
              <TouchableOpacity
                style={styles.modal_botao_sair}
                onPress={handleSairDoGrupo}
                disabled={saindo}
              >
                {saindo ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modal_botao_sair_texto}>Sair</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modal_botao_cancelar}
                onPress={fecharModal}
              >
                <Text style={styles.modal_botao_cancelar_texto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default ModalSairGrupo;