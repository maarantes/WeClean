import { useCallback, useState, useEffect } from "react";
import {
  obterComentariosPorInstancia,
  ComentarioProps,
} from "../../../backend/services/comentario/obterComentarios";

export function useComentarios(instanceId: string, isOpen: boolean) {
  const [comentarios, setComentarios] = useState<ComentarioProps[]>([]);

  const fetchComentarios = useCallback(async () => {
    if (!instanceId) return;
    try {
      const lista = await obterComentariosPorInstancia(instanceId);

      lista.sort((a, b) =>
        a.dataCriacao.toDate().getTime() - b.dataCriacao.toDate().getTime()
      );

      setComentarios(lista);
    } catch (e) {
      console.error("Erro ao buscar comentários:", e);
    }
  }, [instanceId]);

  useEffect(() => {
    if (isOpen) fetchComentarios();
  }, [isOpen, fetchComentarios]);

  return { comentarios, fetchComentarios };
}
