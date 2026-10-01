import { useNavigate } from 'react-router-dom'

import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusFooter from '../components/AbadeusFooter'
import AbadeusLogo from '../components/AbadeusLogo'

function Inicio() {
  const navigate = useNavigate()

  return (
    <AbadeusBackground>
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-xl">
          <div className="mb-7 text-center sm:mb-8">
            <AbadeusLogo
              className="mb-7 justify-center sm:mb-8"
              mostrarTexto
            />

            <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#F29422]" />

            <h1 className="text-3xl font-bold tracking-tight text-[#58595B] sm:text-4xl lg:text-5xl">
              Olá, bem-vindo à Abadeus!
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#58595B]/75 sm:text-lg">
              Vamos começar seu atendimento.
              <br />
              Escolha uma das opções abaixo.
            </p>
          </div>

          <div className="abadeus-card p-5 sm:p-8">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  navigate('/identificacao')
                }
                className="abadeus-button flex min-h-14 w-full items-center justify-center gap-3 bg-[#296589] px-5 py-4 text-base font-bold text-white hover:bg-[#215473] sm:px-6"
              >
                <span className="text-xl">
                  👤
                </span>

                <span>
                  Já possuo cadastro
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate('/auto-cadastro')
                }
                className="abadeus-button flex min-h-14 w-full items-center justify-center gap-3 border-2 border-[#CC464D] bg-white px-5 py-4 text-base font-bold text-[#CC464D] hover:bg-[#CC464D] hover:text-white sm:px-6"
              >
                <span className="text-xl">
                  ✚
                </span>

                <span>
                  Não possuo cadastro
                </span>
              </button>

              <div className="my-6 flex items-center gap-3 sm:gap-4">
                <div className="h-px flex-1 border-t border-dashed border-[#58595B]/30" />

                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#58595B]/50 sm:text-xs sm:tracking-[0.18em]">
                  acesso restrito
                </span>

                <div className="h-px flex-1 border-t border-dashed border-[#58595B]/30" />
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/login')
                }
                className="abadeus-button-outline flex min-h-12 w-full items-center justify-center gap-3 px-5 py-3 text-sm font-semibold sm:px-6"
              >
                <span>🔐</span>

                <span>
                  Acesso administrativo
                </span>
              </button>
            </div>
          </div>

          <div className="mt-7 text-center sm:mt-8">
            <span className="text-2xl text-[#FFBD59]">
              ✦
            </span>

            <p className="mt-2 text-xs leading-5 text-[#58595B]/55 sm:text-sm">
              Atendimento • Cadastro • Registro de
              visitas
            </p>
          </div>
        </div>
      </div>

      <AbadeusFooter />
    </AbadeusBackground>
  )
}

export default Inicio