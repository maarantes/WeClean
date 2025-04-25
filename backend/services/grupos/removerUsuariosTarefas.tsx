import { collection, doc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/backend/services/shared/firebaseConfigApp";

export const removerUsuarioDasTarefasDoGrupo = async (grupoId: string, uid: string) => {

  // 1. Atualiza tarefas na coleção "Tarefas"
  const tarefasRef = collection(db, "Tarefas");
  const q = query(tarefasRef, where("grupoId", "==", grupoId));
  const tarefasSnap = await getDocs(q);

  for (const docSnap of tarefasSnap.docs) {
    const tarefa = docSnap.data();
    const integrantes = tarefa.integrantes || [];

    if (integrantes.includes(uid)) {
      const novosIntegrantes = integrantes.filter((id: string) => id !== uid);
      await updateDoc(doc(db, "Tarefas", docSnap.id), {
        integrantes: novosIntegrantes,
      });
    }
  }

  // 2. Atualiza instâncias na coleção "Calendário"
  const calendarioRef = collection(db, "Calendário");
  const diasSnap = await getDocs(calendarioRef);

  for (const dia of diasSnap.docs) {
    const data = dia.data();
    const tarefas = data.tarefas || [];

    let houveAlteracao = false;

    const tarefasAtualizadas = tarefas.map((tarefa: any) => {
      if (tarefa.grupoId === grupoId && Array.isArray(tarefa.integrantes)) {
        const novaLista = tarefa.integrantes.filter((id: string) => id !== uid);
        if (novaLista.length !== tarefa.integrantes.length) {
          houveAlteracao = true;
          return { ...tarefa, integrantes: novaLista };
        }
      }
      return tarefa;
    });

    if (houveAlteracao) {
      await updateDoc(doc(db, "Calendário", dia.id), {
        tarefas: tarefasAtualizadas,
      });
    }
  }
};