import { db } from "../shared/firebaseConfig";
import { collection, getDocs, updateDoc, doc, writeBatch, arrayRemove, setDoc } from "firebase/firestore";

export const kickarIntegrante = async (uidIntegrante: string, grupoIdAtual: string) => {
  try {
    const grupoRef = doc(db, "Grupos", grupoIdAtual);

    // 1. Remover da lista de integrantes do grupo
    const removerDoGrupo = updateDoc(grupoRef, {
      integrantes: arrayRemove({ uid: uidIntegrante, tipo: "normal" }),
    });

    // 2. Remover das TAREFAS
    const tarefasSnapshot = await getDocs(collection(db, "Tarefas"));
    const batchTarefas = writeBatch(db);

    tarefasSnapshot.forEach((docTarefa) => {
      const tarefa = docTarefa.data();
      if (tarefa.integrantes?.includes(uidIntegrante)) {
        const novaLista = tarefa.integrantes.filter((id: string) => id !== uidIntegrante);
        if (novaLista.length !== tarefa.integrantes.length) {
          const tarefaRef = doc(db, "Tarefas", docTarefa.id);
          batchTarefas.update(tarefaRef, { integrantes: novaLista });
        }
      }
    });

    const commitTarefas = batchTarefas.commit();

    // 3. Remover do CALENDÁRIO (somente datas futuras)
    const calendarioSnapshot = await getDocs(collection(db, "Calendário"));
    const batchCalendario = writeBatch(db);

    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    calendarioSnapshot.forEach((docDia) => {
      const dataDia = docDia.id;
      if (dataDia >= hojeStr) {
        const diaData = docDia.data();
        let precisaAtualizar = false;

        const tarefasAtualizadas = diaData.tarefas?.map((tarefa: any) => {
          if (tarefa.integrantes?.includes(uidIntegrante)) {
            precisaAtualizar = true;
            return {
              ...tarefa,
              integrantes: tarefa.integrantes.filter((id: string) => id !== uidIntegrante),
            };
          }
          return tarefa;
        });

        if (precisaAtualizar) {
          const diaRef = doc(db, "Calendário", docDia.id);
          batchCalendario.update(diaRef, { tarefas: tarefasAtualizadas });
        }
      }
    });

    const commitCalendario = batchCalendario.commit();

    // 4. Criar novo grupo pessoal
    const novoGrupoRef = doc(collection(db, "Grupos"));
    const criarNovoGrupo = setDoc(novoGrupoRef, {
      nome: "Grupo Pessoal",
      codigo_convite: Math.random().toString(36).substring(2, 8).toUpperCase(),
      integrantes: [{ uid: uidIntegrante, tipo: "admin" }],
    });

    // 5. Atualizar GrupoID do usuário
    const userRef = doc(db, "Usuarios", uidIntegrante);
    const atualizarUsuario = updateDoc(userRef, {
      grupoId: novoGrupoRef.id,
    });

    await Promise.all([
      commitTarefas,
      commitCalendario,
      criarNovoGrupo,
      atualizarUsuario,
      removerDoGrupo
    ]);

    console.log("Integrante kickado, tarefas/calendário atualizados e novo grupo criado!");
  } catch (error) {
    console.error("rro ao kickar integrante:", error);
    throw error;
  }
};