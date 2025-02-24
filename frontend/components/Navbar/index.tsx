import React from 'react';
import { TouchableOpacity, View, Text } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/frontend/routes';
import { useNavigation, useRoute } from '@react-navigation/native';

import { styles } from "./styles";

import InicioIcon from "../../../assets/images/inicio.svg";
import CalendarioIcon from "../../../assets/images/calendario.svg";
import TarefasIcon from "../../../assets/images/tarefa.svg";
import PerfilIcon from "../../../assets/images/perfil.svg";

type NavbarProps = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

export function Navbar() {
    const navigation = useNavigation<NavbarProps>();
    const route = useRoute();

    const opcoes = [
        { key: 'Início', label: 'Início', icon: InicioIcon },
        { key: 'Calendário', label: 'Calendário', icon: CalendarioIcon },
        { key: 'Tarefas', label: 'Tarefas', icon: TarefasIcon },
        { key: 'Perfil', label: 'Perfil', icon: PerfilIcon },
    ]; 

    return (
        <View style={styles.container}>
            {opcoes.map((opcao) => {
                const isActive = route.name === opcao.key; 
                const iconColor = isActive ? "#5A189A" : "#404040";
                const textColor = isActive ? "#5A189A" : "#404040";

                return (
                    <TouchableOpacity 
                        key={opcao.key} 
                        style={styles.botao}
                        onPress={() => navigation.navigate(opcao.key as keyof RootStackParamList)}
                    >
                        <opcao.icon width={24} height={24} color={iconColor} />
                        <Text style={[styles.texto, { color: textColor }]}>{opcao.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
