# BFF Aether

Servidor Node.js + TypeScript que conecta o portal aos microsserviços. O front chama `/api/v1`; o BFF mantém os tokens no servidor e identifica a sessão pelo cookie HttpOnly.

## Rodar localmente

Na raiz do projeto:

```bash
npm ci --prefix server
```

Copie `server/.env.example` para `server/.env` e configure:

| Variável | Uso |
| --- | --- |
| `SESSION_SECRET` | Chave aleatória com pelo menos 32 caracteres. |
| `FRONTEND_ORIGIN` | Origem do front, como `http://localhost:5173`. |
| `MS_AUTH_URL` | Origem do serviço de autenticação. |
| `MS_INVENTORY_URL` | Origem do serviço de inventários. |
| `MS_CLOUDINARY_URL` | Origem do serviço de assinatura de uploads. |
| `MS_CALCULATOR_URL` | Origem do serviço da calculadora. |
| `MS_AI_URL` | Origem do hub do Aeko. |
| `MS_AI_PATH_PREFIX` | `/hub` no gateway ou vazio no acesso direto. |
| `REDIS_URL` | Armazenamento das sessões; obrigatório em produção. |

Use apenas a origem nas URLs dos serviços, sem o caminho do endpoint. As opções de porta, tempo de resposta e sessão estão em [.env.example](.env.example).

```bash
npm run dev:bff
```

O BFF usa a porta 3001. Para testar o front com `npm run preview`, altere `FRONTEND_ORIGIN` para `http://localhost:4173` e reinicie o BFF.

## Rotas

Todas usam o prefixo `/api/v1`.

| Recurso | Rotas |
| --- | --- |
| Saúde do processo | `GET /health` |
| Autenticação | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Perfil | `GET /profile`, `PATCH /profile` |
| Visão geral | `GET /overview`, `GET /overview/organization` |
| Relatórios | `POST /reports/upload-signature`, `POST /reports`, `GET /reports/:id`, `GET /reports/:id/analysis` |
| Calculadora | `POST /calculator/cost-reduction/forecast` |
| Assistente | `GET /assistant/conversations`, `GET /assistant/conversations/:conversationId/messages`, `POST /assistant/messages` |

Confira a implementação em [src/routes](src/routes) e [src/controllers](src/controllers). O health verifica o processo, não a disponibilidade dos microsserviços.

O login recebe e-mail e senha. O papel do usuário vem do ms-auth. As rotas protegidas verificam a sessão e as permissões; a visão administrativa usa os relatórios do departamento autorizado.

O upload aceita XLSX de até 10 MB. O BFF obtém a assinatura do Cloudinary e registra a URL do arquivo no Inventory. O relatório pertence à unidade do usuário. O processamento acontece no backend; o web consulta o resultado e o plano de melhoria do Aeko. Aprovação e rejeição são feitas pelo app.

Se o registro ou o envio de uma mensagem tiver resposta incerta, consulte os relatórios ou o histórico antes de repetir a operação. O BFF não repete esses envios automaticamente.

## Produção

A imagem é definida em [Dockerfile](Dockerfile) e publicada pelo workflow do projeto como `aether-web-bff`. O Kong encaminha `/api/v1` para o serviço, preservando o caminho.

Configure `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=3001`, HTTPS nas origens, `SESSION_SECRET` e Redis. O Dockerfile também aceita `REDIS_URI` como alternativa para preencher `REDIS_URL`. Defina `TRUST_PROXY_HOPS` de acordo com os proxies da infraestrutura para o cookie Secure funcionar.

As configurações privadas ficam no ambiente do servidor. Não coloque tokens ou segredos em variáveis `VITE_*`.

## Verificação

Na raiz:

```bash
npm run typecheck:bff
npm run test:bff
```

Os testes usam serviços simulados. A conferência com os serviços publicados é feita no ambiente integrado.
