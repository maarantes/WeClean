import { collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../shared/firebase";
import { criarNotificacao } from "./CriarNotificacao";

export const criarNotifComentario = async (
  userId: string,
  instanceId: string,
  dataCriacao: Timestamp
): Promise<void> => {
  const calendarioSnap = await getDocs(collection(db, "Calendário"));
  let instanciaEncontrada: any = null;

  for (const docSnap of calendarioSnap.docs) {
    const tarefas: any[] = docSnap.data().tarefas || [];
    const encontrada = tarefas.find((t) => t.instanceId === instanceId);

    if (encontrada) {
      instanciaEncontrada = encontrada;
      break;
    }
  }

  if (!instanciaEncontrada) {
    console.warn("Instância de tarefa não encontrada em nenhum dia do calendário.");
    return;
  }

  const tarefaId = instanciaEncontrada.originalId;
  const nomeTarefa = instanciaEncontrada.nome || "Tarefa sem nome";

  if (!tarefaId) {
    console.warn("ID da tarefa master não encontrado na instância.");
    return;
  }

  const tarefaRef = doc(db, "Tarefas", tarefaId);
  const tarefaSnap = await getDoc(tarefaRef);

  if (!tarefaSnap.exists()) {
    console.warn("Tarefa master não encontrada.");
    return;
  }

  const tarefaData = tarefaSnap.data();
  const integrantes: string[] = tarefaData.integrantes || [];

  const destinatarios = integrantes.filter((uid) => uid !== userId);

  const notificacoes = destinatarios.map((destinatarioId) =>
    criarNotificacao(destinatarioId, "add_comentario", {
      nomeTarefa,
      }, dataCriacao)
  );

  await Promise.all(notificacoes);
};
