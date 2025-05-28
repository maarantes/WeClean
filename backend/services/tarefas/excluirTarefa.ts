import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { auth } from "../shared/firebaseConfigApp";
import { criarNotificacaoExclusaoTarefa } from "../notificacoes/CriarNotifExclusaoTarefa";
import { excluirInstanciasDaTarefa } from "./excluirInstanciasTarefa";

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

  // Notificar integrantes (exceto quem deletou)
  if (destinatarios.length > 0) {
    await criarNotificacaoExclusaoTarefa(destinatarios, nomeTarefa);
  }

  // Remover todas as instâncias e seus comentários
  await excluirInstanciasDaTarefa(taskId);

  // Remover a tarefa master
  await deleteDoc(tarefaRef);
};
