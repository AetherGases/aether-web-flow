import { createClient } from 'redis'
import { RedisStore } from 'connect-redis'
import { createApp } from './app.ts'
import { readConfig } from './config/index.ts'

const config = readConfig(process.env)
const redis = config.REDIS_URL ? createClient({ url: config.REDIS_URL }) : undefined
redis?.on('error', () => process.stderr.write('Conexão de sessões indisponível.\n'))
if (redis) await redis.connect()
const store = redis ? new RedisStore({ client: redis, prefix: 'aether:web:sessions:' }) : undefined
const server = createApp(config, store).listen(config.PORT, config.HOST, () => {
  process.stdout.write(`BFF iniciado na porta ${config.PORT}.\n`)
})
server.requestTimeout = 15000
server.headersTimeout = 10000
server.on('error', () => { process.stderr.write('Falha ao iniciar o BFF. Verifique host e porta.\n'); process.exitCode = 1 })

let closing = false
function shutdown() {
  if (closing) return
  closing = true
  const deadline = setTimeout(() => { server.closeAllConnections(); process.exitCode = 1 }, 10000)
  deadline.unref()
  server.close(() => {
    clearTimeout(deadline)
    void redis?.close()
  })
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
