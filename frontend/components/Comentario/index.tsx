import React from "react";
import { Text, View, ViewStyle, TextStyle } from "react-native";
import { styles } from "./styles";
import PerfilIcon from "../../../assets/images/user.svg";
import { Timestamp } from "firebase/firestore";
import { formatarDataCriacao } from "@/frontend/utils/formatarDataCriacao";

interface CaixaComentarioProps {
  nome_usuario: string;
  cor_primaria: string;
  cor_secundaria: string;
  data_criacao: Timestamp;
  conteudo: string;
}

const CaixaComentario: React.FC<CaixaComentarioProps> = ({
  nome_usuario,
  cor_primaria,
  cor_secundaria,
  data_criacao,
  conteudo
}) => {
  return (
    <View style={styles.container}>

      <View style={styles.container_cima}>
        <View style={styles.usuario_container}>
          <View style={[styles.bolinha, { backgroundColor: cor_primaria }]}>
            <PerfilIcon width={16} height={16} color={cor_secundaria} strokeWidth={1.25}/>
          </View>
          <Text style={[styles.usuario_nome, { color: cor_secundaria }]}>
            {nome_usuario}
          </Text>
        </View>
        <View>
            <Text style={styles.data_texto}>{formatarDataCriacao(data_criacao)}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.conteudo_texto}>{conteudo}</Text>
      </View>
    </View>
  );
};

export default CaixaComentario;
