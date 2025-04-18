import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../shared/firebaseConfig";
import { db } from "../shared/firebase";
import { gerarCodigoConvite } from "../grupos/gerarCodigoConvite";

export const cadastrarUsuario = async (email: string, senha: string, apelido: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "Usuarios", uid), {
    apelido,
    email,
    tema: "azul",
    grupoId: uid,
  });

  const codigoConvite = await gerarCodigoConvite();

  await setDoc(doc(db, "Grupos", uid), {
    nome: "Grupo Pessoal",
    integrantes: [
      {
        uid,
        tipo: "admin"
      }
    ],
    codigo_convite: codigoConvite,
  }, { merge: true });

  return uid;
};

export const loginUsuario = async (email: string, senha: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  return userCredential.user.uid;
};