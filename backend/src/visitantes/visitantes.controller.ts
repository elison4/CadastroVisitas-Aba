import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { VisitantesService } from './visitantes.service';
import { CreateVisitanteDto } from './create-visitante.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('visitantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitantesController {
  constructor(private readonly visitantesService: VisitantesService) {}

  @Get()
  async listarTodos() {
    return this.visitantesService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.visitantesService.buscarPorId(id);
  }

  @Post()
  @Roles('ADMIN', 'OPERADOR')
  async criar(@Body() dto: CreateVisitanteDto) {
    return this.visitantesService.criar(dto);
  }
}