import { useEffect, useState } from 'react'
import { api } from '../services/api'
import AdminLayout from '../components/AdminLayout'
import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusLogo from '../components/AbadeusLogo'

interface Usuario {
  id: number
  nome_completo: string
  email: string
  perfil:
    | 'ADMIN'
    | 'OPERADOR'
    | 'CONSULTA'
  ativo: boolean
  criado_em: string
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState<
    Usuario[]
  >([])

  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] =
    useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        setCarregando(true)
        setErro('')

        const resposta =
          await api.get('/usuarios')

        setUsuarios(resposta.data)
      } catch (error: any) {
        console.error(
          'Erro ao carregar usuários:',
          error.response?.data || error,
        )

        setErro(
          error.response?.data?.message ||
            'Não foi possível carregar os usuários.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarUsuarios()
  }, [])

  const usuariosFiltrados =
    usuarios.filter((usuario) => {
      const termo = busca
        .toLowerCase()
        .trim()

      if (!termo) {
        return true
      }

      return (
        usuario.nome_completo
          .toLowerCase()
          .includes(termo) ||
        usuario.email
          .toLowerCase()
          .includes(termo) ||
        usuario.perfil
          .toLowerCase()
          .includes(termo)
      )
    })

  function formatarData(data: string) {
    return new Date(data).toLocaleString(
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    )
  }

  return (
    <AdminLayout>
      <AbadeusBackground className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <div className="flex flex-col gap-5 rounded-3xl border border-[#58595B]/10 bg-white/90 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <AbadeusLogo />

                <div className="mt-4 h-px w-28 border-t-2 border-dashed border-[#58595B]/25" />

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#58595B]">
                  Usuários
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#58595B]/65">
                  Consulte os usuários cadastrados
                  no sistema.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CC464D] text-2xl text-white shadow-sm">
                👤
              </div>
            </div>
          </header>

          <section className="abadeus-card mb-6 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CC464D]/10 text-lg">
                🔎
              </span>

              <div>
                <h2 className="font-bold text-[#58595B]">
                  Buscar usuário
                </h2>

                <p className="text-xs text-[#58595B]/55">
                  Pesquise por nome, e-mail ou perfil.
                </p>
              </div>
            </div>

            <input
              id="busca-usuario"
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
              placeholder="Nome, e-mail ou perfil..."
              className="abadeus-input"
            />
          </section>

          {carregando && (
            <div className="abadeus-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#CC464D]/10 text-xl text-[#CC464D]">
                …
              </div>

              <p className="font-medium text-[#58595B]/65">
                Carregando usuários...
              </p>
            </div>
          )}

          {erro && (
            <div className="rounded-2xl border border-[#CC464D]/25 bg-[#CC464D]/10 p-6 text-[#CC464D]">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#CC464D] text-sm font-bold text-white">
                  !
                </span>

                <p className="pt-1 text-sm font-semibold leading-6">
                  {erro}
                </p>
              </div>
            </div>
          )}

          {!carregando && !erro && (
            <section className="abadeus-card overflow-hidden">
              <div className="border-b border-[#58595B]/10 px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-3 h-px w-20 border-t-2 border-dashed border-[#58595B]/25" />

                    <h2 className="text-2xl font-bold text-[#58595B]">
                      Usuários cadastrados
                    </h2>

                    <p className="mt-1 text-sm text-[#58595B]/60">
                      {usuariosFiltrados.length}{' '}
                      usuário(s) encontrado(s)
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#EBE1D7] px-4 py-2 text-sm font-bold text-[#58595B]">
                    {usuarios.length} usuários
                  </div>
                </div>
              </div>

              {usuariosFiltrados.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EBE1D7] text-xl">
                    👤
                  </div>

                  <p className="font-medium text-[#58595B]/70">
                    Nenhum usuário encontrado.
                  </p>

                  {busca && (
                    <p className="mt-2 text-sm text-[#58595B]/50">
                      Tente buscar por outro termo.
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-[#58595B]/10 bg-[#EBE1D7]/45">
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                          Usuário
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                          Perfil
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                          Cadastro
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#58595B]/10">
                      {usuariosFiltrados.map(
                        (usuario) => (
                          <tr
                            key={usuario.id}
                            className="transition hover:bg-[#296589]/5"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CC464D]/10 text-sm font-bold text-[#CC464D]">
                                  {usuario.nome_completo
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>

                                <div>
                                  <div className="font-semibold text-[#58595B]">
                                    {
                                      usuario.nome_completo
                                    }
                                  </div>

                                  <div className="mt-1 text-sm text-[#58595B]/55">
                                    {usuario.email}
                                  </div>

                                  <div className="mt-1 text-xs text-[#58595B]/40">
                                    Usuário #
                                    {usuario.id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              {usuario.perfil ===
                              'ADMIN' ? (
                                <span className="inline-flex rounded-full bg-[#296589]/10 px-3 py-1.5 text-xs font-bold text-[#296589]">
                                  Administrador
                                </span>
                              ) : usuario.perfil ===
                                'OPERADOR' ? (
                                <span className="inline-flex rounded-full bg-[#F29422]/15 px-3 py-1.5 text-xs font-bold text-[#F29422]">
                                  Operador
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-[#615CA5]/10 px-3 py-1.5 text-xs font-bold text-[#615CA5]">
                                  Consulta
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              {usuario.ativo ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#296589]/10 px-3 py-1.5 text-xs font-bold text-[#296589]">
                                  <span className="h-2 w-2 rounded-full bg-[#296589]" />
                                  Ativo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#CC464D]/10 px-3 py-1.5 text-xs font-bold text-[#CC464D]">
                                  <span className="h-2 w-2 rounded-full bg-[#CC464D]" />
                                  Inativo
                                </span>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#58595B]/65">
                              {formatarData(
                                usuario.criado_em,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <div className="mt-8 flex justify-center">
            <div className="w-40 border-t-2 border-dashed border-[#58595B]/20" />
          </div>
        </div>
      </AbadeusBackground>
    </AdminLayout>
  )
}

export default Usuarios