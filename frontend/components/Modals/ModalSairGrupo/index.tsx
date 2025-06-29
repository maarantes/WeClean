import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import ModalWrapper from "../ModalWrapper"
import Badge from "../../Badge"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@/frontend/routes"

import { sairDoGrupo } from "@/backend/services/grupos/SairGrupo"
import { auth, db } from "@/backend/services/shared/firebaseConfigApp"
import { doc, getDoc } from "firebase/firestore"

import { getCoresDoTema } from "@/frontend/utils/temaStyles"
import { styles } from "./styles"

import SairIcon from "../../../../assets/images/sair.svg"

interface ModalSairGrupoProps {
  visible: boolean
  setVisible: (v: boolean) => void
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Grupo">

const ModalSairGrupo: React.FC<ModalSairGrupoProps> = ({ visible, setVisible }) => {
  const navigation = useNavigation<NavigationProps>()
  const [isAdmin, setIsAdmin] = useState(false)
  const [integrantes, setIntegrantes] = useState<any[]>([])
  const [novoAdminUID, setNovoAdminUID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    if (visible) carregarDados()
  }, [visible])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const uid = auth.currentUser?.uid
      if (!uid) return

      const userSnap = await getDoc(doc(db, "Usuarios", uid))
      if (!userSnap.exists()) return

      const userData = userSnap.data()
      const grupoId = userData.grupoId
      const grupoSnap = await getDoc(doc(db, "Grupos", grupoId))
      if (!grupoSnap.exists()) return

      const grupoData = grupoSnap.data()
      const lista = grupoData.integrantes || []

      setIsAdmin(lista.find((i: any) => i.uid === uid && i.tipo === "admin") !== undefined)

      const outros = lista.filter((i: any) => i.uid !== uid)
      const detalhes = await Promise.all(
        outros.map(async (i: any) => {
          const u = await getDoc(doc(db, "Usuarios", i.uid))
          const data = u.data()
          const tema = data?.tema || "undefined"
          const { cor_primaria, cor_secundaria } = getCoresDoTema(tema)
          return {
            uid: i.uid,
            nome: data?.apelido || "Desconhecido",
            cor_primaria,
            cor_secundaria,
          }
        })
      )
      const detalhesOrdenados = detalhes.sort((a, b) => a.nome.localeCompare(b.nome))

      setIntegrantes(detalhesOrdenados)
      if (detalhesOrdenados.length > 0) setNovoAdminUID(detalhesOrdenados[0].uid)
    } finally {
      setLoading(false)
    }
  }

  const handleSairDoGrupo = async () => {
    try {
      setSaindo(true)
      await sairDoGrupo(novoAdminUID ?? undefined)
      setVisible(false)
      navigation.reset({ index: 0, routes: [{ name: "Grupo" }] })
    } catch (error) {
      console.error("Erro ao sair do grupo:", error)
    } finally {
      setSaindo(false)
    }
  }

  const fecharModal = () => {
    setNovoAdminUID(null)
    setVisible(false)
  }

  const titulo = isAdmin ? "Sair do Grupo" : "Deseja sair do grupo?"
  const descricao = isAdmin ? "Antes de sair do grupo, escolha uma pessoa para ser a nova administradora." : "Você não fará mais parte deste grupo."

  return (
    <ModalWrapper
      isVisible={visible}
      onClose={fecharModal}
      onPrimarioAcao={handleSairDoGrupo}
      botaoPrimarioTexto={isAdmin ? "Escolher e Sair" : "Sair"}
      botaoSecundarioTexto="Cancelar"
      titulo={titulo}
      descricao={descricao}
      disablePrimario={isAdmin && !novoAdminUID}
      loading={saindo}
      icone={<SairIcon width={20} height={18} color="white" strokeWidth={1.5} />}
      botaoPrimarioMaior={isAdmin}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#808080" />
      ) : isAdmin ? (
        <>
          <View style={styles.lista_integrantes}>
            {integrantes.map((integrante) => (
              <Badge
                key={integrante.uid}
                text={integrante.nome}
                isSelected={novoAdminUID === integrante.uid}
                onPress={() => setNovoAdminUID(integrante.uid)}
                clicavel
                backgroundColor={novoAdminUID === integrante.uid ? integrante.cor_primaria : "#D9D9D9"}
                iconColor={novoAdminUID === integrante.uid ? integrante.cor_secundaria : "#8C8C8C"}
              />
            ))}
          </View>

          <Text style={styles.selecionado}>
            Selecionado: <Text style={{ fontFamily: "Inter-SemiBold" }}>{integrantes.find((i) => i.uid === novoAdminUID)?.nome || "Nenhum"}</Text>
          </Text>
        </>
      ) : null}
    </ModalWrapper>
  )
}

export default ModalSairGrupo
