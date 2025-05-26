import ComentarioPlus from "../../../assets/images/comentar_plus.svg";
import TarefaPlus from "../../../assets/images/tarefa_plus.svg";
import TarefaMinus from "../../../assets/images/tarefa_minus.svg";
import RetiradoGrupo from "../../../assets/images/retirado_grupo.svg";
import ExcluidoGrupo from "../../../assets/images/excluir.svg";

export const notificacaoConfig = {
  add_comentario: {
    titulo: "Novo Comentário",
    descricao: 'Tarefa "Passar aspirador" no dia 25/05',
    Icone: ComentarioPlus,
  },

  add_tarefa: {
    titulo: "Nova Atribuição",
    descricao: 'Você foi adicionado na tarefa "Lavar louça"',
    Icone: TarefaPlus,
  },

  removido_tarefa: {
    titulo: "Desatribuição",
    descricao: 'Você foi tirado da tarefa "Lavar louça"',
    Icone: TarefaMinus,
  },

  editado_tarefa: {
    titulo: "Tarefa Editada",
    descricao: 'A tarefa "Estudar", que você está atribuído, foi editada',
    Icone: ComentarioPlus,
  },

  removido_grupo: {
    titulo: "Removido do Grupo",
    descricao: 'Você foi removido do grupo "Projeto Final"',
    Icone: RetiradoGrupo,
  },

  excluido_grupo: {
    titulo: "Grupo Excluído",
    descricao: 'O grupo "Viagem 2025" foi excluído. Você foi colocado no seu Grupo Pessoal.',
    Icone: ExcluidoGrupo,
  },
};