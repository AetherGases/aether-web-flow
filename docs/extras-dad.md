# Extras de DAD — implementação e demonstração

Referência: Requisitos por disciplina – Interdisciplinar – Maio2026. Este documento separa o código implementado das verificações que precisam ser demonstradas na apresentação.

| Extra | Implementação | Evidência |
| --- | --- | --- |
| Context API com Provider, hook e tipagem | Sessão e preferências globais | [AuthProvider](../src/contexts/AuthProvider/index.tsx), [useAuth](../src/hooks/useAuth.ts), [PreferencesProvider](../src/contexts/PreferencesProvider/index.tsx), [contrato](../src/contexts/preferences-context.ts). Explicar como idioma/tema e sessão são compartilhados sem atravessar as rotas por props. |
| useReducer com State e Action em union types | Histórico, seleção, envio, confirmação, erro e restauração do rascunho do chat | [Tipos](../src/types/assistant.ts), [reducer puro](../src/utils/assistant-reducer.ts), [hook](../src/hooks/useAssistant.ts), [testes](../tests/assistant-reducer.test.ts). |
| Hook com retorno tipado, loading, erro e cancelamento | Hooks de perfil, overview, calculadora, login e assistente | [useProfile](../src/hooks/useProfile.ts), [useAssistant](../src/hooks/useAssistant.ts), [useCalculator](../src/hooks/useCalculator.ts). Mostrar AbortController e cleanup; impedir que uma resposta antiga substitua a seleção atual. |
| React.lazy e Suspense por página | Importações dinâmicas, fallback de carregamento e recuperação de falha do chunk | [App](../src/App.tsx), [PageBoundary](../src/components/PageBoundary/index.tsx). Demonstrar requisições de chunks no Network ao entrar em páginas ainda não visitadas. |
| localStorage com schema versionado | Preferências versão 3, migração e descarte seguro | [Parser/persistência](../src/utils/preferences.ts), [testes](../tests/preferences.test.ts). A sessão/tokens não são salvos junto das preferências. |
| useMemo e useCallback com justificativa de performance | Reuso de Intl.DateTimeFormat/NumberFormat e de funções estáveis por idioma | [formatador de datas](../src/hooks/useReportDateFormatter.ts), [useTranslation](../src/hooks/useTranslation.ts), [calculadora](../src/pages/calculator/index.tsx), [análise](../src/pages/data-analysis/index.tsx). Medição controlada abaixo; repetir a demonstração no React DevTools Profiler. |
| Proteção contra XSS | Conteúdo externo por interpolação JSX e contratos validados | [Renderização do chat](../src/pages/assistant/index.tsx), [serviço](../src/services/assistant.ts), [testes de contrato](../tests/assistant.test.ts). Texto contendo marcação continua sendo texto; não há dangerouslySetInnerHTML. |
| Validação/sanitização de formulários em utils | Login, nome/telefone, calculadora, mensagem e arquivo | [Login](../src/utils/validation.ts), [perfil](../src/utils/profile.ts), [calculadora](../src/utils/calculator.ts), [assistente](../src/utils/assistant.ts), [seleção de relatório](../src/utils/analysis.ts). Campos possuem limites e erros; a mensagem é validada no hook e novamente antes do serviço. |
| Rotas privadas com autenticação por Context | Guarda comum e restrição por papel | [PrivateRoute](../src/components/PrivateRoute/index.tsx), [Context](../src/contexts/AuthProvider/index.tsx), [rotas](../src/App.tsx). Demonstrar acesso sem sessão e tentativa de página de outro papel. |
| Acessibilidade avançada | Salto ao conteúdo, foco/título por rota, retorno de foco, controles nativos, log e dicas de gráfico com Escape | [Navegação](../src/components/NavigationAccessibility/index.tsx), [chat](../src/pages/assistant/index.tsx), [edição de campo](../src/components/ProfileField/index.tsx), [barra do gráfico](../src/components/ProjectionBar/index.tsx). Revisão e demonstração com NVDA/VoiceOver continuam necessárias. |

## Por que usar reducer no chat

Uma resposta de envio muda várias informações juntas: estado de envio, mensagem provisória, conversa selecionada e histórico. Uma falha precisa remover a mensagem provisória e devolver o rascunho sem apagar as mensagens anteriores. As ações representam essas transições completas.

`AssistantState` distingue loading, ready e sending; a interface não consegue representar loading e sending ao mesmo tempo. `AssistantAction` descreve os dados necessários em cada transição. O switch exaustivo ajuda a identificar uma ação nova sem implementação. Efeitos e chamadas de API ficam no hook; o reducer é puro e não altera arrays existentes.

## Medição de formatação

Cenário controlado: sete datas de relatório, 120 renders, três rodadas em Chromium, ambiente de desenvolvimento, sem StrictMode no componente de medição. A versão anterior criava um Intl.DateTimeFormat para cada data; a atual usa o hook real com useMemo por idioma e useCallback para a função de formatação. As duas versões produziram exatamente as mesmas datas.

O custo de renderização foi coletado com React.Profiler. O contador de construções de Intl e as mudanças de referência do callback foram registrados separadamente. O componente de teste ficou fora do produto; não há um painel de performance exposto ao usuário.

| Rodada | Versão | Renders | Construções de Intl | Trocas do callback | Soma do actualDuration |
| --- | --- | --- | --- | --- | --- |
| 1 | Antes | 120 | 840 | 119 | 153.6 ms |
| 1 | Depois | 120 | 1 | 0 | 16.3 ms |
| 2 | Antes | 120 | 840 | 119 | 56.1 ms |
| 2 | Depois | 120 | 1 | 0 | 15.4 ms |
| 3 | Antes | 120 | 840 | 119 | 50.9 ms |
| 3 | Depois | 120 | 1 | 0 | 9.1 ms |

[Dados coletados da medição](evidencias/performance-formatadores.json). No app, StrictMode pode executar inicializadores novamente durante verificações de desenvolvimento.

Os tempos dependem da máquina, aquecimento e ambiente. Esses números demonstram o custo da formatação nesse cenário, não um percentual de melhoria de toda a aplicação. A identidade estável da função também evita propagar um callback novo quando o idioma não mudou. O hook de datas só é utilizado nas telas que exibem datas, evitando criar instâncias em componentes que apenas traduzem textos. Quando o idioma muda, o formatter e a função são recriados para respeitar a localidade.

Na calculadora, o formatter de moeda é mantido entre alterações dos campos; na prévia de análise, os formatters são mantidos entre alterações dos filtros. Não foram adicionadas caches para cálculos triviais de poucas barras do gráfico.

## Demonstrações na apresentação

1. **Context:** alternar tema/idioma no perfil, navegar e recarregar; mostrar o Provider e o hook de consumo. Explicar o estado que seria repetido por props em diferentes rotas.
2. **Reducer:** abrir o chat, enviar uma pergunta e simular uma falha; mostrar como o rascunho é restaurado. Apontar State/Action e os testes de transição.
3. **Cancelamento:** com Network lento, sair de uma página durante a consulta; mostrar o abort e que o resultado não reaparece em outra tela.
4. **Lazy:** abrir DevTools > Network, desativar cache e recarregar a overview; navegar a perfil e calculadora. Mostrar os novos arquivos JS solicitados na primeira visita. A segunda visita pode usar o módulo já carregado.
5. **Profiler:** no React DevTools Profiler, gravar atualizações da tela com o mesmo idioma. Mostrar os formatters memoizados e comparar com a versão anterior de formatação usando o mesmo conjunto de dados e ações. Não atribuir o tempo de rede ao custo do render.
6. **XSS:** em ambiente de teste, renderizar uma mensagem com marcação. Mostrar que o texto não se transforma em tags executáveis. Não usar dados ou credenciais reais no exemplo.
7. **Teclado/leitor de tela:** testar os passos abaixo e registrar resultado, navegador, versão do leitor e data da verificação.

## Roteiro de acessibilidade

- Usar Tab/Shift+Tab, Enter, Espaço e Escape sem mouse. Confirmar nomes e estados anunciados pelo NVDA/VoiceOver.
- Usar “Pular para o conteúdo”. Ao mudar de rota, verificar o foco no h1 e a atualização do título do documento.
- No perfil, editar nome/telefone, cancelar e salvar; verificar foco devolvido e mensagens de erro/sucesso.
- Usar os selects nativos de idioma, período/planta e histórico; a semântica expandida/selecionada é fornecida pelo navegador.
- No chat, conferir histórico, novo chat, envio, erro e atualização. O compositor recebe foco depois do envio/novo chat; a seleção e atualização devolvem foco aos controles correspondentes. Mensagens são anunciadas pelo log.
- No gráfico da calculadora, focar uma barra, ler mês/valor e fechar a dica com Escape. A dica pode ser mantida com o ponteiro e não alarga a tela no celular.
- Conferir temas claro/escuro/alto contraste, zoom, tamanhos pequenos e preferência de movimento reduzido.

Não foi criado um modal ou uma aba sem necessidade para demonstrar ARIA. Os controles existentes têm semântica nativa; o gráfico usa nome acessível e foco de teclado. Conformidade WCAG 2.1 AA completa exige revisão de todos os critérios aplicáveis e teste assistivo humano; a implementação e os testes automatizados não são uma certificação.

## Limites que permanecem

A análise do relatório continua demonstrativa, e o envio/processamento/PDF dessa análise aguardam o back-end. A escolha de XLSX valida o nome/extensão e não envia arquivo; limites de tamanho e validação do conteúdo real devem acompanhar o contrato de upload. CRUD e publicação ainda dependem da configuração e validação dos serviços. Esses pontos não foram declarados concluídos por adicionar hooks ou acessibilidade.
