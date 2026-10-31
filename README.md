# Aether — portal web

Portal do ecossistema Aether para consultar relatórios, usar a calculadora de redução de custos, conversar com o assistente e gerenciar o perfil. O administrador consulta os relatórios do departamento e acessa a entrada do sistema administrativo.

- [Portal](https://aethergases.org/dashboard/)
- [Repositório](https://github.com/AetherGases/aether-web-flow)
- [Entregas e evidências dos requisitos mínimos de DAD](docs/entregas-dad.md)
- [Configuração, contratos e segurança do BFF](server/README.md)

O endereço publicado precisa ser validado após o deploy de cada versão, incluindo as rotas do BFF. Alterações na branch não são publicadas automaticamente só por existir esse link.

## Executar localmente

Use Node >= 24.15 e npm >= 11.12.1.

```powershell
npm ci
npm ci --prefix server
Copy-Item server/.env.example server/.env
```

Preencha `server/.env` conforme a documentação do BFF. Os segredos e as origens dos microsserviços ficam no servidor, nunca em variáveis `VITE_*`. O arquivo `.env.example` da raiz documenta somente o endereço público opcional do CRUD (`VITE_ADMIN_URL`). Não substitua arquivos `.env` existentes sem preservar sua configuração.

Em dois terminais:

```powershell
npm run dev:bff
```

```powershell
npm run dev
```

Acesse `http://localhost:5173/dashboard/`. O Vite encaminha `/api` para o BFF na porta 3001.

## Organização

- `src/pages`: páginas e estilos em pastas próprias.
- `src/components`: componentes reutilizáveis com props tipadas.
- `src/hooks` e `src/contexts`: estado, sessão, preferências e ciclo de vida das consultas.
- `src/services`: chamadas HTTP e contratos de resposta por recurso.
- `src/types`: entidades do domínio.
- `src/utils`: validações e funções de apoio.
- `server`: BFF, sessão e comunicação com os microsserviços.

## Fluxos e rotas

Analistas acessam overview pessoal, seleção de relatório, calculadora, assistente e perfil. Administradores acessam overview departamental, seleção do escopo de análise, gestão administrativa, assistente e perfil. As rotas privadas exigem sessão e as páginas exclusivas verificam o papel via `PrivateRoute`; as APIs também precisam de autorização no servidor.

O envio tem rotas `/data-analysis/upload/plant` e `/data-analysis/upload/company`. A página lê `scope` com `useParams`, verifica sua presença e seu valor e restringe `company` a administradores. A rota antiga `/data-analysis/upload` e os links com query string continuam aceitos. Parâmetros inválidos mostram a página de erro.

## Preferências visuais e idioma

Perfil > Configurações permite alternar modo claro, alto contraste e português/inglês/espanhol. As opções são aplicadas às telas, sidebar e login. O alto contraste tem prioridade sobre o tema; ao desligá-lo, volta o tema escolhido.

As preferências são locais ao navegador, persistem após recarga e logout e são salvas em `aether.preferences`:

```json
{ "_versao": 3, "lightMode": true, "highContrast": false, "language": "pt-BR" }
```

Versões anteriores são migradas sem apagar idioma/contraste. Dados incompatíveis são descartados e bloqueio do armazenamento não impede o funcionamento na sessão atual. Textos estão em `src/translations/messages.ts`. Datas e números usam `Intl`; valores financeiros continuam em reais. Dados externos e mensagens do usuário não são traduzidos automaticamente.

## Integrações e pendências

Login, perfil, organização, overview, calculadora e chatbot consultam seus serviços através do BFF. Falhas exibem indisponibilidade/erro, sem resultados fictícios de fallback. Os indicadores do analista são pessoais; os do admin têm o escopo de departamento fornecido pelo inventory.

A seleção de `.xlsx` ainda abre a **análise demonstrativa**: não envia nem processa o arquivo e não registra um relatório no banco. Upload real, análise, filtros com dados reais e PDF da análise aguardam o contrato do back-end. O PDF da calculadora possui apresentação própria para impressão. O acesso ao CRUD fica desabilitado enquanto `VITE_ADMIN_URL` não estiver configurada com um endereço funcional.

## Verificação

```powershell
npm run build
npm run lint
npm test
npm run typecheck:bff
npm run test:bff
```

Os testes usam respostas simuladas e não provam disponibilidade em produção. Antes da entrega, validar os serviços reais, navegar sem mouse, conferir com leitor de tela e registrar as evidências no documento de entregas.

## Publicação

O Dockerfile constrói o front e serve os arquivos com Nginx. O BFF é um processo separado e precisa de deploy próprio, HTTPS, Redis e encaminhamento de `/api/v1` no gateway. O proxy de desenvolvimento do Vite não existe na hospedagem estática.

Há CI e workflow de deploy para EKS. O PDF de DAD cita Vercel/GitHub Pages: a aceitação da infraestrutura EKS deve ser confirmada com o professor, ou deve ser preparada uma publicação do front na plataforma exigida com acesso a um BFF hospedado separadamente. Este documento não declara essa validação como concluída.
