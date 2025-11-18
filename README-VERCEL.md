# Finance Manager - Deploy no Vercel

Este projeto foi configurado para deploy no Vercel com todas as otimizações necessárias.

## 🚀 Como fazer deploy no Vercel

### Método 1: Via CLI (Recomendado)

1. Instale o Vercel CLI globalmente:
```bash
npm install -g vercel
```

2. Entre no diretório do projeto:
```bash
cd finance-manager-vercel
```

3. Faça login no Vercel:
```bash
vercel login
```

4. Execute o deploy:
```bash
vercel
```

5. Para deploy em produção:
```bash
vercel --prod
```

### Método 2: Via Dashboard do Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em "Add New Project"
4. Importe o repositório do GitHub ou faça upload do projeto
5. O Vercel detectará automaticamente as configurações do Vite
6. Clique em "Deploy"

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

Antes de fazer o deploy, configure as variáveis de ambiente do Firebase no painel do Vercel:

1. Vá em **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis:

```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### Arquivo .env.example

Um arquivo `.env.example` está incluído no projeto. Copie-o para `.env` e preencha com suas credenciais do Firebase:

```bash
cp .env.example .env
```

## 🔧 Configurações Aplicadas

As seguintes otimizações foram aplicadas para garantir que o layout funcione corretamente no Vercel:

1. **vercel.json** - Configuração de rotas SPA e build
2. **vite.config.js** - Otimizações de build e code splitting
3. **.npmrc** - Compatibilidade de dependências
4. **base: '/'** - Caminho base correto para assets

## 🧪 Testar Localmente

Antes de fazer deploy, teste o build localmente:

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Preview do build
npm run preview
```

O preview estará disponível em `http://localhost:4173`

## 📝 Estrutura do Projeto

```
finance-manager-vercel/
├── public/           # Assets estáticos
├── src/              # Código fonte React
│   ├── components/   # Componentes reutilizáveis
│   ├── context/      # Context API (Auth)
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Páginas da aplicação
│   ├── utils/        # Utilitários
│   ├── App.jsx       # Componente principal
│   ├── firebase.js   # Configuração Firebase
│   ├── main.jsx      # Entry point
│   └── styles.css    # Estilos globais
├── index.html        # HTML principal
├── vercel.json       # Configuração Vercel
├── vite.config.js    # Configuração Vite
└── package.json      # Dependências

```

## 🐛 Solução de Problemas

### Layout quebrado após deploy

Se o layout ainda estiver quebrado:

1. Verifique se o `base: '/'` está configurado no `vite.config.js`
2. Certifique-se de que todos os caminhos de assets começam com `/`
3. Limpe o cache do Vercel: Settings > General > Clear Cache

### Erros de build

Se houver erros durante o build:

1. Verifique se todas as dependências estão instaladas
2. Execute `npm install` novamente
3. Verifique se as variáveis de ambiente estão configuradas

### Firebase não funciona

1. Verifique se as variáveis de ambiente estão corretas
2. Certifique-se de que o domínio do Vercel está autorizado no Firebase Console
3. Em Firebase Console > Authentication > Settings > Authorized domains

## 📞 Suporte

Para mais informações sobre deploy no Vercel, consulte a [documentação oficial](https://vercel.com/docs).
