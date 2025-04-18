import { auth, db } from "../shared/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const entrarNoGrupoPorCodigo = async (codigoConvite: string, grupoAtualId: string): Promise<{ success: boolean; message: string }> => {
    if (codigoConvite.length !== 6) {
      return { success: false, message: "Digite um código válido de 6 dígitos." };
    }
  
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
        return { success: false, message: "Usuário não autenticado." };
        }

        const gruposRef = collection(db, "Grupos");
        const q = query(gruposRef, where("codigo_convite", "==", codigoConvite));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        return { success: false, message: "Código inválido ou grupo não encontrado." };
        }

        const grupoDoc = querySnapshot.docs[0];
        const grupoId = grupoDoc.id;
        const grupoData = grupoDoc.data();

        if (grupoId === grupoAtualId) {
        return { success: false, message: "Você já está neste grupo." };
        }

        // Checar se já tem 10 integrantes
        if (grupoData.integrantes.length >= 10) {
        return { success: false, message: "Este grupo já está cheio." };
        }

        const jaEhIntegrante = grupoData.integrantes.some((integrante: any) => integrante.uid === uid);
        if (jaEhIntegrante) {
        return { success: false, message: "Você já faz parte deste grupo." };
        }

        // Adicionar novo integrante
        const novoIntegrante = { uid, tipo: "normal" };
        const grupoRef = doc(db, "Grupos", grupoId);
        await updateDoc(grupoRef, {
        integrantes: [...grupoData.integrantes, novoIntegrante],
        });

        const userRef = doc(db, "Usuarios", uid);

        await updateDoc(userRef, {
            grupoId: grupoId,
        });
  
        return { success: true, message: "Você entrou no grupo com sucesso!" };
  
    } catch (error) {
      console.error("Erro ao entrar no grupo:", error);
      return { success: false, message: "Ocorreu um erro ao tentar entrar no grupo." };
    }
  };  