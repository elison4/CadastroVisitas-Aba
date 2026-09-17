import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitaDto } from './create-visitas.dto';

@Injectable()
export class VisitasService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos() {
    const visitas = await this.prisma.visitas.findMany({
      orderBy: {
        data_hora_entrada: 'desc',
      },
      include: {
        visitantes: true,
      },
    });

    return visitas.map((visita) => ({
      id: Number(visita.id),
      visitante_id: Number(visita.visitante_id),
      nome_completo: visita.visitantes.nome_completo,
      telefone: visita.visitantes.telefone,
      email: visita.visitantes.email,
      instituicao: visita.visitantes.instituicao,
      menor: visita.visitantes.menor,
      data_hora_entrada: visita.data_hora_entrada,
      finalidade: visita.finalidade,
      criado_em: visita.criado_em,
    }));
  }

  async buscarPorId(id: number){
    const visita = await this.prisma.visitas.findUnique({
        where: {
            id: BigInt(id),
        },
        include: {
            visitantes: true,
        },
    });

    if (!visita){
        throw new NotFoundException('Visita não encontrada.');
    }

     return {
    id: Number(visita.id),
    visitante_id: Number(visita.visitante_id),
    nome_completo: visita.visitantes.nome_completo,
    telefone: visita.visitantes.telefone,
    email: visita.visitantes.email,
    instituicao: visita.visitantes.instituicao,
    menor: visita.visitantes.menor,
    data_hora_entrada: visita.data_hora_entrada,
    finalidade: visita.finalidade,
    criado_em: visita.criado_em,
  };
  }

  async criar(dto: CreateVisitaDto) {
    const visitante = await this.prisma.visitantes.findUnique({
      where: {
        id: BigInt(dto.visitante_id),
      },
    });

    if (!visitante) {
      throw new NotFoundException('Visitante não encontrado.');
    }

    const visita = await this.prisma.visitas.create({
      data: {
        visitante_id: BigInt(dto.visitante_id),
        finalidade: dto.finalidade,
      },
    });

    return {
      ...visita,
      id: Number(visita.id),
      visitante_id: Number(visita.visitante_id),
    };
  }
}