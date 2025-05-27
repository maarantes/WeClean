import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoEdicaoTarefa = async (
  userIds: string[],
  nomeTarefa: string
) => {
  const notificacoes = userIds.map((uid) =>
    criarNotificacao(uid, "editado_tarefa", { nomeTarefa })
  );
  await Promise.all(notificacoes);
};