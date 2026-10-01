import { Link } from 'react-router-dom'

import AbadeusLogo from './AbadeusLogo'

function AbadeusFooter() {
  return (
    <footer className="border-t border-[#58595B]/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Identidade */}
          <div>
            <AbadeusLogo />

            <div className="mt-4 h-px w-20 border-t-2 border-dashed border-[#58595B]/20" />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#58595B]/65">
              Atendimento, cadastro e registro de
              visitas de forma simples e organizada.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#58595B]">
              Acesso rápido
            </h2>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm font-medium text-[#58595B]/65 transition hover:text-[#296589]"
              >
                Início
              </Link>

              <Link
                to="/identificacao"
                className="text-sm font-medium text-[#58595B]/65 transition hover:text-[#296589]"
              >
                Já possuo cadastro
              </Link>

              <Link
                to="/auto-cadastro"
                className="text-sm font-medium text-[#58595B]/65 transition hover:text-[#CC464D]"
              >
                Não possuo cadastro
              </Link>

              <Link
                to="/login"
                className="text-sm font-medium text-[#58595B]/65 transition hover:text-[#615CA5]"
              >
                Acesso administrativo
              </Link>
            </div>
          </div>

          {/* Atendimento */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#58595B]">
              Atendimento
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#58595B]/65">
              Utilize o sistema para realizar seu
              cadastro e registrar sua visita.
            </p>

            <div className="mt-5 rounded-2xl border border-[#296589]/10 bg-[#296589]/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#296589]">
                Registro de visitas
              </p>

              <p className="mt-1 text-sm text-[#58595B]/65">
                Sistema de atendimento Abadeus.
              </p>
            </div>
          </div>
        </div>

        <div className="my-8 border-t-2 border-dashed border-[#58595B]/15" />

        {/* Créditos */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-[#FFBD59]">
              ✦
            </span>

            <p className="text-xs text-[#58595B]/55 sm:text-sm">
              © 2026 Abadeus. Todos os direitos
              reservados.
            </p>
          </div>

          <p className="text-xs text-[#58595B]/55 sm:text-sm">
            Desenvolvido por{' '}
            <span className="font-bold text-[#296589]">
              Elison Miller
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default AbadeusFooter