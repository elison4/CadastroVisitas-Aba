import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type Perfil =
  | 'ADMIN'
  | 'OPERADOR'
  | 'CONSULTA'

interface ProtectedRouteProps {
  children: React.ReactNode
  perfis?: Perfil[]
}

function ProtectedRoute({
  children,
  perfis,
}: ProtectedRouteProps) {
  const { estaAutenticado, usuario } = useAuth()

  if (!estaAutenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    perfis &&
    !perfis.includes(usuario.perfil)
  ) {
    if (usuario.perfil === 'CONSULTA') {
      return (
        <Navigate
          to="/visitantes"
          replace
        />
      )
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute