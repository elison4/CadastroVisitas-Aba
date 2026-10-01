import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import AutoCadastro from './pages/AutoCadastro'
import Identificacao from './pages/Identificacao'
import Dashboard from './pages/Dashboard'
import Visitantes from './pages/Visitantes'
import Visitas from './pages/Visitas'
import Usuarios from './pages/Usuarios'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/identificacao"
          element={<Identificacao />}
        />

        <Route
          path="/auto-cadastro"
          element={<AutoCadastro />}
        />

        {/* Dashboard
            ADMIN e OPERADOR */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              perfis={[
                'ADMIN',
                'OPERADOR',
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Visitantes
            ADMIN, OPERADOR e CONSULTA */}
        <Route
          path="/visitantes"
          element={
            <ProtectedRoute
              perfis={[
                'ADMIN',
                'OPERADOR',
                'CONSULTA',
              ]}
            >
              <Visitantes />
            </ProtectedRoute>
          }
        />

        {/* Visitas
            ADMIN, OPERADOR e CONSULTA */}
        <Route
          path="/visitas"
          element={
            <ProtectedRoute
              perfis={[
                'ADMIN',
                'OPERADOR',
                'CONSULTA',
              ]}
            >
              <Visitas />
            </ProtectedRoute>
          }
        />

        {/* Usuários
            somente ADMIN */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute
              perfis={['ADMIN']}
            >
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* Qualquer rota inexistente */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App