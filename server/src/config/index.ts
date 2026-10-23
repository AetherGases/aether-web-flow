import { z } from 'zod'

const origin = z.string().url().refine((value) => {
  const url = new URL(value)
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  return !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash &&
    (url.protocol === 'https:' || (local && url.protocol === 'http:'))
}, 'Use uma origem HTTPS ou HTTP local, sem caminho ou credenciais')

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  FRONTEND_ORIGIN: origin,
  MS_AUTH_URL: origin,
  MS_INVENTORY_URL: origin.optional(),
  SESSION_SECRET: z.string().trim().min(32),
  SESSION_MAX_AGE_MS: z.coerce.number().int().min(60000).max(86400000).default(28800000),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().int().min(100).max(60000).default(5000),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
  REDIS_URL: z.string().url().optional(),
}).superRefine((config, context) => {
  if (config.NODE_ENV === 'production' && (!config.REDIS_URL || !config.FRONTEND_ORIGIN.startsWith('https:') || !config.MS_AUTH_URL.startsWith('https:'))) {
    context.addIssue({ code: 'custom', message: 'Produção exige Redis e HTTPS no frontend/ms-auth' })
  }
  if (config.NODE_ENV === 'production' && config.MS_INVENTORY_URL && !config.MS_INVENTORY_URL.startsWith('https:')) {
    context.addIssue({ code: 'custom', path: ['MS_INVENTORY_URL'], message: 'Produção exige HTTPS no inventory' })
  }
  if (config.REDIS_URL && !['redis:', 'rediss:'].includes(new URL(config.REDIS_URL).protocol)) {
    context.addIssue({ code: 'custom', path: ['REDIS_URL'], message: 'URL Redis inválida' })
  }
})

export type Config = z.infer<typeof schema>

export function readConfig(env: NodeJS.ProcessEnv): Config {
  const result = schema.safeParse(env)
  if (!result.success) {
    throw new Error(`Configuração inválida: ${result.error.issues.map((issue) => issue.path.join('.') || 'produção').join(', ')}`)
  }
  return result.data
}
