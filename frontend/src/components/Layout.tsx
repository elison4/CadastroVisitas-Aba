import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Layout() {
  const { usuario, logout } = useAuth()

  function handleLogout() {
    logout()
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-64 flex-col bg-slate-900 text-white">
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-2xl font-bold">
            Aba Registro
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Registro de visitas
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/visitantes"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            Visitantes
          </NavLink>

          <NavLink
            to="/visitas"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            Visitas
          </NavLink>

          {usuario?.perfil === 'ADMIN' && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              Usuários
            </NavLink>
          )}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <div className="mb-4">
            <p className="font-medium">
              {usuario?.nome_completo}
            </p>

            <p className="text-sm text-slate-400">
              {usuario?.perfil}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout