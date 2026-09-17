import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const senhaValida = await bcrypt.compare(
      dto.senha,
      usuario.senha_hash,
    );

    if (!senhaValida) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos.',
      );
    }

    const payload = {
      sub: Number(usuario.id),
      email: usuario.email,
      perfil: usuario.perfil,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      usuario: {
        id: Number(usuario.id),
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}