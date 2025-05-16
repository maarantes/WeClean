import { useCallback, useState, useEffect } from "react";
import { obterComentariosPorInstancia, ComentarioProps } from "../../../backend/services/comentario/obterComentarios";

export function formatarDataComentario(s: string): Date {
  const [datePart, timePart] = s.split(", ");
  const [day, month]        = datePart.split("/").map(Number);
  const [hour, min]         = timePart.replace("h", ":").split(":").map(Number);
  const now                 = new Date();
  return new Date(now.getFullYear(), month - 1, day, hour, min);
}

export function useComentarios(instanceId: string, isOpen: boolean) {
  const [comentarios, setComentarios] = useState<ComentarioProps[]>([]);

  const fetchComentarios = useCallback(async () => {
    if (!instanceId) return;
    try {
      const lista = await obterComentariosPorInstancia(instanceId);
      lista.sort((a, b) =>
        formatarDataComentario(a.createdAt).getTime() -
        formatarDataComentario(b.createdAt).getTime()
      );
      setComentarios(lista);
    } catch (e) {
      console.error(e);
    }
  }, [instanceId]);

  useEffect(() => {
    if (isOpen) fetchComentarios();
  }, [isOpen, fetchComentarios]);

  return { comentarios, fetchComentarios };
}