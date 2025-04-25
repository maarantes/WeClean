import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../shared/firebaseConfigScript";

// Limpa documentos de uma coleção
const clearCollection = async (collectionName: string) => {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletions = snapshot.docs.map((d) => deleteDoc(doc(db, collectionName, d.id)));
  await Promise.all(deletions);
  console.log(`🧹 Coleção ${collectionName} limpa.`);
};

// Cria usuário no Auth e na coleção "Usuarios"
const criarUsuario = async (nome: string, email: string, senha: string, tema: string): Promise<string> => {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = cred.user.uid;
  await setDoc(doc(db, "Usuarios", uid), {
    apelido: nome,
    email,
    grupoId: "",
    tema,
  });
  console.log(`✅ Usuário criado: ${nome}`);
  return uid;
};

// Gera código de convite (6 números)
const gerarCodigoConvite = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const seed = async () => {
  try {
    await Promise.all([
      clearCollection("Usuarios"),
      clearCollection("Grupos"),
      clearCollection("Tarefas"),
      clearCollection("Calendário"),
    ]);

    const temas = ["azul", "vinho", "rosa", "amarelo", "laranja", "verde", "turquesa", "coral"];
    const nomes = ["Marco", "Geovana", "Maria", "Joana", "Bruno", "Ana", "Carlos", "Daisy"];
    const emails = ["marco@aa.com", "geovana@aa.com", "maria@aa.com", "joana@aa.com", "bruno@aa.com", "ana@aa.com", "carlos@aa.com", "daisy@aa.com"];

    const usuariosCriados: { uid: string; nome: string }[] = [];

    for (let i = 0; i < nomes.length; i++) {
      const uid = await criarUsuario(nomes[i], emails[i], "123456", temas[i]);
      usuariosCriados.push({ uid, nome: nomes[i] });
    }

    // Marco será o admin
    const grupoId = usuariosCriados[0].uid;
    const codigoConvite = gerarCodigoConvite();

    await setDoc(doc(db, "Grupos", grupoId), {
      nome: "Grupo Legal",
      codigo_convite: codigoConvite,
      integrantes: usuariosCriados.map((u, idx) => ({
        uid: u.uid,
        tipo: idx === 0 ? "admin" : "normal",
      })),
    });

    await Promise.all(
      usuariosCriados.map(({ uid }) =>
        setDoc(doc(db, "Usuarios", uid), { grupoId }, { merge: true })
      )
    );

    console.log("✅ Grupo criado e usuários atualizados");

    // Cria tarefa
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
    console.log("✅ Tarefa criada");

    const hoje = new Date();
    const diaFormatado = `${hoje.getFullYear()}-${(hoje.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${hoje.getDate().toString().padStart(2, "0")}`;

    await setDoc(doc(db, "Calendário", diaFormatado), {
      tarefas: [tarefa],
    });

    console.log("📆 Calendário atualizado");
    console.log("🚀 Banco de dados populado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao executar seed:", err);
  }
};

seed();