import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../shared/firebaseConfig";
import { db } from "../shared/firebase";

export const cadastrarUsuario = async (email: string, senha: string, apelido: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = userCredential.user.uid;

    // 1. Criar documento do usuário
    await setDoc(doc(db, "Usuarios", uid), {
        apelido,
        email,
        tema: "azul",
    });

    // 2. Criar grupo pessoal
    await setDoc(doc(db, "Grupos", uid), {
        nome: "Grupo Pessoal",
        integrantes: [
          {
            uid,
            tipo: "admin"
          }
        ]
      });
      

  return uid;
};

export const loginUsuario = async (email: string, senha: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  return userCredential.user.uid;
};
