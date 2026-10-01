interface AbadeusLogoProps {
  className?: string
  mostrarTexto?: boolean
}

function AbadeusLogo({
  className = '',
  mostrarTexto = true,
}: AbadeusLogoProps) {
  return (
    <div
      className={`flex items-center ${className}`}
    >
      {/*

        FUTURA LOGO ABADEUS

        Quando você tiver o arquivo da logo,
        colocaremos aqui:

        <img
          src="/src/assets/logo-abadeus.svg"
          alt="Abadeus"
        />

      */}

      {mostrarTexto && (
        <span className="text-lg font-bold tracking-[0.18em] text-[#296589]">
          ABADEUS
        </span>
      )}
    </div>
  )
}

export default AbadeusLogo