import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { criarNotifComentario } from "../notificacoes/CriarNotifComentario";

export interface Comentario {
  id: string;
  userId: string;
  instanceId: string;
  createdAt: string;
  content: string;
}

export const criarComentario = async (
  userId: string,
  instanceId: string,
  content: string
): Promise<void> => {
  const comentariosRef = collection(db, "Comentários");
  const comentarioRef = doc(comentariosRef);

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const createdAt = `${dd}/${mm}, ${hh}:${min}`;

  const comentario: Comentario = {
    id: comentarioRef.id,
    userId,
    instanceId,
    createdAt,
    content,
  };

  await setDoc(comentarioRef, comentario);

  // Criar notificação do tipo comentário
  await criarNotifComentario(userId, instanceId, `${dd}/${mm}`);

};