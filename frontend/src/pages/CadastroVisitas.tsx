import { useEffect, useState } from 'react'
import { api } from '../services/api'

interface Visitante {
  id: number
  nome_completo: string
  telefone?: string | null
  email?: string | null
  instituicao?: string | null
  menor: boolean
}

function CadastroVisita() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [visitanteId, setVisitanteId] = useState('')
  const [finalidade, setFinalidade] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarVisitantes() {
      try {
        const resposta = await api.get<Visitante[]>('/visitantes')
        setVisitantes(resposta.data)
      } catch {
        setErro('Não foi possível carregar os visitantes.')
      } finally {
        setCarregando(false)
      }
    }

    carregarVisitantes()
  }, [])

  async function handleSubmit(
    event: React.SubmitEvent,
  ) {
    event.preventDefault()

    setMensagem('')
    setErro('')

    if (!visitanteId) {
      setErro('Selecione um visitante.')
      return
    }

    setSalvando(true)

    try {
      await api.post('/visitas', {
        visitante_id: Number(visitanteId),
        finalidade: finalidade || undefined,
      })

      setMensagem('Visita registrada com sucesso!')
      setVisitanteId('')
      setFinalidade('')
    } catch (error: any) {
      setErro(
        error.response?.data?.message ||
          'Não foi possível registrar a visita.',
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Cadastro de visita
        </h1>

        <p className="mt-2 text-slate-500">
          Registre a entrada de um visitante.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        {mensagem && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-green-700">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-600">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="visitante"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Visitante
            </label>

            <select
              id="visitante"
              value={visitanteId}
              onChange={(event) =>
                setVisitanteId(event.target.value)
              }
              disabled={carregando || salvando}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="">
                {carregando
                  ? 'Carregando visitantes...'
                  : 'Selecione um visitante'}
              </option>

              {visitantes.map((visitante) => (
                <option
                  key={visitante.id}
                  value={visitante.id}
                >
                  {visitante.nome_completo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="finalidade"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Finalidade da visita
            </label>

            <input
              id="finalidade"
              type="text"
              value={finalidade}
              onChange={(event) =>
                setFinalidade(event.target.value)
              }
              placeholder="Ex.: Reunião, atendimento, entrega..."
              disabled={salvando}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={salvando || carregando}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando
              ? 'Registrando...'
              : 'Registrar entrada'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CadastroVisita