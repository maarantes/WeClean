import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLLECTION_NAME = "tarefas"; // Nome da coleção no Firestore

// Criar tarefa
export const criarTarefa = async (tarefa: any) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), tarefa);
    console.log("Tarefa adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
  }
};

// Listar todas as tarefas
export const listarTarefas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return [];
  }
};
