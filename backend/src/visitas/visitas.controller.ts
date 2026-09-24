import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateVisitaDto } from './create-visitas.dto';
import { VisitasService } from './visitas.service';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('visitas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Get()
  async listarTodos() {
    return this.visitasService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.visitasService.buscarPorId(id);
  }

  @Post()
  @Roles('ADMIN', 'OPERADOR')
  async criar(@Body() dto: CreateVisitaDto) {
    return this.visitasService.criar(dto);
  }
}