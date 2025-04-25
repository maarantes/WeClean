import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { removerUsuarioDasTarefasDoGrupo } from "./removerUsuariosTarefas";

// novoAdminUid é opcional – só é necessário se o usuário for admin
export const sairDoGrupo = async (novoAdminUid?: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");

  const userRef = doc(db, "Usuarios", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("Usuário não encontrado.");

  const userData = userSnap.data();
  const grupoId = userData.grupoId;

  const grupoRef = doc(db, "Grupos", grupoId);
  const grupoSnap = await getDoc(grupoRef);
  if (!grupoSnap.exists()) throw new Error("Grupo não encontrado.");

  const grupoData = grupoSnap.data();
  const integrantes = grupoData.integrantes || [];

  // Verifica se o usuário atual é admin
  const souAdmin = integrantes.find((i: any) => i.uid === uid && i.tipo === "admin");

  if (souAdmin && novoAdminUid) {
    const novoAdminExiste = integrantes.some((i: any) => i.uid === novoAdminUid);
    if (!novoAdminExiste) {
      throw new Error("Novo admin selecionado não é integrante do grupo.");
    }

    // Atualiza o grupo: promove novo admin e remove o antigo
    const novosIntegrantes = integrantes.map((i: any) => {
      if (i.uid === novoAdminUid) return { ...i, tipo: "admin" };
      return i;
    }).filter((i: any) => i.uid !== uid);

    await updateDoc(grupoRef, {
      integrantes: novosIntegrantes,
    });

  } else {
    // Usuário comum: apenas remove do grupo
    const novosIntegrantes = integrantes.filter((i: any) => i.uid !== uid);
    await updateDoc(grupoRef, {
      integrantes: novosIntegrantes,
    });
  }

  // Remove da lista de tarefas do grupo
  await removerUsuarioDasTarefasDoGrupo(grupoId, uid);

  // Cria grupo pessoal (usando UID do usuário como ID)
  const grupoPessoalRef = doc(db, "Grupos", uid);
  await setDoc(grupoPessoalRef, {
    nome: "Grupo Pessoal",
    integrantes: [{ uid, tipo: "admin" }],
  });

  // Atualiza grupoId do usuário
  await updateDoc(userRef, {
    grupoId: uid,
  });
};