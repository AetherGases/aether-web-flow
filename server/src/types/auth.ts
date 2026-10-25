import { z } from 'zod'

export const roleSchema = z.enum(['analyst', 'administrator'])
export type UserRole = z.infer<typeof roleSchema>

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
}).strict()

export const tokenSchema = z.object({
  email: z.string().email(),
  authenticated: z.literal(true),
  expiration: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  role: roleSchema,
})

export const profileSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
})

export type TokenResponse = z.infer<typeof tokenSchema>
export interface SessionUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthSession {
  user: SessionUser
  accessToken: string
  refreshToken: string
  expiresAt: number
  absoluteExpiresAt: number
}

declare module 'express-session' {
  interface SessionData {
    auth?: AuthSession
  }
}
