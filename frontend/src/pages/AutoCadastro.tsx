import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import { api } from '../services/api'
import AbadeusBackground from '../components/AbadeusBackground'
import AbadeusFooter from '../components/AbadeusFooter'
import AbadeusLogo from '../components/AbadeusLogo'

function AutoCadastro() {
  const [nomeCompleto, setNomeCompleto] =
    useState('')

  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [instituicao, setInstituicao] =
    useState('')

  const [menor, setMenor] = useState(false)
  const [finalidade, setFinalidade] =
    useState('')

  const [aceiteLgpd, setAceiteLgpd] =
    useState(false)

  const [foto, setFoto] =
    useState<Blob | null>(null)

  const [fotoPreview, setFotoPreview] =
    useState('')

  const [cameraAberta, setCameraAberta] =
    useState(false)

  const [erroCamera, setErroCamera] =
    useState('')

  const [salvando, setSalvando] =
    useState(false)

  const [sucesso, setSucesso] =
    useState('')

  const [erro, setErro] = useState('')

  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  function pararCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop())

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraAberta(false)
  }

  async function abrirCamera() {
    setErroCamera('')

    try {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setErroCamera(
          'Seu navegador não permite acesso à câmera.',
        )
        return
      }

      pararCamera()

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: 'user',
            },
            audio: false,
          },
        )

      streamRef.current = stream

      setCameraAberta(true)
    } catch (error: any) {
      console.error(
        'ERRO AO ACESSAR CÂMERA:',
        error,
      )

      setErroCamera(
        `Não foi possível acessar a câmera: ${
          error?.name ||
          'Erro desconhecido'
        }`,
      )
    }
  }

  useEffect(() => {
    if (!cameraAberta) {
      return
    }

    const video = videoRef.current
    const stream = streamRef.current

    if (!video || !stream) {
      return
    }

    video.srcObject = stream

    video.onloadedmetadata = async () => {
      try {
        await video.play()
      } catch (error) {
        console.error(
          'ERRO AO INICIAR VÍDEO:',
          error,
        )

        setErroCamera(
          'A câmera foi acessada, mas não foi possível iniciar a visualização.',
        )
      }
    }

    return () => {
      video.onloadedmetadata = null
    }
  }, [cameraAberta])

  function tirarFoto() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) {
      return
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setErroCamera(
        'A câmera ainda não está pronta. Tente novamente.',
      )
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const contexto =
      canvas.getContext('2d')

    if (!contexto) {
      setErroCamera(
        'Não foi possível capturar a imagem.',
      )
      return
    }

    contexto.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErroCamera(
            'Não foi possível capturar a foto.',
          )
          return
        }

        if (fotoPreview) {
          URL.revokeObjectURL(
            fotoPreview,
          )
        }

        const preview =
          URL.createObjectURL(blob)

        setFoto(blob)
        setFotoPreview(preview)

        pararCamera()
      },
      'image/jpeg',
      0.9,
    )
  }

  function removerFoto() {
    if (fotoPreview) {
      URL.revokeObjectURL(
        fotoPreview,
      )
    }

    setFoto(null)
    setFotoPreview('')
    setErroCamera('')
  }

  function handleMenorChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const novoValor =
      event.target.checked

    setMenor(novoValor)

    if (novoValor) {
      pararCamera()
      removerFoto()
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setSucesso('')
    setErro('')
    setErroCamera('')

    if (!aceiteLgpd) {
      setErro(
        'É necessário ler e aceitar o aviso de privacidade para continuar.',
      )
      return
    }

    if (!menor && !foto) {
      setErro(
        'É necessário tirar uma foto antes de realizar o cadastro.',
      )
      return
    }

    setSalvando(true)

    try {
      const dados = new FormData()

      dados.append(
        'nome_completo',
        nomeCompleto,
      )

      dados.append('email', email)

      if (telefone) {
        dados.append(
          'telefone',
          telefone,
        )
      }

      if (instituicao) {
        dados.append(
          'instituicao',
          instituicao,
        )
      }

      dados.append(
        'menor',
        String(menor),
      )

      if (finalidade) {
        dados.append(
          'finalidade',
          finalidade,
        )
      }

      if (foto && !menor) {
        dados.append(
          'foto',
          foto,
          'foto-visitante.jpg',
        )
      }

      const resposta = await api.post(
        '/auto-cadastro',
        dados,
      )

      setSucesso(
        resposta.data.mensagem,
      )

      setNomeCompleto('')
      setTelefone('')
      setEmail('')
      setInstituicao('')
      setMenor(false)
      setFinalidade('')
      setAceiteLgpd(false)

      removerFoto()
    } catch (error: any) {
      setErro(
        error.response?.data?.message ||
          'Não foi possível realizar o cadastro.',
      )
    } finally {
      setSalvando(false)
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop(),
          )

        streamRef.current = null
      }

      if (fotoPreview) {
        URL.revokeObjectURL(
          fotoPreview,
        )
      }
    }
  }, [fotoPreview])

  return (
    <AbadeusBackground>
      <div className="flex flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-3xl">
          <header className="mb-8 text-center">
            <AbadeusLogo
              className="mb-6 justify-center"
            />

            <div className="mx-auto mb-5 h-px w-32 border-t-2 border-dashed border-[#58595B]/30" />

            <h1 className="text-3xl font-bold tracking-tight text-[#58595B] sm:text-4xl">
              Cadastro de Visitante
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#58595B]/75 sm:text-base sm:leading-7">
              Preencha seus dados para realizar seu
              cadastro e registrar sua entrada.
            </p>
          </header>

          <div className="abadeus-card relative overflow-hidden p-5 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-2 w-full bg-[#CC464D]"
            />

            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-2 w-1/3 bg-[#F29422]"
            />

            {sucesso && (
              <div className="mb-6 rounded-2xl border border-[#296589]/20 bg-[#296589]/10 px-5 py-4 text-[#296589]">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#296589] text-sm font-bold text-white">
                    ✓
                  </span>

                  <p className="pt-0.5 text-sm font-semibold leading-6">
                    {sucesso}
                  </p>
                </div>
              </div>
            )}

            {erro && (
              <div className="mb-6 rounded-2xl border border-[#CC464D]/20 bg-[#CC464D]/10 px-5 py-4 text-[#CC464D]">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#CC464D] text-sm font-bold text-white">
                    !
                  </span>

                  <p className="pt-0.5 text-sm font-semibold leading-6">
                    {erro}
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#296589] text-sm font-bold text-white">
                    01
                  </span>

                  <div>
                    <h2 className="text-lg font-bold text-[#58595B]">
                      Dados do visitante
                    </h2>

                    <p className="text-sm text-[#58595B]/60">
                      Informe seus dados pessoais.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="nomeCompleto"
                      className="abadeus-label"
                    >
                      Nome completo
                    </label>

                    <input
                      id="nomeCompleto"
                      type="text"
                      value={nomeCompleto}
                      onChange={(event) =>
                        setNomeCompleto(
                          event.target.value,
                        )
                      }
                      placeholder="Digite seu nome completo"
                      required
                      minLength={3}
                      disabled={salvando}
                      className="abadeus-input"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="telefone"
                        className="abadeus-label"
                      >
                        Telefone
                      </label>

                      <input
                        id="telefone"
                        type="tel"
                        value={telefone}
                        onChange={(event) =>
                          setTelefone(
                            event.target.value,
                          )
                        }
                        placeholder="(00) 00000-0000"
                        disabled={salvando}
                        className="abadeus-input"
                      />
                    </div>

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
                          setEmail(
                            event.target.value,
                          )
                        }
                        placeholder="seu@email.com"
                        required
                        disabled={salvando}
                        className="abadeus-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="instituicao"
                      className="abadeus-label"
                    >
                      Instituição
                    </label>

                    <input
                      id="instituicao"
                      type="text"
                      value={instituicao}
                      onChange={(event) =>
                        setInstituicao(
                          event.target.value,
                        )
                      }
                      placeholder="Empresa, escola ou instituição"
                      disabled={salvando}
                      className="abadeus-input"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="finalidade"
                      className="abadeus-label"
                    >
                      Motivo da visita
                    </label>

                    <input
                      id="finalidade"
                      type="text"
                      value={finalidade}
                      onChange={(event) =>
                        setFinalidade(
                          event.target.value,
                        )
                      }
                      placeholder="Por que você está realizando a visita?"
                      disabled={salvando}
                      className="abadeus-input"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-[#58595B]/15 pt-7">
                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#58595B]/15 bg-[#EBE1D7]/35 p-4 transition hover:border-[#296589]/40 hover:bg-[#EBE1D7]/55 sm:p-5">
                  <input
                    type="checkbox"
                    checked={menor}
                    onChange={
                      handleMenorChange
                    }
                    disabled={salvando}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#296589]"
                  />

                  <span>
                    <span className="block font-semibold text-[#58595B]">
                      Sou menor de idade
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-[#58595B]/65">
                      Marque esta opção caso o visitante
                      seja menor de idade.
                    </span>
                  </span>
                </label>
              </div>

              {!menor && (
                <div className="rounded-2xl border border-[#F29422]/35 bg-[#F29422]/5 p-4 sm:p-6">
                  <div className="mb-5 flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F29422] text-white">
                      📷
                    </span>

                    <div>
                      <h2 className="text-lg font-bold text-[#58595B]">
                        Foto do visitante
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-[#58595B]/65">
                        Para concluir o cadastro,
                        é necessário tirar uma
                        foto.
                      </p>
                    </div>
                  </div>

                  {!cameraAberta &&
                    !fotoPreview && (
                      <button
                        type="button"
                        onClick={abrirCamera}
                        disabled={salvando}
                        className="abadeus-button w-full"
                      >
                        Abrir câmera
                      </button>
                    )}

                  {cameraAberta && (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-2xl border-4 border-white bg-black shadow-lg">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="aspect-video w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={tirarFoto}
                          disabled={salvando}
                          className="abadeus-button flex-1"
                        >
                          Tirar foto
                        </button>

                        <button
                          type="button"
                          onClick={pararCamera}
                          disabled={salvando}
                          className="abadeus-button-outline sm:w-auto"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {fotoPreview && (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-2xl border-4 border-white bg-[#EBE1D7] shadow-lg">
                        <img
                          src={fotoPreview}
                          alt="Foto capturada do visitante"
                          className="aspect-video w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={abrirCamera}
                          disabled={salvando}
                          className="abadeus-button-outline flex-1"
                        >
                          Tirar outra foto
                        </button>

                        <button
                          type="button"
                          onClick={removerFoto}
                          disabled={salvando}
                          className="rounded-xl border-2 border-[#CC464D]/40 px-5 py-3 font-bold text-[#CC464D] transition hover:bg-[#CC464D]/10 disabled:opacity-50"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )}

                  {erroCamera && (
                    <div className="mt-4 rounded-xl border border-[#CC464D]/20 bg-[#CC464D]/10 px-4 py-3 text-sm font-medium leading-5 text-[#CC464D]">
                      {erroCamera}
                    </div>
                  )}

                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </div>
              )}

              {menor && (
                <div className="rounded-2xl border border-[#FFBD59]/50 bg-[#FFBD59]/15 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">
                      ℹ
                    </span>

                    <p className="text-sm leading-6 text-[#58595B]">
                      Como o visitante é menor de
                      idade, nenhuma foto será
                      solicitada ou armazenada.
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t-2 border-dashed border-[#58595B]/15 pt-7">
                <div className="rounded-2xl border border-[#296589]/25 bg-[#296589]/5 p-4 sm:p-6">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#296589] text-sm font-bold text-white">
                      i
                    </span>

                    <div>
                      <h2 className="text-base font-bold text-[#296589]">
                        Uso e proteção dos dados
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#58595B]/75">
                        Seus dados pessoais serão
                        utilizados para realizar o
                        cadastro e registrar sua visita
                        à instituição, conforme as
                        finalidades informadas no
                        atendimento.
                      </p>

                      {!menor && (
                        <p className="mt-2 text-sm leading-6 text-[#58595B]/75">
                          A foto capturada será utilizada
                          para a finalidade de identificação
                          prevista no cadastro.
                        </p>
                      )}

                      {menor && (
                        <p className="mt-2 text-sm leading-6 text-[#58595B]/75">
                          Para visitantes menores de
                          idade, nenhuma foto será
                          solicitada ou armazenada.
                        </p>
                      )}
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#58595B]/10 bg-white p-4 transition hover:border-[#296589]/30">
                    <input
                      id="aceiteLgpd"
                      type="checkbox"
                      checked={aceiteLgpd}
                      onChange={(event) =>
                        setAceiteLgpd(
                          event.target.checked,
                        )
                      }
                      disabled={salvando}
                      className="mt-1 h-5 w-5 shrink-0 accent-[#296589]"
                    />

                    <span className="text-sm leading-6 text-[#58595B]">
                      Declaro que li e estou ciente
                      das informações sobre o uso dos
                      meus dados pessoais para o
                      cadastro e registro da visita.
                      {menor &&
                        ' Quando aplicável, este preenchimento deve ser realizado ou autorizado pelo responsável legal.'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={salvando}
                className="abadeus-button w-full py-4 text-base"
              >
                {salvando
                  ? 'Realizando cadastro...'
                  : 'Realizar auto cadastro'}
              </button>
            </form>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="w-40 border-t-2 border-dashed border-[#58595B]/20" />
          </div>
        </div>
      </div>

      <AbadeusFooter />
    </AbadeusBackground>
  )
}

export default AutoCadastro