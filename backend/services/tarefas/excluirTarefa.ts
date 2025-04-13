import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../shared/firebase";

// Exclui a tarefa tanto da coleção "Tarefas" quanto do "Calendário"
export const excluirTarefa = async (taskId: string): Promise<void> => {
  // Exclui todas as instâncias (passadas, atuais e futuras) na coleção "Calendário"
  const calendarRef = collection(db, "Calendário");
  const querySnapshot = await getDocs(calendarRef);
  for (const docSnapshot of querySnapshot.docs) {
    const dataDoc = docSnapshot.data();
    if (dataDoc.tarefas) {
      const updatedTasks = dataDoc.tarefas.filter((task: any) => task.id !== taskId);
      await updateDoc(doc(db, "Calendário", docSnapshot.id), { tarefas: updatedTasks });
    }
  }

  // Exclui a tarefa na coleção "Tarefas"
  const tarefaRef = doc(db, "Tarefas", taskId);
  await deleteDoc(tarefaRef);
};
