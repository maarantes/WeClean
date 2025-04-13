import { collection, getDocs } from "firebase/firestore";
import { db } from "../shared/firebase";
import { Tarefa } from "./types";

// Retorna todas as tarefas cadastradas na coleção "Tarefas"
export const obterTarefas = async (): Promise<Tarefa[]> => {
  const tarefasCollection = collection(db, "Tarefas");
  const querySnapshot = await getDocs(tarefasCollection);
  const tarefas: Tarefa[] = [];

  querySnapshot.forEach((docSnapshot) => {
    tarefas.push({ id: docSnapshot.id, ...docSnapshot.data() } as Tarefa);
  });

  return tarefas;
};
