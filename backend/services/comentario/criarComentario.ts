import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../shared/firebase";
import { criarNotifComentario } from "../notificacoes/CriarNotifComentario";

export interface Comentario {
  id: string;
  userId: string;
  instanceId: string;
  dataCriacao: Timestamp;
  content: string;
}

export const criarComentario = async (
  userId: string,
  instanceId: string,
  content: string
): Promise<void> => {
  const comentariosRef = collection(db, "Comentários");
  const comentarioRef = doc(comentariosRef);

  const dataCriacao = Timestamp.now();

  const comentario: Comentario = {
    id: comentarioRef.id,
    userId,
    instanceId,
    dataCriacao,
    content,
  };

  await setDoc(comentarioRef, comentario);

  // Criar notificação do tipo comentário
  await criarNotifComentario(userId, instanceId, dataCriacao);
};