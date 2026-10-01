import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusFooter from '../components/AbadeusFooter'
import AbadeusLogo from '../components/AbadeusLogo'

import { fazerLogin } from '../services/auth'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      const resposta = await fazerLogin({
        email,
        senha,
      })

      login(
        resposta.access_token,
        resposta.usuario,
      )

      if (
        resposta.usuario.perfil === 'CONSULTA'
      ) {
        navigate('/visitantes')
      } else {
        navigate('/dashboard')
      }
    } catch {
      setErro(
        'E-mail ou senha inválidos. Verifique seus dados e tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AbadeusBackground>
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <AbadeusLogo
              className="mb-6 justify-center"
              mostrarTexto
            />

            <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-[#615CA5]" />

            <h1 className="text-3xl font-bold text-[#58595B] sm:text-4xl">
              Acesso administrativo
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#58595B]/70 sm:text-base">
              Entre com seus dados para acessar
              o sistema de registros.
            </p>
          </div>

          <div className="abadeus-card p-5 sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="abadeus-label"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="abadeus-input mt-2"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="abadeus-label"
                >
                  Senha
                </label>

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) =>
                    setSenha(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  required
                  autoComplete="current-password"
                  className="abadeus-input mt-2"
                />
              </div>

              {erro && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#CC464D]/30 bg-[#CC464D]/10 px-4 py-3 text-sm font-medium text-[#CC464D]"
                >
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="abadeus-button w-full bg-[#296589] px-6 py-4 font-bold text-white hover:bg-[#215473] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando
                  ? 'Entrando...'
                  : 'Entrar'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 sm:gap-4">
              <div className="h-px flex-1 border-t border-dashed border-[#58595B]/30" />

              <span className="shrink-0 text-[#F29422]">
                ✦
              </span>

              <div className="h-px flex-1 border-t border-dashed border-[#58595B]/30" />
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="abadeus-button-outline w-full px-6 py-3 text-sm font-semibold"
            >
              Voltar para o início
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-[#58595B]/50 sm:text-sm">
            Área restrita aos usuários autorizados.
          </p>
        </div>
      </div>

      <AbadeusFooter />
    </AbadeusBackground>
  )
}

export default Login