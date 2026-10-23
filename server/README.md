# BFF Aether — autenticação e sessão

Node 24 + TypeScript + Express. O processo do BFF é separado do Vite. O navegador chama somente `/api/v1`; o BFF chama o ms-auth e mantém os tokens em seu store de sessão. O cookie contém apenas um identificador assinado, HttpOnly e SameSite=Lax; em produção também é Secure.

## Executar localmente

1. Na raiz: `npm ci`.
2. Na pasta server: `npm ci` e `Copy-Item .env.example .env`.
3. Preencha `SESSION_SECRET` com uma chave aleatória de pelo menos 32 caracteres e confirme `MS_AUTH_URL`. A URL local padrão do exemplo é `http://localhost:8080`, conforme API_PORT padrão do serviço.
4. Inicie o ms-auth com suas dependências/configuração próprias com o contrato de role descrito abaixo disponível no login e no refresh.
5. Na raiz, terminal 1: `npm run dev:bff`. Terminal 2: `npm run dev`.
6. Acesse `http://localhost:5173`. Se a origem/porta mudar, ajuste FRONTEND_ORIGIN. O proxy do Vite encaminha `/api` para `127.0.0.1:3001`.

Não colocar tokens, senhas ou secrets em variáveis VITE_*. Arquivos .env são ignorados; o exemplo não contém credenciais reais. Nunca versionar o store de sessão. Redis não deve ficar acessível publicamente.

## Arquivos e fluxo

`routes/auth.ts` associa URLs aos métodos de `controllers/auth.ts`; o controller coordena validação e sessão; `services/auth.ts` valida os contratos externos e usa o cliente HTTP de `services/http.ts`; `types/auth.ts` define o contrato e o formato interno da sessão. `app.ts` monta middleware e rotas; `index.ts` inicia o processo e conecta Redis, quando configurado.

| Endpoint | Entrada | Resultado |
| --- | --- | --- |
| GET /api/v1/health | Nenhuma | Liveness do processo; não atesta saúde dos serviços |
| POST /api/v1/auth/login | JSON email/password; Origin configurada | Cookie de sessão + `{ user: { id, name, email, role } }` |
| GET /api/v1/auth/me | Cookie | Recupera identidade validada pelo ms-auth; renova token próximo da expiração |
| POST /api/v1/auth/logout | JSON `{}`; Origin configurada | Destrói sessão e limpa cookie; 204 |

Todas as respostas têm X-Request-Id e Cache-Control: no-store. Erros: `{ error: { code, message, requestId } }`. Configuração, request JSON (8 KB), resposta upstream (64 KB) e tempo de chamada são limitados. Não há retries de login/refresh nem propagação indiscriminada de headers. CORS não está habilitado: a implantação usa origem única para browser e BFF.

O ms-auth precisa retornar no login e refresh:

```json
{
  "email": "usuario@example.com",
  "authenticated": true,
  "expiration": "2030-01-01T12:00:00Z",
  "accessToken": "token-do-servico",
  "refreshToken": "token-do-servico",
  "role": "analyst"
}
```

`role` aceita apenas analyst/administrator. Ausência/valor desconhecido bloqueia o login; nenhum fallback usa email ou dados mockados. O endpoint GET /api/profile deve retornar id/name/email coerentes com a identidade autenticada. CPF, tokens e outros campos não são devolvidos pelo contrato de sessão.

A definição de administrator/analyst pertence ao ms-auth e deve acompanhar a regra de permissões aprovada pelo backend. O BFF utiliza apenas a role retornada pelo serviço. A tabela separada administrator não faz parte deste fluxo. O backend calcula o papel e atualiza permissões no refresh. O BFF não decodifica JWT para confiar em claims; usa o endpoint protegido do ms-auth, responsável pela validação.

## Sessão e limites

Sessão possui prazo absoluto de oito horas por padrão, configurável até 24 horas; recuperar a sessão não estende esse prazo. O frontend verifica a sessão na montagem, ao voltar à janela e a cada minuto enquanto visível. Refresh próximo da expiração atualiza o papel. Desativação do funcionário é validada pelo ms-auth nos endpoints protegidos.

Login regenera o ID de sessão. Logout é local ao BFF; o serviço atual não oferece revogação de tokens. A fila por sessão evita refresh simultâneo dentro do processo e coordena logout. Em múltiplas réplicas, avaliar coordenação distribuída se o backend implementar refresh de uso único; o rate limit atual é por processo.

Desenvolvimento sem REDIS_URL usa MemoryStore e perde sessões ao reiniciar. Produção exige Redis, HTTPS nas origens e SESSION_SECRET forte; configurar TRUST_PROXY_HOPS somente para a quantidade real de proxies confiáveis. Cookie Secure exige HTTPS e proxy correto. Usar secret manager no deploy. O reverse proxy deve encaminhar `/api` para o BFF; GitHub Pages sozinho não hospeda este processo.

## Verificação

Na raiz: `npm run build`, `npm run lint`, `npm test`, `npm run typecheck:bff` e `npm run test:bff`. Os testes do BFF utilizam um ms-auth HTTP simulado e nunca credenciais reais. Testes de Redis/HTTPS e E2E com os serviços implantados ainda devem ser feitos no ambiente integrado.

A overview integra inventários pessoais reais; demais telas continuam com dados demonstrativos até suas integrações. A autenticação já usa API; não existe fallback de autenticação mockado. A seleção de análise é restrita a administrator; endpoints de dados futuros também precisam de autorização no BFF/microsserviços. Guardas React protegem a navegação, não substituem autorização de API.

## Overview e inventários

GET /api/v1/overview exige sessão validada e usa MS_INVENTORY_URL no ambiente do BFF. Não configurar esta variável em VITE_*. Ausência retorna seções indisponíveis, sem afetar os endpoints de login. Produção exige HTTPS.

A overview agrega /api/inventories/count, /api/inventories/mine?take=6&skip=0 e /api/inventories/mine/last. Somente o 404 de último inventário vira null. Cada seção retorna ready/data ou error/error. Falha em uma consulta não oculta as demais seções; não há fallback fictício. As contagens são pessoais para ambos os papéis. Não há consolidação financeira, ranking entre plantas ou alertas estatísticos nestes contratos.
### Indicadores por papel

A overview também usa o filtro status de /api/inventories/mine para os totais pessoais do analista (UNDER_REVIEW, APPROVED, PROCESSING_FAILED), via totalCount. Para administrador consulta /api/inventories/pending com escopo departamental, explicitado no contrato. O papel vem da sessão validada; parâmetros do browser não escolhem esse escopo. Cada indicador retorna seu próprio estado de sucesso/erro. A interface usa relatórios sem renomear APIs ou tabelas.