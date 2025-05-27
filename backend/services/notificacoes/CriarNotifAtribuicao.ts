import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoAtribuicao = async (
  userIds: string[],
  nomeTarefa: string
) => {
  const notificacoes = userIds.map((uid) =>
    criarNotificacao(uid, "add_tarefa", { nomeTarefa })
  );
  await Promise.all(notificacoes);
};