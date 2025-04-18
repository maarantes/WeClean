const converterDias = (dias: number[]): string => {
    const mapDias: Record<number, string> = {
      0: "DOM",
      1: "SEG",
      2: "TER",
      3: "QUA",
      4: "QUI",
      5: "SEX",
      6: "SAB"
    };
    return dias.map((dia: number) => mapDias[dia]).join(", ");
  };
  
  export const formatarFrequenciaTexto = (frequencia: any): string => {
    if (!frequencia) return "Diariamente";
  
    switch (frequencia.tipo) {
      case "semanal": {
        const dias = frequencia.diasSemana ? converterDias(frequencia.diasSemana) : "";
        return `Semanalmente: ${dias}`;
      }
      case "intervalo": {
        return `Intervalo: A cada ${frequencia.intervaloDias} dias`;
      }
      case "anualmente": {
        const datas = frequencia.datasEspecificas ? frequencia.datasEspecificas.join("  ·  ") : "";
        return `Anualmente: ${datas}`;
      }
      default:
        return "Diariamente";
    }
};