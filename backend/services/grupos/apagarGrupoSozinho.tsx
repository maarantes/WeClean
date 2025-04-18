import { auth, db } from "../shared/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { excluirTarefa } from "../tarefas/excluirTarefa";

export const apagarGrupoSozinho = async (): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const grupoRef = doc(db, "Grupos", uid);
  const grupoSnap = await getDoc(grupoRef);

  if (!grupoSnap.exists()) return;

  const grupoData = grupoSnap.data();

  if (grupoData.integrantes.length === 1) {
    const tarefasRef = collection(db, "Tarefas");
    const q = query(tarefasRef, where("grupoId", "==", uid));
    const tarefasSnapshot = await getDocs(q);

    const deletarTarefasPromises = tarefasSnapshot.docs.map(async (docTarefa) => {
      await excluirTarefa(docTarefa.id); // usa o excluirTarefa que limpa Tarefas + Calendário
    });

    await Promise.all(deletarTarefasPromises);

    await deleteDoc(grupoRef); // Depois de limpar tudo, deleta o grupo
  }
}