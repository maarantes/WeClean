import { collection, doc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../shared/firebase";

export const excluirTarefa = async (taskId: string): Promise<void> => {

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

  const comentariosCol = collection(db, "Comentários");
  for (const instanceId of instanceIdsToDelete) {
    const q = query(comentariosCol, where("instanceId", "==", instanceId));
    const commentsSnap = await getDocs(q);
    for (const commentDoc of commentsSnap.docs) {
      await deleteDoc(doc(db, "Comentários", commentDoc.id));
    }
  }

  await deleteDoc(doc(db, "Tarefas", taskId));
};