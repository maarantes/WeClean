import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "@/frontend/globalStyles";
import { TemaCor } from "@/frontend/utils/temaStyles";

const temasValidos: TemaCor[] = ["undefined", "azul", "vinho", "rosa", "amarelo", "laranja", "verde", "turquesa", "coral", "roxo", "marrom"];

const isTemaCor = (tema: string): tema is TemaCor => temasValidos.includes(tema as TemaCor);

export const useTema = () => {
  const [temaUsuario, setTemaUsuario] = useState<TemaCor>("undefined");
  const [aplicarTemaApp, setAplicarTemaApp] = useState<boolean>(true);
  const [loadingTema, setLoadingTema] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const tema = await AsyncStorage.getItem("@userTema");
        if (tema && isTemaCor(tema)) {
          setTemaUsuario(tema);
        }

        const aplicarTemaString = await AsyncStorage.getItem("@aplicarTemaApp");
        setAplicarTemaApp(aplicarTemaString === "true");
      } finally {
        setLoadingTema(false); // Marca como carregado
      }
    };

    carregarDados();
  }, []);

const getTemaStyle = (tema: TemaCor): { bgClass: { backgroundColor: string }, colorClass: { color: string } } => {
  // Enquanto carrega, aplica um tema neutro
  if (loadingTema) {
    return {
      bgClass: globalStyles["tema_bg_undefined_secundario"] as { backgroundColor: string },
      colorClass: globalStyles["tema_color_undefined_primario"] as { color: string },
    };
  }

  if (!aplicarTemaApp) {
    return {
      bgClass: globalStyles["tema_bg_padrao_secundario"] as { backgroundColor: string },
      colorClass: globalStyles["tema_color_padrao_primario"] as { color: string },
    };
  }

  // Caso contrário, aplica o tema escolhido
  return {
    bgClass: globalStyles[`tema_bg_${tema}_secundario`] as { backgroundColor: string },
    colorClass: globalStyles[`tema_color_${tema}_primario`] as { color: string },
  };
};


  return {
    temaUsuario,
    aplicarTemaApp,
    getTemaStyle,
    loadingTema,
  };
};
