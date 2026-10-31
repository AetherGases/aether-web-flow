# Entregas — requisitos mínimos de DAD

Referência: Requisitos por disciplina – Interdisciplinar – Maio2026, seção Desenvolvimento de Aplicações Dinâmicas. Este documento cobre os mínimos; não declara os extras como entregues.

Os links relativos apontam para o código da mesma versão deste documento. Após o merge, usar o link da versão/commit entregue na apresentação.

| Requisito | Evidência | Situação |
| --- | --- | --- |
| Vite, React e TypeScript, sem JS/JSX em src | [package.json](../package.json#L39); [tsconfig.app.json](../tsconfig.app.json#L2) | Implementado |
| Componentes/páginas em pastas próprias e seis componentes reutilizáveis | [src/components/Sidebar/index.tsx](../src/components/Sidebar/index.tsx#L24); [src/components/ProfileField/index.tsx](../src/components/ProfileField/index.tsx#L5); [src/components/MetricCard/index.tsx](../src/components/MetricCard/index.tsx#L6) | Implementado |
| Interfaces de props e entidades separadas, sem any | [src/components/InventoryStatus/index.tsx](../src/components/InventoryStatus/index.tsx#L11); [src/types/inventory.ts](../src/types/inventory.ts#L7) | Implementado; revisão por lint/tipos |
| API isolada em services, contratos, erros e ambiente | [src/services/http.ts](../src/services/http.ts#L12); [src/services/profile.ts](../src/services/profile.ts#L31); [server/.env.example](../server/.env.example#L5) | Implementado |
| useState, agrupamento dos estados relacionados e atualizações imutáveis | [src/pages/profile/index.tsx](../src/pages/profile/index.tsx#L17); [src/components/ProfileField/index.tsx](../src/components/ProfileField/index.tsx#L29); [src/pages/data-analysis/index.tsx](../src/pages/data-analysis/index.tsx#L49) | Implementado |
| useEffect com dependências e cleanup | [src/hooks/useOverview.ts](../src/hooks/useOverview.ts#L1); [src/hooks/useProfile.ts](../src/hooks/useProfile.ts#L1) | Implementado; preparar demonstração oral |
| Listas com keys estáveis | [src/pages/overview/index.tsx](../src/pages/overview/index.tsx#L72); [src/pages/assistant/index.tsx](../src/pages/assistant/index.tsx#L41) | Implementado |
| useParams com presença e validação | [src/pages/data-upload/index.tsx](../src/pages/data-upload/index.tsx#L15); [src/utils/analysis.ts](../src/utils/analysis.ts#L7) | Implementado: scope plant/company |
| React Router com mais de três rotas, Link/useNavigate e 404 | [src/App.tsx](../src/App.tsx#L50); [src/pages/error/index.tsx](../src/pages/error/index.tsx#L23) | Implementado |
| Acessibilidade: botões, labels, alt, contraste, erros e teclado | [src/pages/login/index.tsx](../src/pages/login/index.tsx#L94); [src/pages/data-upload/index.tsx](../src/pages/data-upload/index.tsx#L68); [src/styles/tokens.css](../src/styles/tokens.css#L19); [src/styles/global.css](../src/styles/global.css#L41) | Correções implementadas; navegação e leitor de tela devem ser demonstrados na entrega |
| Feedback de carregamento, sucesso e erro | [src/hooks/useProfile.ts](../src/hooks/useProfile.ts#L11); [src/components/Toast/index.tsx](../src/components/Toast/index.tsx#L10); [src/pages/calculator/index.tsx](../src/pages/calculator/index.tsx#L71) | Implementado nos fluxos integrados; análise real continua pendente |
| Publicação na plataforma exigida e link no README | [Portal](https://aethergases.org/dashboard/); [README](../README.md#publicação) | Pendente: validar deploy atual e aceitação de EKS ou publicar na plataforma exigida |
| Vinte commits no padrão por quatro semanas | [Histórico](https://github.com/AetherGases/aether-web-flow/commits/develop/) | Evidência local suficiente; registrar links dos commits de entrega |

## Conferência antes da apresentação

- Executar build, lint, testes do front e BFF e verificação de tipos.
- Percorrer login, sidebar, perfil e formulários somente com teclado, com foco visível. Demonstrar o fluxo de editar/cancelar e mensagens de erro no DOM.
- Demonstrar `/data-analysis/upload/plant`, `/company` para admin e um escopo inválido. O link antigo sem parâmetro usa o escopo padrão com segurança.
- Demonstrar carregamento, resposta e erro em uma consulta real. Nunca expor tokens ou credenciais nas evidências.
- Validar o portal e o BFF em produção e registrar URL, versão e data de conferência. Confirmar a plataforma de hospedagem com o professor: o PDF cita Vercel/GitHub Pages, enquanto o workflow atual utiliza EKS.
- Registrar links dos commits/PRs, respeitando o prazo e Conventional Commits.

## Limites desta entrega

A tela de análise está identificada como demonstrativa. Selecionar XLSX não faz upload nem registra um relatório. Envio, processamento, análise real e exportação dessa análise dependem da integração futura. O CRUD administrativo também depende de um endereço funcional configurado. A implementação de interface não substitui essas etapas nem o teste integrado.

Os requisitos das outras disciplinas exigem suas próprias evidências nos repositórios do banco, microsserviços, app, IA e documentação de UX.
