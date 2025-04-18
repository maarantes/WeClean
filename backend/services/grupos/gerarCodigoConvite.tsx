import { db } from "../shared/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const gerarCodigoConvite = async (): Promise<string> => {
  let codigo = "";
  let codigoExiste = true;

  while (codigoExiste) {
    codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const gruposRef = collection(db, "Grupos");
    const q = query(gruposRef, where("codigo_convite", "==", codigo));
    const querySnapshot = await getDocs(q);

    codigoExiste = !querySnapshot.empty;
  }

  return codigo;
};