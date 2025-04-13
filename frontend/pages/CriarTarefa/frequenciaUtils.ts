import { Frequencia } from "../../../backend/services/tarefas/types";

export const montarFrequencia = (
  botaoFrequenciaAtivo: number,
  diasSelecionados: string[],
  intervalo: string,
  datasSelecionadas: { id: number; data: Date | null }[]
): Frequencia => {
  const diasSemanaMap = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  switch (botaoFrequenciaAtivo) {
    case 0:
      return {
        tipo: "diariamente",
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
        intervaloDias: null,
        datasEspecificas: null,
      };
    case 1:
      return {
        tipo: "semanal",
        diasSemana: diasSelecionados.map((d) => diasSemanaMap.indexOf(d)),
        intervaloDias: null,
        datasEspecificas: null,
      };
    case 2:
      return {
        tipo: "intervalo",
        diasSemana: null,
        intervaloDias: parseInt(intervalo, 10),
        datasEspecificas: null,
      };
    case 3:
      return {
        tipo: "anualmente",
        diasSemana: null,
        intervaloDias: null,
        datasEspecificas: datasSelecionadas
          .filter((item) => item.data !== null)
          .map((item) =>
            item.data!.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })
          ),
      };
    default:
      return {
        tipo: "diariamente",
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
        intervaloDias: null,
        datasEspecificas: null,
      };
  }
};
