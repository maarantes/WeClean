import ComentarioPlus from "../../../assets/images/comentar_plus.svg";
import TarefaPlus from "../../../assets/images/tarefa_plus.svg";
import TarefaMinus from "../../../assets/images/tarefa_minus.svg";
import RetiradoGrupo from "../../../assets/images/retirado_grupo.svg";
import ExcluidoGrupo from "../../../assets/images/excluir.svg";

export const notificacaoConfig = {
  add_comentario: {
    titulo: "Novo Comentário",
    descricao: (dados: { nomeTarefa?: string; data?: string; content?: string }) =>
      `Tarefa "${dados.nomeTarefa}" em ${dados.data}`,
    Icone: ComentarioPlus,
  },

  add_tarefa: {
    titulo: "Nova Atribuição",
    descricao: (dados: { nomeTarefa?: string }) =>
      `Você foi adicionado na tarefa "${dados.nomeTarefa}"`,
    Icone: TarefaPlus,
  },

  removido_tarefa: {
    titulo: "Desatribuição",
    descricao: (dados: { nomeTarefa?: string }) =>
      `Você foi removido da tarefa "${dados.nomeTarefa}"`,
    Icone: TarefaMinus,
  },

  editado_tarefa: {
    titulo: "Tarefa Editada",
    descricao: (dados: { nomeTarefa?: string }) =>
      `A tarefa "${dados.nomeTarefa}", que você está atribuído, foi editada.`,
    Icone: ComentarioPlus,
  },

  removido_grupo: {
    titulo: "Removido do Grupo",
    descricao: (dados: { nomeGrupo?: string }) =>
      `Você foi removido do grupo "${dados.nomeGrupo}"`,
    Icone: RetiradoGrupo,
  },

  excluido_grupo: {
    titulo: "Grupo Excluído",
    descricao: (dados: { nomeGrupo?: string }) =>
      `O grupo "${dados.nomeGrupo}" foi excluído. Você foi colocado no seu Grupo Pessoal.`,
    Icone: ExcluidoGrupo,
  },
};
