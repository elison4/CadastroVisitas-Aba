import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'

type Perfil =
  | 'ADMIN'
  | 'OPERADOR'
  | 'CONSULTA'

interface Usuario {
  id: number
  nome_completo: string
  email: string
  perfil: Perfil
}

interface AuthContextData {
  usuario: Usuario | null
  token: string | null
  estaAutenticado: boolean
  login: (token: string, usuario: Usuario) => void
  logout: () => void
}

const AuthContext = createContext<
  AuthContextData | undefined
>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const usuarioSalvo =
      localStorage.getItem('usuario')

    if (!usuarioSalvo) {
      return null
    }

    try {
      return JSON.parse(usuarioSalvo)
    } catch {
      localStorage.removeItem('usuario')
      return null
    }
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario),
      )
    } else {
      localStorage.removeItem('usuario')
    }
  }, [usuario])

  function login(
    novoToken: string,
    novoUsuario: Usuario,
  ) {
    setToken(novoToken)
    setUsuario(novoUsuario)
  }

  function logout() {
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider.',
    )
  }

  return contexto
}
