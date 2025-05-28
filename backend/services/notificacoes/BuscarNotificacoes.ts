import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../shared/firebase";

export const buscarNotificacoes = async (userId: string) => {
  const notificacoesRef = collection(db, "Notificacoes");
  const q = query(
    notificacoesRef,
    where("userId", "==", userId),
    orderBy("dataCriacao", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
};
