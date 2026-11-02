# Aether — Web

Portal web do projeto Aether, desenvolvido com React e TypeScript no Projeto Interdisciplinar 2026.

[Acessar o portal](https://aethergases.org/dashboard/)

## Funcionalidades

- Login e edição do perfil.
- Visão geral com indicadores pessoais para o analista e do departamento para o administrador.
- Envio de Excel da unidade e acompanhamento do processamento.
- Análise das emissões por categoria, escopo e gás, plano de melhoria e exportação em PDF.
- Calculadora de redução de custos para o analista, com exportação em PDF.
- Conversas com o assistente Aeko.
- Acesso ao sistema administrativo pelo perfil de administrador.
- Modo claro, escuro, alto contraste e idiomas português, inglês e espanhol.

Os relatórios são vinculados à unidade do usuário. A aprovação e rejeição são feitas no aplicativo e o web consulta os status no backend.

## Tecnologias

React, TypeScript, Vite, React Router e styled-components. O BFF fica em `server/` e usa Node.js, Express e Redis para as sessões.

## Como rodar

Requisitos: Node.js 24.15 ou superior e npm 11.12.1 ou superior.

```bash
npm ci
npm ci --prefix server
```

Copie `server/.env.example` para `server/.env` e preencha as configurações dos serviços. Se o arquivo já existir, preserve os valores configurados. Veja as instruções no [README do BFF](server/README.md).

Em um terminal, inicie o BFF:

```bash
npm run dev:bff
```

Em outro, inicie o front:

```bash
npm run dev
```

Abra [localhost:5173/dashboard/](http://localhost:5173/dashboard/). As chamadas de `/api` são encaminhadas para o BFF na porta 3001.

O endereço do CRUD pode ser definido com `VITE_ADMIN_URL`, conforme `.env.example`. O padrão é `https://aethergases.org/login`.

## Build e testes

```bash
npm run build
npm run lint
npm test
npm run typecheck:bff
npm run test:bff
```

Para conferir a build localmente:

```bash
npm run preview
```

A prévia abre na porta 4173. Para fazer login nela, use `FRONTEND_ORIGIN=http://localhost:4173` no ambiente do BFF e reinicie o processo. Ao voltar ao desenvolvimento, restaure a porta 5173.

## Estrutura

- `src/pages`: telas.
- `src/components`: componentes reutilizáveis.
- `src/hooks` e `src/contexts`: estado, sessão e preferências.
- `src/services`: comunicação com o BFF.
- `src/types` e `src/utils`: tipos e funções de apoio.
- `server`: BFF e integração com os microsserviços.
- `tests`: testes do front.

## Publicação

O deploy é disparado pela publicação de uma release no GitHub e usa o workflow compartilhado da organização para o EKS. O front é servido pelo Nginx; o BFF é publicado como `aether-web-bff`, com imagem definida em `server/Dockerfile`. O Kong encaminha `/dashboard/` para o front e `/api/v1` para o BFF.

As configurações dos serviços e das sessões ficam no ambiente do BFF. O acesso ao CRUD abre uma aplicação separada, com seu próprio login.
