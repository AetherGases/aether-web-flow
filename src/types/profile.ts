export interface ProfilePersonal {
  id: number
  fullName: string
  email: string
  cpf: string | null
  phone: string | null
}
export interface ProfileData extends ProfilePersonal {
  department: { id: number; name: string } | null
  enterprise: { id: number; name: string } | null
  unit: { id: number; address: { neighborhood: string; city: string; state: string } | null } | null
}
export interface ProfileUpdate {
  name?: string
  phone?: string
}
export interface ProfileErrors {
  name?: string
  phone?: string
}
