import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoRemocaoTarefa = async (
  userIds: string[],
  nomeTarefa: string
) => {
  const notificacoes = userIds.map((uid) =>
    criarNotificacao(uid, "removido_tarefa", { nomeTarefa })
  );
  await Promise.all(notificacoes);
};
