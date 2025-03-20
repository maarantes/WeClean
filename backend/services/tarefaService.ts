import {collection, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, where, query, documentId, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getUltimoMesAtualizado, setUltimoMesAtualizado } from "../ultimoMesAtualizado"

export interface Frequencia {
  tipo: "diariamente" | "semanal" | "intervalo" | "anualmente";
  diasSemana?: number[] | null;
  intervaloDias?: number | null;
  datasEspecificas?: string[] | null;
}

export interface Tarefa {
  id?: string;
  nome: string;
  descricao?: string | null;
  horario: string;
  alarme: boolean;
  integrantes: string[];
  frequencia: Frequencia;
  dataCriacao: string;
  concluido?: boolean;
}

// Formata a data local no padrão "YYYY-MM-DD"

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};




// Função para criar uma tarefa:
// 1. Registra a tarefa na coleção "Tarefas".
// 2. Registra as ocorrências da tarefa na coleção "Calendário" para o mês atual.

export const criarTarefa = async (tarefa: Tarefa): Promise<void> => {
  const tarefaRef = doc(collection(db, "Tarefas"));
  const tarefaComId: Tarefa = { ...tarefa, id: tarefaRef.id };
  await setDoc(tarefaRef, tarefaComId);

  // Registra imediatamente as ocorrências para o mês atual
  await registrarTarefaNoCalendario(tarefaComId);
};



// Função para registrar uma tarefa na coleção "Calendário" para o mês atual.
// Calcula as datas de ocorrência com base na frequência e nas regras:
// 
// Diariamente: Em todos os dias do mês a partir do dia de criação (ou do dia 1 se criado em mês anterior).
// Semanalmente: Em cada dia que corresponda aos dias da semana selecionados,
// iniciando no dia de criação se este mês; se a tarefa já era cadastrada, inicia do dia 1.
// Intervalo: Inicia na data de criação e repete a cada X dias; se a tarefa foi criada em mês anterior,
// calcula a próxima ocorrência respeitando o intervalo.
// Anualmente: Para cada data específica (formato "DD/MM") que pertença ao mês atual,
// registra se estiver de acordo com o dia de criação.

export const registrarTarefaNoCalendario = async (tarefa: Tarefa): Promise<void> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexado (0 = janeiro)
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Converte tarefa.dataCriacao (no formato "YYYY-MM-DD") para data local
  const [year, month, day] = tarefa.dataCriacao.split("-").map(Number);
  const creationDate = new Date(year, month - 1, day);

  let occurrenceDates: Date[] = [];

  switch (tarefa.frequencia.tipo) {
    case "diariamente": {
      // Se a tarefa foi criada neste mês, inicia a partir do dia da criação; caso contrário, inicia no dia 1.
      const startDay =
        creationDate.getFullYear() === currentYear &&
        creationDate.getMonth() === currentMonth
          ? creationDate.getDate()
          : 1;
      for (let d = startDay; d <= lastDay.getDate(); d++) {
        occurrenceDates.push(new Date(currentYear, currentMonth, d));
      }
      break;
    }
    case "semanal": {
      const diasSemana: number[] = tarefa.frequencia.diasSemana || [];
      const startDay =
        creationDate.getFullYear() === currentYear &&
        creationDate.getMonth() === currentMonth
          ? creationDate.getDate()
          : 1;
      for (let d = startDay; d <= lastDay.getDate(); d++) {
        const date = new Date(currentYear, currentMonth, d);
        if (diasSemana.includes(date.getDay())) {
          occurrenceDates.push(date);
        }
      }
      break;
    }
    case "intervalo": {
      const intervaloDias = tarefa.frequencia.intervaloDias || 1;
      let occurrence: Date;
      if (
        creationDate.getFullYear() === currentYear &&
        creationDate.getMonth() === currentMonth
      ) {
        occurrence = new Date(creationDate);
      } else {
        occurrence = new Date(creationDate);
        while (occurrence < firstDay) {
          occurrence.setDate(occurrence.getDate() + intervaloDias);
        }
      }
      while (
        occurrence.getMonth() === currentMonth &&
        occurrence <= lastDay
      ) {
        occurrenceDates.push(new Date(occurrence));
        occurrence.setDate(occurrence.getDate() + intervaloDias);
      }
      break;
    }
    case "anualmente": {
      const datasEspecificas: string[] = tarefa.frequencia.datasEspecificas || [];
      datasEspecificas.forEach((dataStr) => {
        const [diaStr, mesStr] = dataStr.split("/");
        const dia = parseInt(diaStr, 10);
        const mes = parseInt(mesStr, 10) - 1; // meses são 0-indexados
        if (mes === currentMonth) {
          if (
            creationDate.getFullYear() === currentYear &&
            creationDate.getMonth() === currentMonth &&
            dia < creationDate.getDate()
          ) {
            return;
          }
          occurrenceDates.push(new Date(currentYear, currentMonth, dia));
        }
      });
      break;
    }
    default:
      break;
  }

  // Para cada data de ocorrência, atualiza (ou cria) o documento correspondente em "Calendário".
  for (const date of occurrenceDates) {
    const localDateStr = formatLocalDate(date);
    const calendarRef = doc(db, "Calendário", localDateStr);
    const tarefaEntry = {
      id: tarefa.id,
      nome: tarefa.nome,
      descricao: tarefa.descricao,
      horario: tarefa.horario,
      alarme: tarefa.alarme,
      frequencia: tarefa.frequencia,
      dataCriacao: tarefa.dataCriacao,
      integrantes: tarefa.integrantes,
      concluido: tarefa.concluido ?? false
    };

    try {
      await updateDoc(calendarRef, {
        tarefas: arrayUnion(tarefaEntry)
      });
    } catch (error) {
      // Se o documento não existir, cria-o com o array inicial
      await setDoc(calendarRef, {
        tarefas: [tarefaEntry]
      });
    }
  }
};



// Função para atualizar o Calendário para o mês atual:
// Verifica se o mês atual já foi processado (usando getUltimoMesAtualizado).
// Se não, percorre todas as tarefas da coleção "Tarefas" e registra as ocorrências
// para o mês atual conforme as regras de frequência.
// Ao final, marca o mês atual como atualizado (com setUltimoMesAtualizado).

export const atualizarCalendario = async (): Promise<void> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexado
  const currentMonthStr = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, "0")}`;

  // Verifica se o mês atual já foi atualizado
  const ultimoMesAtualizado = await getUltimoMesAtualizado();
  if (ultimoMesAtualizado === currentMonthStr) {
    return; // Calendário já atualizado para este mês
  }

  // Recupera todas as tarefas cadastradas
  const tarefasSnapshot = await getDocs(collection(db, "Tarefas"));
  for (const tarefaDoc of tarefasSnapshot.docs) {
    const tarefa = tarefaDoc.data() as Tarefa;
    tarefa.id = tarefaDoc.id;
    await registrarTarefaNoCalendario(tarefa);
  }

  // Atualiza a configuração para marcar o mês atual como atualizado
  await setUltimoMesAtualizado(currentMonthStr);
};



//Retorna as tarefas cadastradas na coleção "Calendário" para a semana atual (de domingo a sábado).

export const obterTarefasCalendario = async (): Promise<Record<string, any[]>> => {
  // Data atual (horário local)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = domingo, 6 = sábado

  // Calcula o domingo (início da semana) e sábado (final da semana)
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - dayOfWeek);
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + (6 - dayOfWeek));

  const startStr = formatLocalDate(startDate);
  const endStr = formatLocalDate(endDate);

  // Consulta na coleção "Calendário" usando o documentId para filtrar os documentos entre startStr e endStr
  const calendarRef = collection(db, "Calendário");
  const q = query(
    calendarRef,
    where(documentId(), ">=", startStr),
    where(documentId(), "<=", endStr)
  );

  const querySnapshot = await getDocs(q);
  const result: Record<string, any[]> = {};

  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    // Garante que cada data tenha um array de tarefas (mesmo que vazio)
    result[docSnapshot.id] = data.tarefas || [];
  });

  return result;
};

export const obterTarefas = async (): Promise<Tarefa[]> => {
  const tarefasCollection = collection(db, "Tarefas");
  const querySnapshot = await getDocs(tarefasCollection);
  const tarefas: Tarefa[] = [];

  querySnapshot.forEach((docSnapshot) => {
    tarefas.push({ id: docSnapshot.id, ...docSnapshot.data() } as Tarefa);
  });

  return tarefas;
};



export const updateTarefaConcluido = async (
  id: string, 
  data: string, // data no formato "YYYY-MM-DD" do documento Calendário a ser atualizado
  novoValor: boolean
): Promise<void> => {
  // Atualiza somente o documento Calendário identificado pela data
  const calendarRef = doc(db, "Calendário", data);
  const docSnapshot = await getDoc(calendarRef);
  if (docSnapshot.exists()) {
    const dataDoc = docSnapshot.data();
    if (dataDoc.tarefas) {
      const updatedTasks = dataDoc.tarefas.map((task: any) => {
        if (task.id === id) {
          return { ...task, concluido: novoValor };
        }
        return task;
      });
      await updateDoc(calendarRef, { tarefas: updatedTasks });
    }
  }
};



export const excluirTarefa = async (taskId: string): Promise<void> => {
  // Exclui todas as instâncias (passadas, atuais e futuras) na coleção "Calendário"
  const calendarRef = collection(db, "Calendário");
  const querySnapshot = await getDocs(calendarRef);
  for (const docSnapshot of querySnapshot.docs) {
    const dataDoc = docSnapshot.data();
    if (dataDoc.tarefas) {
      const updatedTasks = dataDoc.tarefas.filter((task: any) => task.id !== taskId);
      await updateDoc(doc(db, "Calendário", docSnapshot.id), { tarefas: updatedTasks });
    }
  }

  // Exclui a tarefa na coleção "Tarefas"
  const tarefaRef = doc(db, "Tarefas", taskId);
  await deleteDoc(tarefaRef);
};



export const removerDocumentosVaziosNoCalendario = async (): Promise<void> => {
  const calendarioRef = collection(db, "Calendário");
  const querySnapshot = await getDocs(calendarioRef);
  
  for (const docSnapshot of querySnapshot.docs) {
    const dataDoc = docSnapshot.data();
    // Verifica se o array de tarefas está vazio ou não existe
    if (!dataDoc.tarefas || dataDoc.tarefas.length === 0) {
      await deleteDoc(doc(db, "Calendário", docSnapshot.id));
    }
  }
};



export const editarTarefa = async (updatedTask: Tarefa, dataReferencia: string): Promise<void> => {
  // 1. Exclui a tarefa antiga (documento em "Tarefas" e ocorrências no "Calendário")
  await excluirTarefa(updatedTask.id!);
  
  // 2. Remove o id para que a nova tarefa receba um novo identificador
  const { id, ...novaTarefa } = updatedTask;
  
  // 3. Cria a nova tarefa com as informações atualizadas e exclui os dias sem nenhuma tarefa na coleção Calendário
  await criarTarefa(novaTarefa as Tarefa);
  await removerDocumentosVaziosNoCalendario();
};