import React from 'react';
import { TouchableOpacity, View, Text } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/frontend/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTema } from "@/frontend/hooks/useTema";

import { styles } from "./styles";

import InicioIcon from "../../../assets/images/inicio.svg";
import CalendarioIcon from "../../../assets/images/calendario.svg";
import TarefasIcon from "../../../assets/images/tarefa.svg";
import PerfilIcon from "../../../assets/images/perfil.svg";

type NavbarProps = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

export function Navbar() {
  const navigation = useNavigation<NavbarProps>();
  const route = useRoute();
  const { temaUsuario, getTemaStyle } = useTema();  // Correção: obtenção do estilo do tema

  // Desestrutura o estilo para obter bgClass e textClass (cor do fundo e do texto)
  const { bgClass, colorClass } = getTemaStyle(temaUsuario);

  type RoutesSemParams = {
    [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined ? K : never
  }[keyof RootStackParamList];

  const opcoes: { key: RoutesSemParams; label: string; icon: React.FC<any> }[] = [
    { key: 'Início', label: 'Início', icon: InicioIcon },
    { key: 'Calendário', label: 'Calendário', icon: CalendarioIcon },
    { key: 'Tarefas', label: 'Tarefas', icon: TarefasIcon },
    { key: 'Perfil', label: 'Perfil', icon: PerfilIcon },
  ];

  return (
    <View style={styles.container}>
      {opcoes.map((opcao) => {
        const isActive = route.name === opcao.key;

        // Quando ativo, usa a cor secundária para o ícone e texto, caso contrário, usa cor padrão
        const iconColor = isActive ? colorClass.color : "#404040";
        const textColor = isActive ? colorClass.color : "#404040";

        return (
          <TouchableOpacity 
            key={opcao.key} 
            style={styles.botao}
            onPress={() => navigation.navigate(opcao.key)}
          >
            {/* Ícone com a cor secundária do tema */}
            <opcao.icon width={24} height={24} color={iconColor} />
            <Text style={[styles.texto, { color: textColor }]}>
              {opcao.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}