# 🫧 WeClean
![React Native](https://img.shields.io/badge/React%20Native-25D2F5?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Aplicativo de organização de tarefas domésticas feito no React Native

<br>

# ⚙️ Manual de Instalação

#### 1. Clone o repositório

```
git clone https://github.com/maarantes/WeClean.git
```


#### 2. Vá para a pasta frontend e instale as dependências
```
cd frontend
npm install
```

#### 3.  Obtenha as Credenciais do Firebase

Essas chaves são usadas no React Native para autenticação, Firestore, etc.

#### 3.1) Crie seu ENV

Duplique o arquivo `.env.sample` e renomeie-o de `.env`

#### 3.2) Acesse o Console do Firebase

- Vá para [https://console.firebase.google.com](https://console.firebase.google.com)

#### 3.3) Adicione um Aplicativo

- No dashboard do projeto, clique em **Adicionar App** e dê qualquer nome
- Clique em **Registrar App** e avance

#### 3.4) Copie e cole as chaves
Copie e cole o conteúdo que será retornado a você embaixo de "Firebase Web SDK" no .env

```
const firebaseConfig = {
  apiKey: "sua-chave-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};
```

#### 3.5) Acesse as Configurações do Projeto

- No [console do Firebase](https://console.firebase.google.com), selecione seu projeto.
- No menu lateral esquerdo, clique em **⚙️ Configurações do Projeto**
- Vá até a aba **Contas de serviço**.

#### 3.6) Gere uma Nova Chave Privada

- Na seção **SDK do Firebase Admin**, clique em **"Gerar nova chave privada"**.
- Confirme a ação para fazer o download de um `.json` com as credenciais.

#### 3.7) Extraia as Informações

Abra o arquivo `.json`, copie os campos e cole no .env

| Campo no JSON              | Variável no `.env`                    |
|----------------------------|---------------------------------------|
| `project_id`               | `FIREBASE_PROJECT_ID`                 |
| `private_key_id`           | `FIREBASE_PRIVATE_KEY_ID`             |
| `private_key`              | `FIREBASE_PRIVATE_KEY`                |
| `client_email`             | `FIREBASE_CLIENT_EMAIL`               |
| `client_id`                | `FIREBASE_CLIENT_ID`                  |
| `client_x509_cert_url`     | `FIREBASE_CLIENT_X509_CERT_URL`       |

#### 4. Rode o aplicativo

Baixe o aplicativo **Expo Go** e escaneie o **QR code** que aparecerá no terminal após rodar o comando abaixo:

```
npx expo start
```

