import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "@/frontend/globalStyles";
import { TemaCor } from "@/frontend/utils/temaStyles";

// Função para validar se o tema recuperado é válido
const isTemaCor = (tema: string): tema is TemaCor => {
  const temasValidos: TemaCor[] = ["azul", "vinho", "rosa", "amarelo", "laranja", "verde", "turquesa", "coral", "roxo", "marrom"];
  return temasValidos.includes(tema as TemaCor);
};

// Hook customizado para pegar o tema
export const useTema = () => {
  const [temaUsuario, setTemaUsuario] = useState<TemaCor>("azul");

  useEffect(() => {
    const carregarTema = async () => {
      const tema = await AsyncStorage.getItem("@userTema");
      if (tema && isTemaCor(tema)) {
        setTemaUsuario(tema);  // Atualiza o estado com o tema encontrado
      }
    };

    carregarTema();
  }, []);

  // Função para obter o estilo de fundo do tema
  const getTemaStyle = (tema: TemaCor) => {

    const bgClass = globalStyles[`tema_bg_${tema}_secundario` as keyof typeof globalStyles] as { backgroundColor: string };
    const colorClass = globalStyles[`tema_color_${tema}_primario` as keyof typeof globalStyles] as { color: string };
    
    return { bgClass, colorClass };
  };

  return {
    temaUsuario,
    getTemaStyle,
  };
};