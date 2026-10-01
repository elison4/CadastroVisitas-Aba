import { useEffect, useState } from 'react'
import { api } from '../services/api'
import AdminLayout from '../components/AdminLayout'
import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusLogo from '../components/AbadeusLogo'
import AbadeusFooter from '../components/AbadeusFooter'

interface Visita {
  id: number
  visitante_id: number
  nome_completo: string
  telefone?: string | null
  email?: string | null
  instituicao?: string | null
  menor: boolean
  data_hora_entrada: string
  finalidade?: string | null
  criado_em: string
}

function Visitas() {
  const [visitas, setVisitas] = useState<Visita[]>(
    [],
  )

  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] =
    useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarVisitas() {
      try {
        setCarregando(true)
        setErro('')

        const resposta =
          await api.get('/visitas')

        setVisitas(resposta.data)
      } catch (error: any) {
        console.error(
          'Erro ao carregar visitas:',
          error.response?.data || error,
        )

        setErro(
          error.response?.data?.message ||
            'Não foi possível carregar as visitas.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarVisitas()
  }, [])

  const visitasFiltradas =
    visitas.filter((visita) => {
      const termo = busca
        .toLowerCase()
        .trim()

      if (!termo) {
        return true
      }

      return (
        visita.nome_completo
          .toLowerCase()
          .includes(termo) ||
        visita.email
          ?.toLowerCase()
          .includes(termo) ||
        visita.instituicao
          ?.toLowerCase()
          .includes(termo) ||
        visita.finalidade
          ?.toLowerCase()
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
      <AbadeusBackground>
        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            {/* Cabeçalho */}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-5 rounded-3xl border border-[#58595B]/10 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <AbadeusLogo />

                  <div className="mt-4 h-px w-24 border-t-2 border-dashed border-[#58595B]/25 sm:w-28" />

                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#58595B] sm:text-3xl">
                    Visitas
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58595B]/65">
                    Consulte o histórico de entradas
                    registradas no sistema.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F29422] text-xl text-white shadow-sm sm:h-16 sm:w-16 sm:text-2xl">
                  📋
                </div>
              </div>
            </header>

            {/* Busca */}
            <section className="abadeus-card mb-6 p-5 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F29422]/10 text-lg">
                  🔎
                </span>

                <div className="min-w-0">
                  <h2 className="font-bold text-[#58595B]">
                    Buscar visita
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#58595B]/55">
                    Pesquise por nome, e-mail,
                    instituição ou finalidade.
                  </p>
                </div>
              </div>

              <input
                id="busca-visita"
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Nome, e-mail, instituição ou finalidade..."
                className="abadeus-input"
              />
            </section>

            {/* Carregamento */}
            {carregando && (
              <div className="abadeus-card p-8 text-center sm:p-10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F29422]/10 text-xl text-[#F29422]">
                  …
                </div>

                <p className="font-medium text-[#58595B]/65">
                  Carregando visitas...
                </p>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div className="rounded-2xl border border-[#CC464D]/25 bg-[#CC464D]/10 p-5 text-[#CC464D] sm:p-6">
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

            {/* Histórico */}
            {!carregando && !erro && (
              <section className="abadeus-card overflow-hidden">
                <div className="border-b border-[#58595B]/10 px-5 py-5 sm:px-8 sm:py-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-3 h-px w-16 border-t-2 border-dashed border-[#58595B]/25 sm:w-20" />

                      <h2 className="text-xl font-bold text-[#58595B] sm:text-2xl">
                        Histórico de visitas
                      </h2>

                      <p className="mt-1 text-sm text-[#58595B]/60">
                        {visitasFiltradas.length}{' '}
                        visita(s) encontrada(s)
                      </p>
                    </div>

                    <div className="w-fit rounded-xl bg-[#EBE1D7] px-4 py-2 text-sm font-bold text-[#58595B]">
                      {visitas.length} registros
                    </div>
                  </div>
                </div>

                {visitasFiltradas.length === 0 ? (
                  <div className="p-8 text-center sm:p-10">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EBE1D7] text-xl">
                      📋
                    </div>

                    <p className="font-medium text-[#58595B]/70">
                      Nenhuma visita encontrada.
                    </p>

                    {busca && (
                      <p className="mt-2 text-sm text-[#58595B]/50">
                        Tente buscar por outro termo.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px]">
                      <thead>
                        <tr className="border-b border-[#58595B]/10 bg-[#EBE1D7]/45">
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                            Visitante
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                            Instituição
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                            Finalidade
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                            Entrada
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                            Classificação
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#58595B]/10">
                        {visitasFiltradas.map(
                          (visita) => (
                            <tr
                              key={visita.id}
                              className="transition hover:bg-[#296589]/5"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#296589]/10 text-sm font-bold text-[#296589]">
                                    {visita.nome_completo
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>

                                  <div>
                                    <div className="font-semibold text-[#58595B]">
                                      {
                                        visita.nome_completo
                                      }
                                    </div>

                                    <div className="mt-1 text-xs text-[#58595B]/45">
                                      Visita #
                                      {visita.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-5 text-sm font-medium text-[#58595B]/65">
                                {visita.instituicao ||
                                  'Não informada'}
                              </td>

                              <td className="px-6 py-5">
                                <span className="inline-flex rounded-full bg-[#615CA5]/10 px-3 py-1.5 text-xs font-bold text-[#615CA5]">
                                  {visita.finalidade ||
                                    'Não informada'}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#58595B]/65">
                                {formatarData(
                                  visita.data_hora_entrada,
                                )}
                              </td>

                              <td className="px-6 py-5">
                                {visita.menor ? (
                                  <span className="inline-flex rounded-full bg-[#F29422]/15 px-3 py-1.5 text-xs font-bold text-[#F29422]">
                                    Menor
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-[#296589]/10 px-3 py-1.5 text-xs font-bold text-[#296589]">
                                    Maior
                                  </span>
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

            {/* Divisor visual */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 border-t-2 border-dashed border-[#58595B]/20 sm:w-40" />
            </div>
          </div>
        </div>

        <AbadeusFooter />
      </AbadeusBackground>
    </AdminLayout>
  )
}

export default Visitas