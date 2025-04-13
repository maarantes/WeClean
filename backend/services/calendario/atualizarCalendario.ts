import { collection, getDocs } from "firebase/firestore";
import { db } from "../shared/firebase";
import { getUltimoMesAtualizado, setUltimoMesAtualizado } from "../shared/ultimoMesAtualizado";
import { registrarTarefaNoCalendario } from "./registrarTarefaNoCalendario";
import { Tarefa } from "../tarefas/types";

export const atualizarCalendario = async (): Promise<void> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentMonthStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}`;

  const ultimoMesAtualizado = await getUltimoMesAtualizado();
  if (ultimoMesAtualizado === currentMonthStr) {
    return;
  }

  const tarefasSnapshot = await getDocs(collection(db, "Tarefas"));
  for (const tarefaDoc of tarefasSnapshot.docs) {
    const tarefa = tarefaDoc.data() as Tarefa;
    tarefa.id = tarefaDoc.id;
    await registrarTarefaNoCalendario(tarefa);
  }

  await setUltimoMesAtualizado(currentMonthStr);
};
