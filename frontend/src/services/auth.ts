import { api } from './api'

export type Perfil =
  | 'ADMIN'
  | 'OPERADOR'
  | 'CONSULTA'

export interface LoginResponse {
  access_token: string
  usuario: {
    id: number
    nome_completo: string
    email: string
    perfil: Perfil
  }
}

export interface LoginData {
  email: string
  senha: string
}

export async function fazerLogin(
  dados: LoginData,
): Promise<LoginResponse> {
  const response =
    await api.post<LoginResponse>(
      '/auth/login',
      dados,
    )

  return response.data
}