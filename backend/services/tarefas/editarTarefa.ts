import { doc, updateDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { Tarefa } from "./types";
import { registrarTarefaNoCalendario } from "../calendario/registrarTarefaNoCalendario";
import { excluirInstanciasDaTarefa } from "./excluirInstanciasTarefa";
import { removerDocumentosVaziosNoCalendario } from "../calendario/removerDocumentosVazios";

// Atualiza a tarefa e recria as instâncias no calendário
export const editarTarefa = async (updatedTask: Tarefa, dataReferencia: string): Promise<void> => {
  if (!updatedTask.id) {
    console.error("ID da tarefa ausente.");
    return;
  }

  // 1. Atualizar a tarefa master (sem recriar)
  const tarefaRef = doc(db, "Tarefas", updatedTask.id);
  await updateDoc(tarefaRef, {
    ...updatedTask,
    id: updatedTask.id, // garante que o ID se mantenha
  });

  // 2. Remover instâncias antigas da tarefa
  await excluirInstanciasDaTarefa(updatedTask.id);

  // 3. Criar novas instâncias com os dados atualizados
  await registrarTarefaNoCalendario(updatedTask);

  // 4. Limpeza do calendário (caso tenha sobrado dias vazios)
  await removerDocumentosVaziosNoCalendario();
};