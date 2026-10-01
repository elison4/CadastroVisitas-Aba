import {
  Controller,
  Get,
  Query,
} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Controller('busca-publica')
export class BuscaPublicaController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async buscar(@Query('valor') valor: string) {
    const termo = valor?.trim()

    if (!termo) {
      return []
    }

    const visitantes = await this.prisma.visitantes.findMany({
      where: {
        OR: [
          {
            nome_completo: {
              contains: termo,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: termo,
              mode: 'insensitive',
            },
          },
          {
            telefone: {
              contains: termo,
            },
          },
        ],
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        telefone: true,
        instituicao: true,
        menor: true,
      },
      orderBy: {
        nome_completo: 'asc',
      },
    })

    return visitantes.map((visitante) => ({
      id: Number(visitante.id),
      nome_completo: visitante.nome_completo,
      email: visitante.email,
      telefone: visitante.telefone,
      instituicao: visitante.instituicao,
      menor: visitante.menor,
    }))
  }
}