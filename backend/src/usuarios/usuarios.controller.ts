import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  async listarTodos() {
    return this.usuariosService.listarTodos();
  }

  @Post()
  async criar(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.criar(dto);
  }
}