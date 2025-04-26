import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth } from "../shared/firebaseConfigApp";
import { db } from "../shared/firebase";
import { gerarCodigoConvite } from "../grupos/gerarCodigoConvite";

export const cadastrarUsuario = async (
  email: string,
  senha: string,
  apelido: string
) => {

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    senha
  );
  const uid = userCredential.user.uid;

  // Gera um novo grupo com auto-ID
  const gruposCol = collection(db, "Grupos");
  const grupoPessoalRef = doc(gruposCol);
  const grupoId = grupoPessoalRef.id;

  const codigoConvite = gerarCodigoConvite();

  // Cria o grupo pessoal
  await setDoc(grupoPessoalRef, {
    nome: "Grupo Pessoal",
    integrantes: [{ uid, tipo: "admin" }],
    codigo_convite: codigoConvite,
  });

  await setDoc(doc(db, "Usuarios", uid), {
    apelido,
    email,
    tema: "azul",
    grupoId,
  });

  return uid;
};

export const loginUsuario = async (email: string, senha: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  return userCredential.user.uid;
};