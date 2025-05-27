import { collection, doc, getDocs, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { auth } from "../shared/firebaseConfigApp";
import { criarNotificacaoExclusaoTarefa } from "../notificacoes/CriarNotifExclusaoTarefa";

export const excluirTarefa = async (taskId: string): Promise<void> => {
  const tarefaRef = doc(db, "Tarefas", taskId);
  const tarefaSnap = await getDoc(tarefaRef);

  if (!tarefaSnap.exists()) {
    console.warn("Tarefa não encontrada.");
    return;
  }

  const tarefaData = tarefaSnap.data();
  const nomeTarefa = tarefaData.nome || "Tarefa";
  const integrantes: string[] = tarefaData.integrantes || [];

  const uid = auth.currentUser?.uid;
  const destinatarios = integrantes.filter((id) => id !== uid);

  if (destinatarios.length > 0) {
    await criarNotificacaoExclusaoTarefa(destinatarios, nomeTarefa);
  }

  // Remoção das instâncias do calendário
  const calendarioCol = collection(db, "Calendário");
  const calendarioSnap = await getDocs(calendarioCol);

  const instanceIdsToDelete: string[] = [];

  for (const calDoc of calendarioSnap.docs) {
    const data = calDoc.data();
    const tarefas: any[] = data.tarefas || [];

    const remaining = tarefas.filter((t) => {
      if (t.originalId === taskId) {
        instanceIdsToDelete.push(t.instanceId);
        return false;
      }
      return true;
    });

    if (remaining.length !== tarefas.length) {
      const calRef = doc(db, "Calendário", calDoc.id);
      await updateDoc(calRef, { tarefas: remaining });
    }
  }

  // Remover comentários relacionados às instâncias
  const comentariosCol = collection(db, "Comentários");
  for (const instanceId of instanceIdsToDelete) {
    const q = query(comentariosCol, where("instanceId", "==", instanceId));
    const commentsSnap = await getDocs(q);
    for (const commentDoc of commentsSnap.docs) {
      await deleteDoc(doc(db, "Comentários", commentDoc.id));
    }
  }

  // Finalmente, remover a tarefa master
  await deleteDoc(tarefaRef);
};