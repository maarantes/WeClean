import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../shared/firebase";

// Atualiza o campo "concluido" de uma tarefa no documento do Calendário referente à data
export const updateTarefaConcluido = async (
  id: string, 
  data: string, // data no formato "YYYY-MM-DD" do documento Calendário a ser atualizado
  novoValor: boolean
): Promise<void> => {
  // Atualiza somente o documento Calendário identificado pela data
  const calendarRef = doc(db, "Calendário", data);
  const docSnapshot = await getDoc(calendarRef);
  if (docSnapshot.exists()) {
    const dataDoc = docSnapshot.data();
    if (dataDoc.tarefas) {
      const updatedTasks = dataDoc.tarefas.map((task: any) => {
        if (task.id === id) {
          return { ...task, concluido: novoValor };
        }
        return task;
      });
      await updateDoc(calendarRef, { tarefas: updatedTasks });
    }
  }
};
