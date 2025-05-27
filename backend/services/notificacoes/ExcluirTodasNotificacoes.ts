import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../shared/firebase";

export const excluirTodasNotificacoes = async (userId: string): Promise<void> => {
  try {
    const notificacoesRef = collection(db, "Notificacoes");
    const q = query(notificacoesRef, where("userId", "==", userId));
    const snap = await getDocs(q);

    const deletarTodas = snap.docs.map((docSnap) =>
      deleteDoc(doc(notificacoesRef, docSnap.id))
    );

    await Promise.all(deletarTodas);
  } catch (error) {
    console.error("Erro ao excluir notificações:", error);
  }
};
