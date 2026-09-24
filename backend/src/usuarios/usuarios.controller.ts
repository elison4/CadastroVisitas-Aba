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
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(JwtAuthGuard,  RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

@Get()
 async listarTodos() {
    return this.usuariosService.listarTodos();
  }

@Post()
@Roles('ADMIN')
async criar(@Body() dto: CreateUsuarioDto) {
  return this.usuariosService.criar(dto);
}
}