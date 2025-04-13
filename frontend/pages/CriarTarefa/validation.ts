export const validarFormulario = ({
    nome,
    horario,
    integrantesSelecionados,
    botaoFrequenciaAtivo,
    diasSelecionados,
    intervalo,
    datasSelecionadas,
  }: any) => {
    let erros: any = {};
    let mensagem = "";
    let ok = true;
  
    if (!nome.trim()) {
      erros.nome = true;
      mensagem = "O nome é obrigatório.";
      ok = false;
    }
  
    if (horario === "N/A") {
      erros.horario = true;
      mensagem = "O horário é obrigatório.";
      ok = false;
    }
  
    if (integrantesSelecionados.length === 0) {
      erros.integrantes = true;
      mensagem = "Selecione pelo menos um integrante.";
      ok = false;
    }
  
    if (botaoFrequenciaAtivo === null) {
      erros.frequencia = true;
      mensagem = "Selecione uma frequência.";
      ok = false;
    } else if (botaoFrequenciaAtivo === 1 && diasSelecionados.length === 0) {
      erros.frequencia = true;
      mensagem = "Escolha pelo menos um dia da semana.";
      ok = false;
    } else if (botaoFrequenciaAtivo === 2 && (!intervalo || Number(intervalo) <= 0)) {
      erros.frequencia = true;
      mensagem = "Defina um intervalo válido.";
      ok = false;
    } else if (botaoFrequenciaAtivo === 3) {
      const selecionadas = datasSelecionadas.filter((item: any) => item.data);
      if (selecionadas.length === 0) {
        erros.frequencia = true;
        mensagem = "Escolha pelo menos uma data.";
        ok = false;
      }
    }
  
    return { ok, erros, mensagem };
  };
  