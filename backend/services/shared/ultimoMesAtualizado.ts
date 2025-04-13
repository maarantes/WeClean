import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getUltimoMesAtualizado = async () => {
  const configRef = doc(db, "Config", "UltimoMesAtualizado");
  const docSnap = await getDoc(configRef);

  return docSnap.exists() ? docSnap.data().mes : null;
};

export const setUltimoMesAtualizado = async (mes: string) => {
  const configRef = doc(db, "Config", "UltimoMesAtualizado");
  await setDoc(configRef, { mes }, { merge: true });
};