import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Clipboard } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

import { auth, db } from "../../../backend/services/shared/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import CopiarIcon from "../../../assets/images/copiar.svg";
import ConcluirIcon from "../../../assets/images/concluir.svg";

interface ConvidarModalProps {
  ConvidarModalActive: boolean;
  setConvidarModalActive: (visible: boolean) => void;
}

const ConvidarModal: React.FC<ConvidarModalProps> = ({
  ConvidarModalActive,
  setConvidarModalActive,
}) => {
  const [codigoConvite, setCodigoConvite] = useState("");
  const [copiado, setCopiado] = useState(false); // <- Novo estado!

  useEffect(() => {
    if (ConvidarModalActive) {
      carregarCodigoConvite();
      setCopiado(false); // resetar quando abrir modal de novo
    }
  }, [ConvidarModalActive]);

  const carregarCodigoConvite = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const grupoRef = doc(db, "Grupos", uid);
      const grupoSnap = await getDoc(grupoRef);

      if (grupoSnap.exists()) {
        const grupoData = grupoSnap.data();
        setCodigoConvite(grupoData.codigo_convite || "------");
      } else {
        console.log("Grupo não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar código de convite:", error);
    }
  };

  const copiarCodigo = async () => {
    await Clipboard.setString(codigoConvite);
    setCopiado(true);
  };

  return (
    <Modal
      isVisible={ConvidarModalActive}
      onBackdropPress={() => setConvidarModalActive(false)}
      backdropColor="#404040"
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modal_container}>
        <Text style={styles.modal_titulo}>Código de Convite</Text>
        <Text style={styles.modal_texto}>
          Compartilhe este código para alguém entrar no seu grupo:
        </Text>

        <View style={styles.modal_codigo_container}>
          <Text style={styles.modal_codigo_texto}>
            {codigoConvite}
          </Text>
        </View>

        <View style={styles.modal_botoes}>
          <TouchableOpacity
            style={styles.modal_botao_sair}
            onPress={copiarCodigo}
          >
            {copiado ? (
              <ConcluirIcon width={16} height={16} color={"#FFFFFF"} />
            ) : (
              <CopiarIcon width={20} height={20} color={"#FFFFFF"} />
            )}
            <Text style={styles.modal_botao_sair_texto}>
              {copiado ? "Copiado!" : "Copiar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modal_botao_cancelar}
            onPress={() => setConvidarModalActive(false)}
          >
            <Text style={styles.modal_botao_cancelar_texto}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConvidarModal;