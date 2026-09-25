import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import assistantAvatarBackground from '../../assets/icons/chatbot/assistant-avatar-background.svg'
import assistantIcon from '../../assets/icons/chatbot/assistant-icon.svg'
import potentialSavingsChart from '../../assets/icons/chatbot/potential-savings-chart.svg'
import sendIcon from '../../assets/icons/chatbot/send-icon.svg'
import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'

const suggestions = [
  'Por que o consumo da Planta 04 aumentou?',
  'Compare as plantas com maior custo',
  'Analise minha última planta',
]

interface ChatMessage {
  id: number
  author: 'user' | 'assistant'
  text: string
}

interface AssistantPageProps {
  data: OverviewData
  onLogout: () => void
}

function findMetric(data: OverviewData, id: string) {
  return data.metrics.find((metric) => metric.id === id)
}

function createLocalResponse() {
  return 'Esta é uma resposta de teste do Assistente Aether. A integração com a IA será realizada posteriormente.'
}

function AssistantPage({ data, onLogout }: AssistantPageProps) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const nextMessageIdRef = useRef(1)

  const anomalies = findMetric(data, 'critical-anomalies')?.value ?? '0'
  const economy = findMetric(data, 'total-economy')?.value ?? 'R$ 0'
  const firstName = data.userName.trim().split(/\s+/)[0]

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [messages])

  function sendMessage(text: string) {
    const trimmedMessage = text.trim()
    if (!trimmedMessage) return

    const userMessageId = nextMessageIdRef.current
    const assistantMessageId = userMessageId + 1
    nextMessageIdRef.current += 2
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: userMessageId, author: 'user', text: trimmedMessage },
      {
        id: assistantMessageId,
        author: 'assistant',
        text: createLocalResponse(),
      },
    ])
    setDraft('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage(draft)
  }

  return (
    <S.Page>
      <Sidebar 
        userName={data.userName} 
        userRole={data.role} 
        onLogout={onLogout} 
      />

      <S.Content>
        <S.Header>
          <h4 id='id-page'>Assistente IA</h4>
          <div>
            < h1>Assistente Aether</h1>
          </div>
        </S.Header>

        <S.SummaryCard>
          <S.AssistantAvatar aria-hidden="true">
            <img src={assistantAvatarBackground} alt="" />
            <img src={assistantIcon} alt="" />
          </S.AssistantAvatar>

          <S.SummaryText>
            <strong>{greeting}, {firstName}. Há uma oportunidade importante.</strong>
            <p>Encontrei {anomalies} anomalias nas plantas analisadas, com economia potencial estimada em {economy}.</p>
            <S.ReviewButton type="button">Revisar anomalias</S.ReviewButton>
          </S.SummaryText>

          <S.EconomyCard>
            <span>Economia potencial encontrada</span>
            <strong>{economy}</strong>
            <img src={potentialSavingsChart} alt="Tendência crescente da economia potencial" />
          </S.EconomyCard>
        </S.SummaryCard>

        <S.Messages aria-live="polite" aria-label="Conversa com o Assistente Aether">
          {messages.map((message) => (
            <S.Message key={message.id} $author={message.author}>
              {message.author === 'assistant' && (
                <S.MessageAvatar aria-hidden="true">
                  <img src={assistantIcon} alt="" />
                </S.MessageAvatar>
              )}
              <p>{message.text}</p>
            </S.Message>
          ))}
          <div ref={messagesEndRef} />
        </S.Messages>

        <S.ComposerArea>
          <h2>Sugestões para você</h2>
          <S.Suggestions>
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </S.Suggestions>

          <S.Composer onSubmit={handleSubmit}>
            <label htmlFor="assistant-message">Digite sua pergunta para o Assistente Aether</label>
            <textarea
              id="assistant-message"
              rows={1}
              value={draft}
              placeholder="Digite sua pergunta..."
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage(draft)
                }
              }}
            />
            <button type="submit" aria-label="Enviar mensagem" disabled={!draft.trim()}>
              <img src={sendIcon} alt="" aria-hidden="true" />
            </button>
          </S.Composer>
        </S.ComposerArea>
      </S.Content>
    </S.Page>
  )
}

export default AssistantPage
