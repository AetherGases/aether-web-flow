import { useTranslation } from '../../hooks/useTranslation'
import { type FormEvent, useEffect, useRef } from 'react'
import { useAssistant } from '../../hooks/useAssistant'
import { useAuth } from '../../hooks/useAuth'
import { assistantMessageLimit } from '../../services/assistant'
import assistantIcon from '../../assets/icons/chatbot/assistant-icon.svg'
import sendIcon from '../../assets/icons/chatbot/send-icon.svg'
import Sidebar from '../../components/Sidebar'
import SectionState from '../../components/SectionState'
import * as S from './styles'

const suggestions = ['O que é um inventário de gases de efeito estufa?', 'Qual a diferença entre os escopos 1, 2 e 3?', 'O que são gases verdes?']

function AssistantPage() {
  const { t } = useTranslation()
  const { user, logout, retry } = useAuth()
  const chat = useAssistant()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chat.messages.length) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chat.messages])
  if (!user) return null
  const busy = chat.sending || chat.loading
  const isNewConversation = !chat.conversationId && chat.messages.length === 0
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void chat.send(chat.draft) }

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content>
      <S.Header><h4 id="id-page">{t("Assistente IA")}</h4><h1>{t("Assistente Aether")}</h1></S.Header>
      <S.ConversationControls aria-label={t("Suas conversas")}>
        <S.NewConversationButton type="button" disabled={busy} onClick={() => { void chat.openConversation(null) }}>
          <span aria-hidden="true">+</span>{t("Nova conversa")}
        </S.NewConversationButton>
        <S.ConversationPicker>
          <label htmlFor="assistant-conversation">{t("Suas conversas")}</label>
          <S.SelectWrapper>
            <select id="assistant-conversation" value={chat.conversationId ?? ''} disabled={busy}
              onChange={(event) => { void chat.openConversation(event.target.value || null) }}>
              <option value="">{t("Suas conversas")}</option>
              {chat.conversations.map((conversation) => <option key={conversation.id} value={conversation.id}>{conversation.name}</option>)}
            </select>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </S.SelectWrapper>
        </S.ConversationPicker>
        <S.RefreshButton type="button" disabled={busy} onClick={chat.reload} aria-label={t("Atualizar histórico")} title={t("Atualizar histórico")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.5-1L20 9M4 15l2.4 3A7 7 0 0 0 17.9 17" /></svg>
        </S.RefreshButton>
      </S.ConversationControls>
      {chat.error && <SectionState error description={chat.error} onRetry={chat.sessionExpired ? retry : chat.reload} />}
      <S.Messages tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-busy={busy} aria-label={t("Conversa com o Assistente Aether")}>
        {chat.loading && <p role="status">{t("Carregando conversas…")}</p>}
        {isNewConversation && !chat.loading && !chat.error && <S.EmptyConversation>
          <S.EmptyIcon src={assistantIcon} alt="" aria-hidden="true" />
          <h2>{t("Como posso ajudar com suas análises hoje?")}</h2>
          <S.Suggestions aria-label={t("Sugestões para você")}>
            {suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={busy}
              onClick={() => { void chat.send(t(suggestion)) }}>{t(suggestion)}</button>)}
          </S.Suggestions>
        </S.EmptyConversation>}
        {chat.messages.map((message) => <S.Message key={message.id} $author={message.author}>
          {message.author === 'assistant' && <S.MessageAvatar aria-hidden="true"><img src={assistantIcon} alt="" /></S.MessageAvatar>}
          <p>{message.text}</p>
        </S.Message>)}
        {chat.sending && <p role="status">{t("O assistente está preparando uma resposta…")}</p>}
        <div ref={messagesEndRef} />
      </S.Messages>
      <S.ComposerArea>
        <S.Composer onSubmit={handleSubmit}>
          <label htmlFor="assistant-message">{t("Digite sua pergunta para o Assistente Aether")}</label>
          <textarea id="assistant-message" rows={1} value={chat.draft} maxLength={assistantMessageLimit} disabled={chat.sending}
            placeholder={t("Digite sua pergunta...")} onChange={(event) => chat.setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault(); void chat.send(chat.draft)
              }
            }} />
          <button type="submit" aria-label={t("Enviar mensagem")} disabled={busy || !chat.draft.trim()}><img src={sendIcon} alt="" aria-hidden="true" /></button>
        </S.Composer>
      </S.ComposerArea>
    </S.Content>
  </S.Page>
}
export default AssistantPage
