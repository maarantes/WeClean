import { updateDoc, doc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { auth, db } from "../shared/firebaseConfigApp";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const atualizarInfoUsuario = async (tipo: "apelido" | "email", novoValor: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const userRef = doc(db, "Usuarios", user.uid);

  try {
    if (tipo === "apelido") {
      // Atualiza apelido no Firestore
      await updateDoc(userRef, { apelido: novoValor });
      // Atualiza apelido no cache
      await AsyncStorage.setItem('@userNome', novoValor);
    } else if (tipo === "email") {
      // Atualiza email no Authentication
      await updateEmail(user, novoValor);
      // Atualiza email no Firestore
      await updateDoc(userRef, { email: novoValor });
      // Atualiza email no cache
      await AsyncStorage.setItem('@userEmail', novoValor);
    }
  } catch (error) {
    console.error("Erro ao atualizar informação do usuário:", error);
    throw error;
  }
};