import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoExclusaoTarefa = async (
  userIds: string[],
  nomeTarefa: string
) => {
  const notificacoes = userIds.map((uid) =>
    criarNotificacao(uid, "excluido_tarefa", { nomeTarefa })
  );
  await Promise.all(notificacoes);
};
