
import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";
import { removerUsuarioDasTarefasDoGrupo } from "./removerUsuariosTarefas";

// Gera um código de convite aleatório de 6 dígitos
const gerarCodigoConvite = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sairDoGrupo = async (novoAdminUid?: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado.");

  // 1) Pega dados do usuário atual
  const userRef = doc(db, "Usuarios", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("Usuário não encontrado.");
  const { grupoId } = userSnap.data();

  // 2) Pega o grupo atual
  const grupoRef = doc(db, "Grupos", grupoId);
  const grupoSnap = await getDoc(grupoRef);
  if (!grupoSnap.exists()) throw new Error("Grupo não encontrado.");
  const integrantes: { uid: string; tipo: string }[] =
    grupoSnap.data().integrantes || [];

  // 3) Verifica se é admin
  const souAdmin = integrantes.some((i) => i.uid === uid && i.tipo === "admin");

  // 4) Se for admin e forneceu novoAdminUid, promove e remove o antigo
  if (souAdmin && novoAdminUid) {
    if (!integrantes.some((i) => i.uid === novoAdminUid)) {
      throw new Error("Novo admin não faz parte do grupo.");
    }
    const atualizados = integrantes
      .map((i) =>
        i.uid === novoAdminUid ? { ...i, tipo: "admin" } : i
      )
      .filter((i) => i.uid !== uid);
    await updateDoc(grupoRef, { integrantes: atualizados });

  } else {
    // 5) Caso contrário (não admin), só remove o usuário
    const restantes = integrantes.filter((i) => i.uid !== uid);
    await updateDoc(grupoRef, { integrantes: restantes });
  }

  // 6) Remove das tarefas do grupo (coleções Tarefas e Calendário)
  await removerUsuarioDasTarefasDoGrupo(grupoId, uid);

  // 7) Cria novo grupo pessoal com auto ID
  const gruposCol = collection(db, "Grupos");
  const pessoalRef = doc(gruposCol); 
  const pessoalId = pessoalRef.id;
  await setDoc(pessoalRef, {
    nome: "Grupo Pessoal",
    codigo_convite: gerarCodigoConvite(),
    integrantes: [{ uid, tipo: "admin" }],
  });

  // 8) Atualiza o campo GrupoID do usuário para apontar ao novo grupo pessoal
  await updateDoc(userRef, {
    grupoId: pessoalId,
  });
};