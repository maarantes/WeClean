import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../shared/firebase";

export interface Notificacao {
  id: string;
  userId: string;
  tipo:
    | "add_comentario"
    | "add_tarefa"
    | "removido_tarefa"
    | "editado_tarefa"
    | "excluido_tarefa"
    | "removido_grupo"
    | "excluido_grupo";
  nomeTarefa?: string;
  data?: string;
  nomeGrupo?: string;
  dataCriacao: Timestamp;
}

export const criarNotificacao = async (
  userId: string,
  tipo: Notificacao["tipo"],
  extras: Omit<Notificacao, "id" | "userId" | "tipo" | "dataCriacao"> = {},
  dataCriacao?: Timestamp // <- ADICIONE ISSO COMO OPCIONAL
): Promise<void> => {
  const notificacoesRef = collection(db, "Notificacoes");
  const novaNotificacaoRef = doc(notificacoesRef);

  const novaNotificacao: Notificacao = {
    id: novaNotificacaoRef.id,
    userId,
    tipo,
    dataCriacao: dataCriacao ?? Timestamp.now(),
    ...extras,
  };

  await setDoc(novaNotificacaoRef, novaNotificacao);
};
