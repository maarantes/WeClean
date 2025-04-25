import { auth, db } from "../shared/firebaseConfigApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const renomearGrupo = async (novoNome: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");

  const userRef = doc(db, "Usuarios", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("Usuário não encontrado.");

  const userData = userSnap.data();
  const grupoId = userData.grupoId || uid;

  const grupoRef = doc(db, "Grupos", grupoId);
  await updateDoc(grupoRef, {
    nome: novoNome,
  });
};
