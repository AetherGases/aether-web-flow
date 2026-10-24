export interface ProfileData {
  id: number
  fullName: string
  email: string
  cpf: string | null
  phone: string | null
}
export interface ProfileUpdate {
  name?: string
  phone?: string
}
export interface ProfileErrors {
  name?: string
  phone?: string
}
