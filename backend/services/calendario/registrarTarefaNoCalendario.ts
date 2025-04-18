import { doc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../shared/firebase";
import { Tarefa } from "../tarefas/types";
import { formatLocalDate } from "./utils/formatLocalDate";

export const registrarTarefaNoCalendario = async (tarefa: Tarefa): Promise<void> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexado (0 = janeiro)
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const [year, month, day] = tarefa.dataCriacao.split("-").map(Number);
  const creationDate = new Date(year, month - 1, day);

  let occurrenceDates: Date[] = [];

  switch (tarefa.frequencia.tipo) {
    case "diariamente": {
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
        const mes = parseInt(mesStr, 10) - 1;
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
      concluido: tarefa.concluido ?? false,
      grupoId: tarefa.grupoId
    };

    try {
      await updateDoc(calendarRef, {
        tarefas: arrayUnion(tarefaEntry)
      });
    } catch (error) {
      await setDoc(calendarRef, {
        tarefas: [tarefaEntry]
      });
    }
  }
};