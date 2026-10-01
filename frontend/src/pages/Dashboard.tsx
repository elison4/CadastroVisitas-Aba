import { useEffect, useState } from 'react'
import { api } from '../services/api'
import AdminLayout from '../components/AdminLayout'
import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusLogo from '../components/AbadeusLogo'
import AbadeusFooter from '../components/AbadeusFooter'

interface Visitante {
  id: number
  nome_completo: string
  email?: string
  telefone?: string
  instituicao?: string
  menor?: boolean
}

interface Visita {
  id: number
  visitante_id: number
  nome_completo: string
  menor: boolean
  data_hora_entrada: string
  finalidade?: string | null
}

function Dashboard() {
  const [visitantes, setVisitantes] = useState<
    Visitante[]
  >([])

  const [visitas, setVisitas] = useState<Visita[]>(
    [],
  )

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true)
        setErro('')

        const [
          respostaVisitantes,
          respostaVisitas,
        ] = await Promise.all([
          api.get('/visitantes'),
          api.get('/visitas'),
        ])

        setVisitantes(respostaVisitantes.data)
        setVisitas(respostaVisitas.data)
      } catch (error: any) {
        console.error(
          'Erro ao carregar dados do dashboard:',
          error.response?.data || error,
        )

        setErro(
          error.response?.data?.message ||
            'Não foi possível carregar os dados do dashboard.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const totalVisitantes = visitantes.length

  const totalMenores = visitantes.filter(
    (visitante) => visitante.menor === true,
  ).length

  const totalMaiores =
    totalVisitantes - totalMenores

  const totalVisitas = visitas.length

  const visitasRecentes = visitas.slice(0, 5)

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
                    Dashboard
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58595B]/65">
                    Acompanhe os principais dados de
                    visitantes e entradas.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#296589] text-xl text-white shadow-sm sm:h-16 sm:w-16 sm:text-2xl">
                  📊
                </div>
              </div>
            </header>

            {/* Carregamento */}
            {carregando && (
              <div className="abadeus-card p-8 text-center sm:p-10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#296589]/10 text-xl text-[#296589]">
                  …
                </div>

                <p className="font-medium text-[#58595B]/65">
                  Carregando informações...
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

            {!carregando && !erro && (
              <>
                {/* Indicadores */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Visitantes */}
                  <div className="abadeus-card relative overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-[#296589]" />

                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#58595B]/65">
                        Visitantes
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#296589]/10 text-xl">
                        👥
                      </span>
                    </div>

                    <strong className="text-3xl font-bold text-[#296589] sm:text-4xl">
                      {totalVisitantes}
                    </strong>

                    <p className="mt-2 text-sm text-[#58595B]/60">
                      pessoas cadastradas
                    </p>
                  </div>

                  {/* Visitas */}
                  <div className="abadeus-card relative overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-[#F29422]" />

                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#58595B]/65">
                        Visitas
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F29422]/15 text-xl">
                        📋
                      </span>
                    </div>

                    <strong className="text-3xl font-bold text-[#F29422] sm:text-4xl">
                      {totalVisitas}
                    </strong>

                    <p className="mt-2 text-sm text-[#58595B]/60">
                      entradas registradas
                    </p>
                  </div>

                  {/* Maiores */}
                  <div className="abadeus-card relative overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-[#615CA5]" />

                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#58595B]/65">
                        Maiores de idade
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#615CA5]/10 text-lg font-bold text-[#615CA5]">
                        ✓
                      </span>
                    </div>

                    <strong className="text-3xl font-bold text-[#615CA5] sm:text-4xl">
                      {totalMaiores}
                    </strong>

                    <p className="mt-2 text-sm text-[#58595B]/60">
                      visitantes adultos
                    </p>
                  </div>

                  {/* Menores */}
                  <div className="abadeus-card relative overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
                    <div className="absolute left-0 top-0 h-1.5 w-full bg-[#CC464D]" />

                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#58595B]/65">
                        Menores de idade
                      </span>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CC464D]/10 text-xl">
                        🧒
                      </span>
                    </div>

                    <strong className="text-3xl font-bold text-[#CC464D] sm:text-4xl">
                      {totalMenores}
                    </strong>

                    <p className="mt-2 text-sm text-[#58595B]/60">
                      visitantes menores
                    </p>
                  </div>
                </div>

                {/* Últimas visitas */}
                <section className="abadeus-card mt-6 overflow-hidden sm:mt-8">
                  <div className="border-b border-[#58595B]/10 px-5 py-5 sm:px-8 sm:py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="mb-3 h-px w-16 border-t-2 border-dashed border-[#58595B]/25 sm:w-20" />

                        <h2 className="text-xl font-bold text-[#58595B] sm:text-2xl">
                          Últimas visitas
                        </h2>

                        <p className="mt-1 text-sm text-[#58595B]/60">
                          Registros mais recentes do
                          sistema.
                        </p>
                      </div>

                      <div className="w-fit rounded-xl bg-[#EBE1D7] px-4 py-2 text-sm font-semibold text-[#58595B]">
                        {visitasRecentes.length}{' '}
                        registro
                        {visitasRecentes.length !==
                        1
                          ? 's'
                          : ''}
                      </div>
                    </div>
                  </div>

                  {visitasRecentes.length === 0 ? (
                    <div className="p-8 text-center sm:p-10">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EBE1D7] text-xl">
                        📋
                      </div>

                      <p className="font-medium text-[#58595B]/60">
                        Nenhuma visita registrada.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px]">
                        <thead>
                          <tr className="border-b border-[#58595B]/10 bg-[#EBE1D7]/45">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                              Visitante
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                              Finalidade
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#58595B]/65">
                              Entrada
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#58595B]/10">
                          {visitasRecentes.map(
                            (visita) => (
                              <tr
                                key={visita.id}
                                className="transition hover:bg-[#296589]/5"
                              >
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#296589]/10 text-sm font-bold text-[#296589]">
                                      {visita.nome_completo
                                        .charAt(
                                          0,
                                        )
                                        .toUpperCase()}
                                    </span>

                                    <div>
                                      <div className="font-semibold text-[#58595B]">
                                        {
                                          visita.nome_completo
                                        }
                                      </div>

                                      <div className="mt-1 text-xs text-[#58595B]/45">
                                        Visitante #
                                        {
                                          visita.visitante_id
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-5">
                                  <span className="inline-flex rounded-full bg-[#615CA5]/10 px-3 py-1.5 text-sm font-medium text-[#615CA5]">
                                    {visita.finalidade ||
                                      'Não informada'}
                                  </span>
                                </td>

                                <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#58595B]/70">
                                  {formatarData(
                                    visita.data_hora_entrada,
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

                {/* Divisor visual */}
                <div className="mt-8 flex justify-center">
                  <div className="w-32 border-t-2 border-dashed border-[#58595B]/20 sm:w-40" />
                </div>
              </>
            )}
          </div>
        </div>

        <AbadeusFooter />
      </AbadeusBackground>
    </AdminLayout>
  )
}

export default Dashboard