import { Timestamp } from "firebase/firestore";

export const formatarDataCriacao = (dataCriacao: Timestamp | Date): string => {
  const agora = new Date();
  const criadoEm = dataCriacao instanceof Timestamp ? dataCriacao.toDate() : dataCriacao;
  const diffMs = agora.getTime() - criadoEm.getTime();
  const segundos = Math.floor(diffMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);

  if (segundos < 60) return "Agora";
  if (minutos < 60) return `${minutos}min`;
  if (horas < 24) return `${horas}h`;
  if (dias < 7) return `${dias}d`;
  return `${semanas} sem`;
};
