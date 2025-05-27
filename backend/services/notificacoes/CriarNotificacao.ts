import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../shared/firebase";

export interface Notificacao {
  id: string;
  userId: string;
  tipo: "add_comentario" | "add_tarefa" | "removido_tarefa" | "editado_tarefa" | "removido_grupo" | "excluido_grupo";
  nomeTarefa?: string;
  data?: string;
  nomeGrupo?: string;
  createdAt: string;
}

export const criarNotificacao = async (
  userId: string,
  tipo: Notificacao["tipo"],
  extras: Omit<Notificacao, "id" | "userId" | "tipo" | "createdAt"> = {}
): Promise<void> => {
  const notificacoesRef = collection(db, "Notificacoes");
  const novaNotificacaoRef = doc(notificacoesRef);

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const createdAt = `${dd}/${mm}, ${hh}h${min}`;

  const novaNotificacao: Notificacao = {
    id: novaNotificacaoRef.id,
    userId,
    tipo,
    createdAt,
    ...extras,
  };

  await setDoc(novaNotificacaoRef, novaNotificacao);
};
