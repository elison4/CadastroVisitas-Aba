import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail.',
      );
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = await this.prisma.usuarios.create({
      data: {
        nome_completo: dto.nome_completo,
        email: dto.email,
        senha_hash: senhaHash,
        perfil: dto.perfil,
        ativo: true,
      },
    });

    return {
      id: Number(usuario.id),
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      criado_em: usuario.criado_em,
    };
  }

  async listarTodos() {
    const usuarios = await this.prisma.usuarios.findMany({
      orderBy: {
        nome_completo: 'asc',
      },
    });

    return usuarios.map((usuario) => ({
      id: Number(usuario.id),
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      criado_em: usuario.criado_em,
      atualizado_em: usuario.atualizado_em,
    }));
  }
}