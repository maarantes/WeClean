import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../shared/firebase";

export const buscarNotificacoesDoUsuario = async (userId: string) => {
  const q = query(
    collection(db, "Notificacoes"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
};
