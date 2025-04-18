import { TextStyle, ViewStyle } from "react-native";
import { globalStyles } from "@/frontend/globalStyles";

export type TemaCor =
  | "azul" | "vinho" | "rosa" | "amarelo" | "laranja"
  | "verde" | "turquesa" | "coral" | "roxo" | "marrom";

// retorna o estilo de background (para componentes View)

export const getTemaBgStyle = (
  tema: TemaCor,
  intensidade: "primario" | "secundario"
): ViewStyle => {
  const key = `tema_bg_${tema}_${intensidade}` as keyof typeof globalStyles;
  return globalStyles[key] as ViewStyle;
};

// Retorna o estilo de cor (para componentes Text)

export const getTemaTextStyle = (
  tema: TemaCor,
  intensidade: "primario" | "secundario"
): TextStyle => {
  const key = `tema_color_${tema}_${intensidade}` as keyof typeof globalStyles;
  return globalStyles[key] as TextStyle;
};

// Retorna apenas as cores brutas (strings) para background e texto

export const getCoresDoTema = (
    tema: TemaCor
  ): { cor_primaria: string; cor_secundaria: string } => {
    const bgKey = `tema_bg_${tema}_secundario` as keyof typeof globalStyles;
    const colorKey = `tema_color_${tema}_primario` as keyof typeof globalStyles;
  
    const bgStyle = globalStyles[bgKey] as ViewStyle | undefined;
    const textStyle = globalStyles[colorKey] as TextStyle | undefined;
  
    if (!bgStyle?.backgroundColor || !textStyle?.color) {
      throw new Error(`Cores do tema "${tema}" não encontradas no globalStyles.`);
    }
  
    return {
      cor_primaria: String(bgStyle.backgroundColor),
      cor_secundaria: String(textStyle.color),
    };
  };  