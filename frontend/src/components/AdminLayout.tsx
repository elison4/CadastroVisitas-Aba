import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AbadeusLogo from './AbadeusLogo'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({
  children,
}: AdminLayoutProps) {
  const { usuario, logout } = useAuth()

  const [menuAberto, setMenuAberto] =
    useState(false)

  function sair() {
    logout()
    setMenuAberto(false)
  }

  function fecharMenu() {
    setMenuAberto(false)
  }

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean
  }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-[#296589] text-white shadow-sm'
        : 'text-[#58595B]/75 hover:bg-[#EBE1D7]/70 hover:text-[#296589]'
    }`

  const perfil = usuario?.perfil

  const podeVerDashboard =
    perfil === 'ADMIN' ||
    perfil === 'OPERADOR'

  const podeVerVisitantes =
    perfil === 'ADMIN' ||
    perfil === 'OPERADOR' ||
    perfil === 'CONSULTA'

  const podeVerVisitas =
    perfil === 'ADMIN' ||
    perfil === 'OPERADOR' ||
    perfil === 'CONSULTA'

  const podeVerUsuarios =
    perfil === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#EBE1D7]/30">
      {/* Barra superior mobile */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[#58595B]/10 bg-white px-4 shadow-sm lg:hidden">
        <AbadeusLogo />

        <button
          type="button"
          onClick={() =>
            setMenuAberto(!menuAberto)
          }
          aria-label={
            menuAberto
              ? 'Fechar menu'
              : 'Abrir menu'
          }
          aria-expanded={menuAberto}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#296589]/10 text-xl text-[#296589] transition hover:bg-[#296589]/15"
        >
          {menuAberto ? '✕' : '☰'}
        </button>
      </header>

      {/* Fundo escuro do menu mobile */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={fecharMenu}
          className="fixed inset-0 z-40 bg-[#58595B]/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[#58595B]/10 bg-white shadow-[4px_0_24px_rgba(88,89,91,0.08)] transition-transform duration-300 lg:z-40 lg:w-64 lg:translate-x-0 ${
          menuAberto
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho do menu */}
        <div className="relative border-b border-[#58595B]/10 px-5 py-6">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-1.5 bg-[#CC464D]"
          />

          <div
            aria-hidden="true"
            className="absolute right-0 top-0 h-1.5 w-1/3 bg-[#F29422]"
          />

          <div className="flex items-start justify-between gap-4">
            <div>
              <AbadeusLogo />

              <p className="mt-3 text-xs font-medium tracking-wide text-[#58595B]/55">
                Painel administrativo
              </p>
            </div>

            <button
              type="button"
              onClick={fecharMenu}
              aria-label="Fechar menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EBE1D7]/60 text-sm text-[#58595B]/70 transition hover:bg-[#CC464D]/10 hover:text-[#CC464D] lg:hidden"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 h-px w-24 border-t-2 border-dashed border-[#58595B]/20" />

          {usuario && (
            <div className="mt-5 rounded-2xl border border-[#296589]/15 bg-[#296589]/5 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#296589] text-sm font-bold text-white">
                  {usuario.nome_completo
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#58595B]">
                    {usuario.nome_completo}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#296589]">
                    Perfil: {usuario.perfil}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#58595B]/40">
            Navegação
          </p>

          {podeVerDashboard && (
            <NavLink
              to="/dashboard"
              className={linkClass}
              onClick={fecharMenu}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#296589]/10 text-base transition group-hover:bg-[#296589]/15">
                📊
              </span>

              <span>Dashboard</span>
            </NavLink>
          )}

          {podeVerVisitantes && (
            <NavLink
              to="/visitantes"
              className={linkClass}
              onClick={fecharMenu}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#615CA5]/10 text-base transition group-hover:bg-[#615CA5]/15">
                👥
              </span>

              <span>Visitantes</span>
            </NavLink>
          )}

          {podeVerVisitas && (
            <NavLink
              to="/visitas"
              className={linkClass}
              onClick={fecharMenu}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F29422]/10 text-base transition group-hover:bg-[#F29422]/15">
                📋
              </span>

              <span>Visitas</span>
            </NavLink>
          )}

          {podeVerUsuarios && (
            <NavLink
              to="/usuarios"
              className={linkClass}
              onClick={fecharMenu}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CC464D]/10 text-base transition group-hover:bg-[#CC464D]/15">
                👤
              </span>

              <span>Usuários</span>
            </NavLink>
          )}
        </nav>

        {/* Rodapé */}
        <div className="border-t border-[#58595B]/10 p-4">
          <div className="mb-4 h-px border-t-2 border-dashed border-[#58595B]/15" />

          <button
            type="button"
            onClick={sair}
            className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#58595B]/70 transition hover:bg-[#CC464D]/10 hover:text-[#CC464D]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CC464D]/10 text-base transition group-hover:bg-[#CC464D]/15">
              🚪
            </span>

            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="min-h-screen pt-20 lg:ml-64 lg:pt-0">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout