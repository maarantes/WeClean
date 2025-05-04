import { db } from "../shared/firebaseConfigApp";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { kickarIntegrante } from "./removerIntegrante";

export const excluirGrupo = async (grupoId: string) => {
  try {
    const grupoRef = doc(db, "Grupos", grupoId);
    const grupoSnap = await getDoc(grupoRef);

    if (!grupoSnap.exists()) {
      throw new Error("Grupo não encontrado");
    }

    const grupoData = grupoSnap.data();
    const integrantes = grupoData.integrantes || [];

    // Remove todos os integrantes (incluindo admin)
    for (const integrante of integrantes) {
      await kickarIntegrante(integrante.uid, grupoId);
    }

    // Exclui o grupo depois de remover todos
    await deleteDoc(grupoRef);

    console.log("Grupo excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir grupo:", error);
    throw error;
  }
};