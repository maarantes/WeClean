import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/backend/services/shared/firebaseConfigApp";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UsuarioContext = createContext<any>(null);

export const UsuarioProvider = ({ children }: { children: React.ReactNode }) => {
  const [apelido, setApelido] = useState("");
  const [tema, setTema] = useState("azul");
  const [temNotificacoes, setTemNotificacoes] = useState(false);

  const [unsubscribeNotif, setUnsubscribeNotif] = useState<() => void>();
  const [unsubscribeUserDoc, setUnsubscribeUserDoc] = useState<() => void>();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setApelido("");
        setTema("azul");
        setTemNotificacoes(false);

        unsubscribeUserDoc?.();
        unsubscribeNotif?.();
        return;
      }

      const uid = user.uid;

      // Listener para o documento do usuário
      const userRef = doc(db, "Usuarios", uid);
      const unsubUser = onSnapshot(userRef, (snap) => {
        const data = snap.data();
        if (data) {
          setApelido(data.apelido || "");
          setTema(data.tema || "azul");
        }
      });
      setUnsubscribeUserDoc(() => unsubUser);

      // Listener para notificações
      const q = query(collection(db, "Notificacoes"), where("userId", "==", uid));
      const unsubNotif = onSnapshot(q, (snap) => {
        setTemNotificacoes(!snap.empty);
      });
      setUnsubscribeNotif(() => unsubNotif);
    });

    return () => {
      unsubAuth();
      unsubscribeUserDoc?.();
      unsubscribeNotif?.();
    };
  }, []);

  return (
    <UsuarioContext.Provider
      value={{
        apelido,
        tema,
        temNotificacoes,
        recarregarNotificacoes: () => {
          const uid = auth.currentUser?.uid;
          if (!uid) return;

          const q = query(collection(db, "Notificacoes"), where("userId", "==", uid));
          onSnapshot(q, (snap) => {
            setTemNotificacoes(!snap.empty);
          });
        },
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);