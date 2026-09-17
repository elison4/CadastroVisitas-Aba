import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitanteDto } from './create-visitante.dto';

@Injectable()
export class VisitantesService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos() {
    const visitantes = await this.prisma.visitantes.findMany({
      orderBy: {
        nome_completo: 'asc',
      },
    });

    return visitantes.map((visitante) => ({
      ...visitante,
      id: Number(visitante.id),
    }));
  }

  async criar(dto: CreateVisitanteDto) {
    const visitante = await this.prisma.visitantes.create({
      data: {
        nome_completo: dto.nome_completo,
        telefone: dto.telefone,
        email: dto.email,
        instituicao: dto.instituicao,
        menor: dto.menor ?? false,
      },
    });

    return {
      ...visitante,
      id: Number(visitante.id),
    };
  }

  async buscarPorId(id: number) {
    const visitante = await this.prisma.visitantes.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!visitante) {
      return null;
    }

    return {
      ...visitante,
      id: Number(visitante.id),
    };
  }
}