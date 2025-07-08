# NexoBiiz

O **NexoBiiz** é um sistema ERP (Enterprise Resource Planning) de código aberto e gratuito, com foco em impacto social, desenvolvido para ajudar micro e pequenos empreendedores a gerenciar seus negócios de forma prática e eficiente.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Configuração e Execução](#configuração-e-execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [API Reference](#api-reference)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuição](#contribuição)
- [Licença](#licença)

  ***

## Funcionalidades

- **Controle de Estoque**: cadastro, edição e remoção de produtos com gerenciamento de quantidade e preço.
- **Transações Financeiras**: registro de entradas (vendas) e saídas (despesas), categorizadas e exportáveis.
- **Dashboards e Relatórios**: gráficos em tempo real e relatórios resumidos de vendas, receitas e despesas.
- **Autenticação e Segurança**: login, logout, refresh token e proteção CSRF.
- **Responsividade**: design adaptável para desktop e dispositivos móveis.

## Tecnologias

- **Next.js (v14)** com App Router
- **React** e **TypeScript**
- **Sass/SCSS** para estilos modulares
- **Prisma ORM** e **PostgreSQL**
- **JWT** para autenticação
- **ESLint** e **Prettier** para qualidade de código
- **Jest** para testes unitários e de integração

## Arquitetura

Estrutura inspirada no Next.js App Router, separando frontend, API e configurações:

```
nexoBiiz/
├── prisma/           # Schema, migrações e seed
├── public/           # Assets estáticos (imagens, favicon)
├── src/
│   ├── app/          # Páginas, rotas e API handlers
│   ├── components/   # Componentes React reutilizáveis
│   ├── context/      # Contextos (Auth, Theme, etc.)
│   ├── lib/          # Clientes HTTP, utilitários, prisma client
│   ├── middleware/   # CSRF, rate limiter
│   ├── style/        # SCSS globais e módulos
│   └── types/        # Tipagens TypeScript
├── .env.example      # Exemplo de variáveis de ambiente
├── next.config.ts    # Configurações do Next.js
├── tsconfig.json     # Configurações do TypeScript
├── jest.config.js    # Configurações de teste Jest
└── package.json      # Dependências e scripts
```

## Configuração e Execução

### Pré-requisitos

- Node.js >= 18
- PostgreSQL instalado e em execução
- Git

### Passo a Passo

1.  Clone este repositório:
    ```pwsh
    git clone https://github.com/seu-usuario/nexobiiz.git
    cd nexoBiiz
    ```
2.  Instale as dependências:
    ```pwsh
    npm install
    ```
3.  Configure variáveis de ambiente:
    - Copie `.env.example` para `.env`
    - Atualize `DATABASE_URL` e `SECRET_KEY`
4.  Prepare o banco de dados:
    ```pwsh
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
5.  Execute em modo de desenvolvimento:
    ```pwsh
    npm run dev
    ```
    Acesse `http://localhost:3000` no seu navegador.

## Variáveis de Ambiente

| Variável     | Descrição                     | Exemplo                                  |
| ------------ | ----------------------------- | ---------------------------------------- |
| DATABASE_URL | Conexão Prisma com PostgreSQL | postgresql://user:pass@localhost:5432/db |
| SECRET_KEY   | Chave secreta para JWT/CSRF   | sua_chave_secreta                        |

## API Reference

EndPoints REST sob `/api` retornam JSON:

- `POST /api/register` : cadastro de usuário.
- `POST /api/login` : autentica e retorna tokens.
- `POST /api/refresh` : renova token de acesso.
- `POST /api/logout` : encerra sessão.
- `GET /api/transactions` : lista transações.
- `POST /api/transactions` : cria nova transação.

## Scripts Disponíveis

| Comando                  | Descrição                       |
| ------------------------ | ------------------------------- |
| `npm run dev`            | Inicializa servidor em modo dev |
| `npm run build`          | Gera build de produção          |
| `npm run start`          | Executa build em produção       |
| `npm run lint`           | Executa ESLint                  |
| `npm run test`           | Executa testes com Jest         |
| `npx prisma migrate dev` | Executa migrações Prisma        |
| `npx prisma db seed`     | Popula banco com dados iniciais |

## Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto.
2. Crie uma branch (`git checkout -b feature/minha-feature`).
3. Faça commit das mudanças (`git commit -m 'Minha feature'`).
4. Push na branch (`git push origin feature/minha-feature`).
5. Abra um Pull Request.

## Licença

Este projeto é open-source e distribuído sem licença específica. Use e adapte conforme necessário, mantendo os créditos aos autores originais.
