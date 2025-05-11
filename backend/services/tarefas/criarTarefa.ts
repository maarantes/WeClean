import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { Tarefa } from "./types";
import { registrarTarefaNoCalendario } from "../calendario/registrarTarefaNoCalendario";

export const criarTarefa = async (tarefa: Tarefa): Promise<void> => {
  const tarefaRef = doc(collection(db, "Tarefas"));
  const tarefaComId: Tarefa = {
    ...tarefa,
    id: tarefaRef.id
  };

  await setDoc(tarefaRef, tarefaComId);

  await registrarTarefaNoCalendario(tarefaComId);
};
