import { collection,  query,  where,  getDocs,  doc,  getDoc } from "firebase/firestore";
import { db } from "../shared/firebase";
import { getCoresDoTema, TemaCor } from "@/frontend/utils/temaStyles";

export interface ComentarioProps {
  id: string;
  userId: string;
  nomeUsuario: string;
  cor_primaria: string;
  cor_secundaria: string;
  createdAt: string;
  content: string;
}

export async function obterComentariosPorInstancia(
  instanceId: string
): Promise<ComentarioProps[]> {
  const q = query(
    collection(db, "Comentários"),
    where("instanceId", "==", instanceId)
  );
  const snap = await getDocs(q);

  const comentarios: ComentarioProps[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data() as {
      userId: string;
      createdAt: string;
      content: string;
    };

    // busca dados do autor do comentário
    const userRef  = doc(db, "Usuarios", data.userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists()
      ? userSnap.data()
      : { apelido: "Desconhecido", tema: "undefined" };

    const tema = userData.tema as TemaCor;
    const { cor_primaria, cor_secundaria } = getCoresDoTema(tema);

    comentarios.push({
      id: docSnap.id,
      userId: data.userId,
      nomeUsuario: userData.apelido,
      cor_primaria,
      cor_secundaria,
      createdAt: data.createdAt,
      content: data.content,
    });
  }

  return comentarios;
}