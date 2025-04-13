import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../shared/firebase";

export const removerDocumentosVaziosNoCalendario = async (): Promise<void> => {
  const calendarioRef = collection(db, "Calendário");
  const querySnapshot = await getDocs(calendarioRef);
  
  for (const docSnapshot of querySnapshot.docs) {
    const dataDoc = docSnapshot.data();
    if (!dataDoc.tarefas || dataDoc.tarefas.length === 0) {
      await deleteDoc(doc(db, "Calendário", docSnapshot.id));
    }
  }
};
