import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "../shared/firebase";
import { formatLocalDate } from "./utils/formatLocalDate";

export const obterTarefasCalendario = async (): Promise<Record<string, any[]>> => {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - dayOfWeek);
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + (6 - dayOfWeek));

  const startStr = formatLocalDate(startDate);
  const endStr = formatLocalDate(endDate);

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
    result[docSnapshot.id] = data.tarefas || [];
  });

  return result;
};
