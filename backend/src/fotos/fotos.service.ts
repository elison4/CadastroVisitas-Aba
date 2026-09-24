import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';
import { CreateFotoDto } from './create-foto.dto';

@Injectable()
export class FotosService {
  constructor(private readonly prisma: PrismaService) {}

  private async removerArquivo(filename: string) {
    const caminho = join(
      process.cwd(),
      'uploads',
      'fotos',
      filename,
    );

    try {
      await unlink(caminho);
    } catch {
      // Se o arquivo já não existir, não há nada para remover.
    }
  }

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

  async criar(
    dto: CreateFotoDto,
    arquivo: {
      filename: string;
      originalname: string;
      mimetype: string;
      size: number;
    },
  ) {
    const visitante = await this.prisma.visitantes.findUnique({
      where: {
        id: BigInt(dto.visitante_id),
      },
    });

    if (!visitante) {
      await this.removerArquivo(arquivo.filename);

      throw new NotFoundException('Visitante não encontrado.');
    }

    if (visitante.menor) {
      await this.removerArquivo(arquivo.filename);

      throw new BadRequestException(
        'Não é permitido cadastrar foto de visitante menor de idade.',
      );
    }

    try {
      const foto = await this.prisma.fotos.create({
        data: {
          visitante_id: BigInt(dto.visitante_id),
          caminho_arquivo: `uploads/fotos/${arquivo.filename}`,
          nome_original: arquivo.originalname,
          tipo_mime: arquivo.mimetype,
          tamanho_bytes: arquivo.size,
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
    } catch (error) {
      await this.removerArquivo(arquivo.filename);
      throw error;
    }
  }
}