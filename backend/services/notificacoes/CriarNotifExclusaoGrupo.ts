import { criarNotificacao } from "./CriarNotificacao";

export const criarNotificacaoExclusaoGrupo = async (
  userIds: string[],
  nomeGrupo: string
): Promise<void> => {
  const notificacoes = userIds.map((uid) =>
    criarNotificacao(uid, "excluido_grupo", { nomeGrupo })
  );
  await Promise.all(notificacoes);
};
