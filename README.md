# aether-web-flow
Este é o repositório responsável pelo portal web do ecossistema Aether, responsável pelo gerenciamento e visualização de relatórios via WEB.


### Alto contraste

O controle em Perfil > Configurações aplica alto contraste à aplicação inteira, incluindo sidebar e telas públicas. A preferência fica no `localStorage` do navegador, em `aether.preferences`, com schema versionado que também inclui o idioma. Navegação, recarga e logout não desativam a preferência; o usuário pode desligá-la pelo mesmo controle. A escolha é deste navegador, sem sincronização entre dispositivos. Dados incompatíveis são descartados com segurança; se o navegador bloquear o armazenamento, o controle continua funcionando na sessão atual.


### Idiomas

Perfil > Configurações > Idioma permite escolher Português (Brasil), English ou Espanhol. O `PreferencesProvider` aplica a escolha a todas as telas e à sidebar, atualiza o atributo `lang` do documento e salva `{ "_versao": 2, "highContrast": true, "language": "en" }` em `aether.preferences`. A versão anterior é migrada preservando o alto contraste. A preferência é local ao navegador e continua após navegar, recarregar e sair da conta.

Os textos ficam em `src/translations/messages.ts`, com português como idioma de origem e traduções para inglês e espanhol. Componentes usam `useTranslation()` e `t('Meu perfil')`. Datas e números usam `Intl` com a localidade selecionada; valores financeiros continuam em reais, sem conversão cambial. Nomes, arquivos, conteúdos dos relatórios e mensagens digitadas pelo usuário não são traduzidos. Os textos de feedback conhecidos são traduzidos ao exibir; uma mensagem externa sem tradução mantém o original. Idiomas inválidos usam português. A seleção não modifica contratos, rotas ou dados do backend.
