import { db } from "../shared/firebaseConfigApp";
import { collection, getDocs, updateDoc, doc, writeBatch, arrayRemove, setDoc } from "firebase/firestore";
import { gerarCodigoConvite } from "./gerarCodigoConvite";
import { criarNotificacaoRemocaoGrupo } from "../notificacoes/CriarNotifRemocaoGrupo";

export const kickarIntegrante = async (uidIntegrante: string, grupoIdAtual: string, notificar: boolean = true) => {
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

    // 3. Remover do Calendário (somente datas futuras)
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
    const codigoConvite = await gerarCodigoConvite();

    const novoGrupoRef = doc(collection(db, "Grupos"));
    const criarNovoGrupo = setDoc(novoGrupoRef, {
      nome: "Grupo Pessoal",
      codigo_convite: codigoConvite,
      integrantes: [{ uid: uidIntegrante, tipo: "admin" }],
    });

    // 5. Atualizar GrupoID do usuário
    const userRef = doc(db, "Usuarios", uidIntegrante);
    const atualizarUsuario = updateDoc(userRef, {
      grupoId: novoGrupoRef.id,
    });

    // 6. Mandar notificação que o usuário foi removido do grupo
    // Obs. Apenas se "notificar" for true (no ExcluirGrupo ele é false)
    if (notificar) {
      await criarNotificacaoRemocaoGrupo(uidIntegrante, grupoIdAtual);
    }

    await Promise.all([
      commitTarefas,
      commitCalendario,
      criarNovoGrupo,
      atualizarUsuario,
      removerDoGrupo
    ]);

    console.log("Integrante kickado!");
  } catch (error) {
    console.error("Erro ao kickar integrante:", error);
    throw error;
  }
};