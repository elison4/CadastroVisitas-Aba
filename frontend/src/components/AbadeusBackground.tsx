import type { ReactNode } from 'react'

interface AbadeusBackgroundProps {
  children: ReactNode
  className?: string
}

function AbadeusBackground({
  children,
  className = '',
}: AbadeusBackgroundProps) {
  return (
    <main
      className={`abadeus-page abadeus-textura relative flex min-h-screen flex-col ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-8 z-0 border-t-2 border-dashed border-[#58595B]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-0 right-0 z-0 border-t-2 border-dashed border-[#58595B]/15"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        {children}
      </div>
    </main>
  )
}

export default AbadeusBackground