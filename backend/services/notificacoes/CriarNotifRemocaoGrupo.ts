import { doc, getDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoRemocaoGrupo = async (
  uidIntegrante: string,
  grupoId: string
): Promise<void> => {
  try {
    const grupoRef = doc(db, "Grupos", grupoId);
    const grupoSnap = await getDoc(grupoRef);

    const nomeGrupo =
      grupoSnap.exists() && grupoSnap.data().nome
        ? grupoSnap.data().nome
        : "Grupo removido";

    await criarNotificacao(uidIntegrante, "removido_grupo", {
      nomeGrupo,
    });
  } catch (error) {
    console.error("Erro ao criar notificação de remoção do grupo:", error);
  }
};
