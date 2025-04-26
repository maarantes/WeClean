import { collection, deleteDoc, doc, getDocs, setDoc, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../shared/firebaseConfigScript";

import admin, { ServiceAccount } from "firebase-admin";
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();

// Deletar todos documentos de uma coleção
const clearCollection = async (collectionName: string) => {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletions = snapshot.docs.map((d) => deleteDoc(doc(db, collectionName, d.id)));
  await Promise.all(deletions);
  console.log(`🧹 Coleção ${collectionName} limpa.`);
};

// Deletar todos usuários do Authentication
const clearAuthUsers = async () => {
  const listUsersResult = await authAdmin.listUsers(1000);
  const deletions = listUsersResult.users.map((userRecord) => authAdmin.deleteUser(userRecord.uid));
  await Promise.all(deletions);
  console.log(`🧹 Authentication: usuários deletados.`);
};

// Cria um novo usuário
const criarUsuario = async (nome: string, email: string, senha: string, tema: string): Promise<string> => {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = cred.user.uid;

  await setDoc(doc(db, "Usuarios", uid), {
    apelido: nome,
    email,
    tema,
    grupoId: "",
  });
  console.log(`✅ Usuário criado: ${nome}`);
  return uid;
};

const gerarCodigoConvite = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const seed = async () => {
  try {
    console.log("🧹 Limpando dados antigos...");
    await Promise.all([
      clearCollection("Usuarios"),
      clearCollection("Grupos"),
      clearCollection("Tarefas"),
      clearCollection("Calendário"),
      clearAuthUsers(),
    ]);

    console.log("👤 Criando usuários...");
    const temas = ["azul", "vinho", "rosa", "amarelo", "laranja", "verde", "turquesa", "coral"];
    const nomes = ["Marco", "Geovana", "Maria", "Joana", "Bruno", "Ana", "Carlos", "Daisy"];
    const emails = ["marco@aa.com", "geovana@aa.com", "maria@aa.com", "joana@aa.com", "bruno@aa.com", "ana@aa.com", "carlos@aa.com", "daisy@aa.com"];

    const usuariosCriados: { uid: string; nome: string }[] = [];

    for (let i = 0; i < nomes.length; i++) {
      const uid = await criarUsuario(nomes[i], emails[i], "123456", temas[i]);
      usuariosCriados.push({ uid, nome: nomes[i] });
    }

    // Cria o Grupo com Auto ID
    console.log("👥 Criando grupo...");
    const codigoConvite = gerarCodigoConvite();
    const grupoRef = await addDoc(collection(db, "Grupos"), {
      nome: "Grupo Legal",
      codigo_convite: codigoConvite,
      integrantes: usuariosCriados.map((u, idx) => ({
        uid: u.uid,
        tipo: idx === 0 ? "admin" : "normal",
      })),
    });
    const grupoId = grupoRef.id; // pega o ID gerado automaticamente!

    // Atualizar grupoId dos usuários
    await Promise.all(
      usuariosCriados.map(({ uid }) =>
        setDoc(doc(db, "Usuarios", uid), { grupoId }, { merge: true })
      )
    );

    console.log("✅ Grupo e usuários atualizados!");

    // 📆 Criar Tarefa
    console.log("📝 Criando tarefa...");
    const tarefaId = `tarefa-${Date.now()}`;
    const tarefa = {
      id: tarefaId,
      nome: "Teste",
      descricao: null,
      horario: "12:00",
      alarme: false,
      grupoId,
      integrantes: usuariosCriados.map((u) => u.uid),
      concluido: false,
      dataCriacao: new Date().toISOString().split("T")[0],
      frequencia: {
        tipo: "diariamente",
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
        intervaloDias: null,
        datasEspecificas: null,
      },
    };

    await setDoc(doc(db, "Tarefas", tarefaId), tarefa);

    const hoje = new Date();
    const diaFormatado = `${hoje.getFullYear()}-${(hoje.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${hoje.getDate().toString().padStart(2, "0")}`;

    await setDoc(doc(db, "Calendário", diaFormatado), {
      tarefas: [tarefa],
    });

    console.log("🚀 Seed finalizada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
  }
};

seed();