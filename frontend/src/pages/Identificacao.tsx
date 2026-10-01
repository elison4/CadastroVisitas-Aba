import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusFooter from '../components/AbadeusFooter'
import AbadeusLogo from '../components/AbadeusLogo'

type Visitante = {
  id: number
  nome_completo: string
  email: string
  telefone?: string | null
  instituicao?: string | null
  menor: boolean
}

function Identificacao() {
  const navigate = useNavigate()

  const [valor, setValor] = useState('')
  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [visitanteSelecionado, setVisitanteSelecionado] =
    useState<Visitante | null>(null)

  const [carregando, setCarregando] = useState(false)
  const [registrando, setRegistrando] = useState(false)

  const [erro, setErro] = useState('')
  const [buscou, setBuscou] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleBuscar() {
    const termo = valor.trim()

    if (!termo) {
      return
    }

    setCarregando(true)
    setErro('')
    setVisitantes([])
    setVisitanteSelecionado(null)
    setBuscou(false)
    setSucesso(false)

    try {
      const resposta = await api.get('/busca-publica', {
        params: {
          valor: termo,
        },
      })

      setVisitantes(resposta.data)
      setBuscou(true)
    } catch (error) {
      console.error(error)

      setErro(
        'Não foi possível realizar a busca. Tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  function handleSelecionarVisitante(
    visitante: Visitante,
  ) {
    setVisitanteSelecionado(visitante)
    setErro('')
  }

  async function handleRegistrarEntrada() {
    if (!visitanteSelecionado) {
      return
    }

    setRegistrando(true)
    setErro('')

    try {
      await api.post('/visitas-publica', {
        visitante_id: visitanteSelecionado.id,
      })

      setSucesso(true)
    } catch (error: any) {
      console.error(error)

      setErro(
        error.response?.data?.message ||
          'Não foi possível registrar sua entrada. Tente novamente.',
      )
    } finally {
      setRegistrando(false)
    }
  }

  function handleNovoAtendimento() {
    setValor('')
    setVisitantes([])
    setVisitanteSelecionado(null)
    setBuscou(false)
    setSucesso(false)
    setErro('')
  }

  if (sucesso) {
    return (
      <AbadeusBackground>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-2xl">
            <div className="mb-7 text-center sm:mb-8">
              <AbadeusLogo
                className="mb-6 justify-center"
                mostrarTexto
              />

              <div className="mx-auto h-1 w-16 rounded-full bg-[#296589]" />
            </div>

            <div className="abadeus-card p-6 text-center sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#296589]/10 text-4xl font-bold text-[#296589]">
                ✓
              </div>

              <h1 className="mt-6 text-3xl font-bold text-[#58595B] sm:text-4xl">
                Entrada registrada!
              </h1>

              <p className="mt-4 text-base text-[#58595B]/70 sm:text-lg">
                Olá, {visitanteSelecionado?.nome_completo}.
              </p>

              <p className="mt-2 text-sm text-[#58595B]/60 sm:text-base">
                Sua entrada foi registrada com sucesso.
              </p>

              <button
                type="button"
                onClick={handleNovoAtendimento}
                className="abadeus-button mt-8 w-full bg-[#296589] px-6 py-4 text-base font-bold text-white hover:bg-[#215473] sm:text-lg"
              >
                Novo atendimento
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="abadeus-button-outline mt-4 w-full px-6 py-3 font-semibold"
              >
                Voltar para o início
              </button>
            </div>
          </div>
        </div>

        <AbadeusFooter />
      </AbadeusBackground>
    )
  }

  return (
    <AbadeusBackground>
      <div className="flex flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-center">
          <div className="w-full">
            <div className="mb-7 text-center sm:mb-8">
              <AbadeusLogo
                className="mb-6 justify-center"
                mostrarTexto
              />

              <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-[#296589]" />

              {!visitanteSelecionado ? (
                <>
                  <h1 className="text-3xl font-bold text-[#58595B] sm:text-4xl">
                    Já possui cadastro?
                  </h1>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#58595B]/70 sm:text-base">
                    Informe seu e-mail, telefone ou nome para
                    localizar seu cadastro.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[#58595B] sm:text-4xl">
                    Cadastro localizado!
                  </h1>

                  <p className="mt-3 text-sm text-[#58595B]/70 sm:text-base">
                    Confirme se os dados abaixo são seus.
                  </p>
                </>
              )}
            </div>

            <div className="abadeus-card p-5 sm:p-8">
              {!visitanteSelecionado ? (
                <>
                  <div>
                    <label
                      htmlFor="identificacao"
                      className="abadeus-label"
                    >
                      E-mail, telefone ou nome
                    </label>

                    <input
                      id="identificacao"
                      type="text"
                      value={valor}
                      onChange={(event) =>
                        setValor(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleBuscar()
                        }
                      }}
                      placeholder="Digite uma informação para localizar seu cadastro"
                      disabled={carregando}
                      className="abadeus-input mt-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleBuscar}
                    disabled={
                      !valor.trim() || carregando
                    }
                    className="abadeus-button mt-6 w-full bg-[#296589] px-6 py-4 text-base font-bold text-white hover:bg-[#215473] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                  >
                    {carregando
                      ? 'Buscando...'
                      : 'Continuar'}
                  </button>

                  {erro && (
                    <div
                      role="alert"
                      className="mt-6 rounded-xl border border-[#CC464D]/30 bg-[#CC464D]/10 px-4 py-4 text-center text-sm font-medium leading-5 text-[#CC464D]"
                    >
                      {erro}
                    </div>
                  )}

                  {buscou &&
                    visitantes.length === 0 &&
                    !erro && (
                      <div className="mt-8 rounded-2xl border border-dashed border-[#58595B]/20 bg-[#EBE1D7]/40 p-5 text-center sm:p-6">
                        <h2 className="text-xl font-bold text-[#58595B]">
                          Cadastro não encontrado
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#58595B]/65 sm:text-base">
                          Não encontramos nenhum cadastro
                          com essa informação.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            navigate('/auto-cadastro')
                          }
                          className="abadeus-button mt-5 w-full bg-[#CC464D] px-6 py-4 font-bold text-white hover:bg-[#B83D43]"
                        >
                          Realizar cadastro
                        </button>
                      </div>
                    )}

                  {visitantes.length > 0 && (
                    <div className="mt-8">
                      <h2 className="mb-4 text-xl font-bold text-[#58595B]">
                        Encontramos estes cadastros:
                      </h2>

                      <div className="space-y-4">
                        {visitantes.map((visitante) => (
                          <div
                            key={visitante.id}
                            className="rounded-2xl border border-[#58595B]/10 bg-white p-5 transition hover:border-[#296589]/40 hover:bg-[#296589]/5"
                          >
                            <h3 className="text-lg font-bold text-[#58595B]">
                              {visitante.nome_completo}
                            </h3>

                            <p className="mt-1 break-words text-sm text-[#58595B]/60">
                              {visitante.email}
                            </p>

                            {visitante.telefone && (
                              <p className="mt-1 text-sm text-[#58595B]/60">
                                {visitante.telefone}
                              </p>
                            )}

                            {visitante.instituicao && (
                              <p className="mt-1 text-sm text-[#58595B]/60">
                                {visitante.instituicao}
                              </p>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleSelecionarVisitante(
                                  visitante,
                                )
                              }
                              className="abadeus-button mt-4 w-full bg-[#296589] px-5 py-3 font-bold text-white hover:bg-[#215473]"
                            >
                              Sou eu
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="abadeus-button-outline mt-6 w-full px-6 py-3 font-semibold"
                  >
                    ← Voltar para o início
                  </button>
                </>
              ) : (
                <div>
                  <div className="mb-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#296589]/10 text-3xl font-bold text-[#296589]">
                      ✓
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#EBE1D7]/50 p-5 sm:p-6">
                    <div>
                      <p className="text-sm text-[#58595B]/55">
                        Nome
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#58595B]">
                        {visitanteSelecionado.nome_completo}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-dashed border-[#58595B]/15 pt-4">
                      <p className="text-sm text-[#58595B]/55">
                        E-mail
                      </p>

                      <p className="mt-1 break-words text-[#58595B]">
                        {visitanteSelecionado.email}
                      </p>
                    </div>

                    {visitanteSelecionado.telefone && (
                      <div className="mt-5 border-t border-dashed border-[#58595B]/15 pt-4">
                        <p className="text-sm text-[#58595B]/55">
                          Telefone
                        </p>

                        <p className="mt-1 text-[#58595B]">
                          {visitanteSelecionado.telefone}
                        </p>
                      </div>
                    )}

                    {visitanteSelecionado.instituicao && (
                      <div className="mt-5 border-t border-dashed border-[#58595B]/15 pt-4">
                        <p className="text-sm text-[#58595B]/55">
                          Instituição
                        </p>

                        <p className="mt-1 text-[#58595B]">
                          {visitanteSelecionado.instituicao}
                        </p>
                      </div>
                    )}
                  </div>

                  {erro && (
                    <div
                      role="alert"
                      className="mt-6 rounded-xl border border-[#CC464D]/30 bg-[#CC464D]/10 px-4 py-4 text-center text-sm font-medium leading-5 text-[#CC464D]"
                    >
                      {erro}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRegistrarEntrada}
                    disabled={registrando}
                    className="abadeus-button mt-6 w-full bg-[#296589] px-6 py-4 text-base font-bold text-white hover:bg-[#215473] disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                  >
                    {registrando
                      ? 'Registrando entrada...'
                      : 'Registrar minha entrada'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setVisitanteSelecionado(null)
                    }
                    disabled={registrando}
                    className="abadeus-button-outline mt-4 w-full px-6 py-3 font-semibold disabled:opacity-50"
                  >
                    ← Voltar para os resultados
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    disabled={registrando}
                    className="mt-2 w-full rounded-xl px-6 py-3 font-medium text-[#58595B]/60 transition hover:bg-[#EBE1D7]/50 disabled:opacity-50"
                  >
                    Voltar para o início
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AbadeusFooter />
    </AbadeusBackground>
  )
}

export default Identificacao