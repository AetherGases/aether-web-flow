import { useTranslation } from '../../hooks/useTranslation'
import { type FormEvent, useEffect, useMemo, useRef } from 'react'
import { useAssistant } from '../../hooks/useAssistant'
import { useAuth } from '../../hooks/useAuth'
import { assistantMessageLimit } from '../../services/assistant'
import assistantAvatarBackground from '../../assets/icons/chatbot/assistant-avatar-background.svg'
import assistantIcon from '../../assets/icons/chatbot/assistant-icon.svg'
import sendIcon from '../../assets/icons/chatbot/send-icon.svg'
import Sidebar from '../../components/Sidebar'
import SectionState from '../../components/SectionState'
import * as S from './styles'

const suggestions = ['Como posso reduzir as emissões da empresa?', 'Explique os escopos de emissões', 'Como interpretar meu relatório?']

function AssistantPage() {
  const { t } = useTranslation()
  const { user, logout, retry } = useAuth()
  const chat = useAssistant()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  }, [])
  useEffect(() => {
    if (chat.messages.length) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chat.messages])
  if (!user) return null
  const busy = chat.sending || chat.loading
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void chat.send(chat.draft) }

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content>
      <S.Header><h4 id="id-page">{t("Assistente IA")}</h4><h1>{t("Assistente Aether")}</h1></S.Header>
      <S.SummaryCard>
        <S.AssistantAvatar aria-hidden="true"><img src={assistantAvatarBackground} alt="" /><img src={assistantIcon} alt="" /></S.AssistantAvatar>
        <S.SummaryText>
          <strong>{t(greeting)}, {user.name.trim().split(/\s+/)[0]}!</strong>
          <p>{t("Como posso ajudar com suas análises hoje?")}</p>
        </S.SummaryText>
        <S.ReviewButton type="button" disabled={busy} onClick={() => { void chat.openConversation(null) }}>{t("Nova conversa")}</S.ReviewButton>
      </S.SummaryCard>
      <S.ConversationControls>
        <label htmlFor="assistant-conversation">{t("Suas conversas")}</label>
        <select id="assistant-conversation" value={chat.conversationId ?? ''} disabled={chat.sending || chat.loading}
          onChange={(event) => { void chat.openConversation(event.target.value || null) }}>
          <option value="">{t("Nova conversa")}</option>
          {chat.conversations.map((conversation) => <option key={conversation.id} value={conversation.id}>{conversation.name}</option>)}
        </select>
        <button type="button" disabled={busy} onClick={chat.reload}>{t("Atualizar histórico")}</button>
      </S.ConversationControls>
      {chat.error && <SectionState error description={chat.error} onRetry={chat.sessionExpired ? retry : chat.reload} />}
      <S.Messages role="log" aria-live="polite" aria-relevant="additions" aria-busy={busy} aria-label={t("Conversa com o Assistente Aether")}>
        {chat.loading && <p role="status">{t("Carregando conversas…")}</p>}
        {!chat.loading && !chat.messages.length && !chat.error && <p>{t("Envie uma mensagem para começar ou selecione uma conversa.")}</p>}
        {chat.messages.map((message) => <S.Message key={message.id} $author={message.author}>
          {message.author === 'assistant' && <S.MessageAvatar aria-hidden="true"><img src={assistantIcon} alt="" /></S.MessageAvatar>}
          <p>{message.text}</p>
        </S.Message>)}
        {chat.sending && <p role="status">{t("O assistente está preparando uma resposta…")}</p>}
        <div ref={messagesEndRef} />
      </S.Messages>
      <S.ComposerArea>
        <h2>{t("Sugestões para você")}</h2>
        <S.Suggestions>{suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={busy}
          onClick={() => { void chat.send(t(suggestion)) }}>{t(suggestion)}</button>)}</S.Suggestions>
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
