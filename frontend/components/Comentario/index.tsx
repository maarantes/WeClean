import React from "react";
import { Text, View, ViewStyle, TextStyle } from "react-native";
import { styles } from "./styles";
import PerfilIcon from "../../../assets/images/user.svg";

interface CaixaComentarioProps {
  nomeUsuario: string;
  cor_primaria: string;
  cor_secundaria: string;
  data: string;
  conteudo: string;
}

const CaixaComentario: React.FC<CaixaComentarioProps> = ({
  nomeUsuario,
  cor_primaria,
  cor_secundaria,
  data,
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
            {nomeUsuario}
          </Text>
        </View>
        <View>
            <Text style={styles.data_texto}>{data}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.conteudo_texto}>{conteudo}</Text>
      </View>
    </View>
  );
};

export default CaixaComentario;
