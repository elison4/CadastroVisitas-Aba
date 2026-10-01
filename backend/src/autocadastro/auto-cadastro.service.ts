import {
  BadRequestException,
  Injectable,
} from '@nestjs/common'

import { unlink } from 'fs/promises'
import { join } from 'path'

import { PrismaService } from '../prisma/prisma.service'
import { CreateAutoCadastroDto } from './create-auto-cadastro.dto'

@Injectable()
export class AutoCadastroService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async removerArquivo(
    filename: string,
  ) {
    const caminho = join(
      process.cwd(),
      'uploads',
      'fotos',
      filename,
    )

    try {
      await unlink(caminho)
    } catch {
      // O arquivo pode já ter sido removido.
    }
  }

  async cadastrar(
    dto: CreateAutoCadastroDto,
    arquivo?: Express.Multer.File,
  ) {
    // Menor de idade não pode enviar foto.
    if (dto.menor && arquivo) {
      await this.removerArquivo(arquivo.filename)

      throw new BadRequestException(
        'Não é permitido cadastrar foto de visitante menor de idade.',
      )
    }

    // Para maiores de idade, a foto é obrigatória.
    if (!dto.menor && !arquivo) {
      throw new BadRequestException(
        'A foto é obrigatória para visitantes maiores de idade.',
      )
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          let visitante =
            await tx.visitantes.findFirst({
              where: {
                email: dto.email,
              },
            })

          if (visitante) {
            // Impede que o usuário altere a classificação
            // de menor/maior de um cadastro existente.
            if (visitante.menor !== dto.menor) {
              throw new BadRequestException(
                'Os dados informados não correspondem ao cadastro existente.',
              )
            }
          } else {
            visitante =
              await tx.visitantes.create({
                data: {
                  nome_completo: dto.nome_completo,
                  email: dto.email,
                  telefone: dto.telefone,
                  instituicao: dto.instituicao,
                  menor: dto.menor,
                },
              })
          }

          let foto = null

          if (!visitante.menor && arquivo) {
            foto = await tx.fotos.create({
              data: {
                visitante_id: visitante.id,
                caminho_arquivo: `uploads/fotos/${arquivo.filename}`,
                nome_original: arquivo.originalname,
                tipo_mime: arquivo.mimetype,
                tamanho_bytes: arquivo.size,
              },
            })
          }

          const visita =
            await tx.visitas.create({
              data: {
                visitante_id: visitante.id,
                finalidade: dto.finalidade,
              },
            })

          return {
            sucesso: true,
            mensagem:
              'Auto cadastro realizado e entrada registrada com sucesso.',
            visitante: {
              id: Number(visitante.id),
              nome_completo:
                visitante.nome_completo,
              email: visitante.email,
            },
            foto: foto
              ? {
                  id: Number(foto.id),
                  caminho_arquivo:
                    foto.caminho_arquivo,
                }
              : null,
            visita: {
              id: Number(visita.id),
              data_hora_entrada:
                visita.data_hora_entrada,
              finalidade: visita.finalidade,
            },
          }
        },
      )
    } catch (error) {
      if (arquivo) {
        await this.removerArquivo(
          arquivo.filename,
        )
      }

      throw error
    }
  }
}