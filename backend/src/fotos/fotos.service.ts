import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFotoDto } from './create-foto.dto';

@Injectable()
export class FotosService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos() {
    const fotos = await this.prisma.fotos.findMany({
      orderBy: {
        criado_em: 'desc',
      },
      include: {
        visitantes: true,
      },
    });

    return fotos.map((foto) => ({
      id: Number(foto.id),
      visitante_id: Number(foto.visitante_id),
      nome_completo: foto.visitantes.nome_completo,
      caminho_arquivo: foto.caminho_arquivo,
      nome_original: foto.nome_original,
      tipo_mime: foto.tipo_mime,
      tamanho_bytes: Number(foto.tamanho_bytes),
      criado_em: foto.criado_em,
    }));
  }

  async buscarPorId(id: number) {
  const foto = await this.prisma.fotos.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      visitantes: true,
    },
  });

  if (!foto) {
    throw new NotFoundException('Foto não encontrada.');
  }

  return {
    id: Number(foto.id),
    visitante_id: Number(foto.visitante_id),
    nome_completo: foto.visitantes.nome_completo,
    caminho_arquivo: foto.caminho_arquivo,
    nome_original: foto.nome_original,
    tipo_mime: foto.tipo_mime,
    tamanho_bytes: Number(foto.tamanho_bytes),
    criado_em: foto.criado_em,
  };
}

  async criar(dto: CreateFotoDto) {
    const visitante = await this.prisma.visitantes.findUnique({
      where: {
        id: BigInt(dto.visitante_id),
      },
    });

    if (!visitante) {
      throw new NotFoundException('Visitante não encontrado.');
    }

    if (visitante.menor) {
      throw new BadRequestException(
        'Não é permitido cadastrar foto de visitante menor de idade.',
      );
    }

    const foto = await this.prisma.fotos.create({
      data: {
        visitante_id: BigInt(dto.visitante_id),
        caminho_arquivo: dto.caminho_arquivo,
        tipo_mime: dto.tipo_mime,
        tamanho_bytes: dto.tamanho_bytes,
      },
    });

    return {
      id: Number(foto.id),
      visitante_id: Number(foto.visitante_id),
      caminho_arquivo: foto.caminho_arquivo,
      nome_original: foto.nome_original,
      tipo_mime: foto.tipo_mime,
      tamanho_bytes: Number(foto.tamanho_bytes),
      criado_em: foto.criado_em,
    };
  }
}