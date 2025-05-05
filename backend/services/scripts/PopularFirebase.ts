import * as dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config({ path: "../../.env" });

// Inicializa o Admin SDK usando as credenciais de serviço
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();

// Deleta todos documentos de uma coleção
const clearCollection = async (collectionName: string) => {
  const docs = await firestoreAdmin.collection(collectionName).listDocuments();
  await Promise.all(docs.map((docRef) => docRef.delete()));
  console.log(`🧹 Coleção ${collectionName} limpa.`);
};

// Deleta todos usuários do Authentication
const clearAuthUsers = async () => {
  const listUsersResult = await authAdmin.listUsers(1000);
  await Promise.all(listUsersResult.users.map((u) => authAdmin.deleteUser(u.uid)));
  console.log(`🧹 Authentication: usuários deletados.`);
};

// Cria um novo usuário via Admin SDK
const criarUsuario = async (
  nome: string,
  email: string,
  senha: string,
  tema: string
): Promise<string> => {
  const userRecord = await authAdmin.createUser({
    email,
    password: senha,
    displayName: nome,
  });
  const uid = userRecord.uid;

  await firestoreAdmin.doc(`Usuarios/${uid}`).set({
    apelido: nome,
    email,
    tema,
    grupoId: "",
  });

  console.log(`✅ Usuário criado via Admin SDK: ${nome}`);
  return uid;
};

// Gera código de convite aleatório
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
    const emails = [
      "marco@aa.com",
      "geovana@aa.com",
      "maria@aa.com",
      "joana@aa.com",
      "bruno@aa.com",
      "ana@aa.com",
      "carlos@aa.com",
      "daisy@aa.com",
    ];

    const usuariosCriados: { uid: string; nome: string }[] = [];
    for (let i = 0; i < nomes.length; i++) {
      const uid = await criarUsuario(nomes[i], emails[i], "123456", temas[i]);
      usuariosCriados.push({ uid, nome: nomes[i] });
    }

    console.log("👥 Criando grupo...");
    const codigoConvite = gerarCodigoConvite();
    const grupoRef = await firestoreAdmin.collection("Grupos").add({
      nome: "Grupo Legal",
      codigo_convite: codigoConvite,
      integrantes: usuariosCriados.map((u, idx) => ({
        uid: u.uid,
        tipo: idx === 0 ? "admin" : "normal",
      })),
    });
    const grupoId = grupoRef.id;

    // Atualiza grupoId de cada usuário
    await Promise.all(
      usuariosCriados.map(({ uid }) =>
        firestoreAdmin.doc(`Usuarios/${uid}`).set({ grupoId }, { merge: true })
      )
    );

    console.log("✅ Grupo e usuários atualizados!");

    console.log("📝 Criando tarefa...");
    const tarefaId = `tarefa-${Date.now()}`;
    const hoje = new Date();
    const diaFormatado = `${hoje.getFullYear()}-${(hoje.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${hoje.getDate().toString().padStart(2, "0")}`;

    const tarefa = {
      id: tarefaId,
      nome: "Teste",
      descricao: null,
      horario: "12:00",
      alarme: false,
      grupoId,
      integrantes: usuariosCriados.map((u) => u.uid),
      concluido: false,
      dataCriacao: diaFormatado,
      frequencia: {
        tipo: "diariamente",
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
        intervaloDias: null,
        datasEspecificas: null,
      },
    };

    await firestoreAdmin.doc(`Tarefas/${tarefaId}`).set(tarefa);
    await firestoreAdmin.doc(`Calendário/${diaFormatado}`).set({ tarefas: [tarefa] });

    console.log("🚀 Seed finalizada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
  }
};

seed();