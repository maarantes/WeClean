import { Tarefa } from "./types";
import { excluirTarefa } from "./excluirTarefa";
import { criarTarefa } from "./criarTarefa";
import { removerDocumentosVaziosNoCalendario } from "../calendario/removerDocumentosVazios";

// Edita a tarefa recriando com os dados novos e limpando calendário vazio
export const editarTarefa = async (updatedTask: Tarefa, dataReferencia: string): Promise<void> => {
  // 1. Exclui a tarefa antiga (documento em "Tarefas" e ocorrências no "Calendário")
  await excluirTarefa(updatedTask.id!);
  
  // 2. Remove o id para que a nova tarefa receba um novo identificador
  const { id, ...novaTarefa } = updatedTask;
  
  // 3. Cria a nova tarefa com as informações atualizadas e exclui os dias sem nenhuma tarefa na coleção Calendário
  await criarTarefa(novaTarefa as Tarefa);
  await removerDocumentosVaziosNoCalendario();
};
