import { db } from "../shared/firebaseConfigApp";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { excluirTarefa } from "../tarefas/excluirTarefa";

export const apagarGrupoSozinho = async (grupoId: string): Promise<void> => {
  const grupoRef = doc(db, "Grupos", grupoId);
  const grupoSnap = await getDoc(grupoRef);
  if (!grupoSnap.exists()) return;

  const grupoData = grupoSnap.data();

  if (grupoData.integrantes.length === 1) {
    const tarefasRef = collection(db, "Tarefas");
    const q = query(tarefasRef, where("grupoId", "==", grupoId));
    const tarefasSnapshot = await getDocs(q);

    const deletarTarefasPromises = tarefasSnapshot.docs.map(async (docTarefa) => {
      await excluirTarefa(docTarefa.id);
    });

    await Promise.all(deletarTarefasPromises);

    await deleteDoc(grupoRef);
  }
}