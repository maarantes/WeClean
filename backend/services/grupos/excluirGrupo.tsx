import { auth, db } from "../shared/firebaseConfigApp";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { kickarIntegrante } from "./removerIntegrante";
import { criarNotificacaoExclusaoGrupo } from "../notificacoes/CriarNotifExclusaoGrupo";

export const excluirGrupo = async (grupoId: string) => {
  try {
    const grupoRef = doc(db, "Grupos", grupoId);
    const grupoSnap = await getDoc(grupoRef);

    if (!grupoSnap.exists()) {
      throw new Error("Grupo não encontrado");
    }

    const grupoData = grupoSnap.data();
    const integrantes = grupoData.integrantes || [];
    const nomeGrupo = grupoData.nome || "Grupo";

    const uidAdmin = auth.currentUser?.uid;

    // Remove todos os integrantes (incluindo admin)
    for (const integrante of integrantes) {
      await kickarIntegrante(integrante.uid, grupoId, false);
    }

    // Listar usuários para mandar a notificação, exceto para quem excluiu
    const uidsParaNotificar = integrantes
      .filter((i: any) => i.uid !== uidAdmin)
      .map((i: any) => i.uid);

    // Mandar notificação
    if (uidsParaNotificar.length > 0) {
      await criarNotificacaoExclusaoGrupo(uidsParaNotificar, nomeGrupo);
    }

    // Exclui o grupo
    await deleteDoc(grupoRef);

    console.log("Grupo excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir grupo:", error);
    throw error;
  }
};
