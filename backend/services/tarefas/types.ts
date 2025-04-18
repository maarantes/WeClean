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
    grupoId: string;
  }
  