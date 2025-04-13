import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { Tarefa } from "./types";
import { registrarTarefaNoCalendario } from "../calendario/registrarTarefaNoCalendario";

// Função para criar uma tarefa:
// 1. Registra a tarefa na coleção "Tarefas".
// 2. Registra as ocorrências da tarefa na coleção "Calendário" para o mês atual.

export const criarTarefa = async (tarefa: Tarefa): Promise<void> => {
  const tarefaRef = doc(collection(db, "Tarefas"));
  const tarefaComId: Tarefa = { ...tarefa, id: tarefaRef.id };
  await setDoc(tarefaRef, tarefaComId);

  // Registra imediatamente as ocorrências para o mês atual
  await registrarTarefaNoCalendario(tarefaComId);
};