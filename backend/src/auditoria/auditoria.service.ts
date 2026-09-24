import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(params: {
    usuario_id?: number;
    acao: string;
    entidade: string;
    entidade_id?: number;
    detalhes?: object;
  }) {
    return this.prisma.auditoria.create({
      data: {
        usuario_id: params.usuario_id
          ? BigInt(params.usuario_id)
          : null,
        acao: params.acao,
        entidade: params.entidade,
        entidade_id: params.entidade_id
          ? BigInt(params.entidade_id)
          : null,
        detalhes: params.detalhes,
      },
    });
  }
}