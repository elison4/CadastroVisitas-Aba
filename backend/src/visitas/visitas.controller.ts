import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVisitaDto } from './create-visitas.dto';
import { VisitasService } from './visitas.service';

@Controller('visitas')
@UseGuards(JwtAuthGuard)
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Get()
  async listarTodos() {
    return this.visitasService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.visitasService.buscarPorId(Number(id));
  }

  @Post()
  async criar(@Body() dto: CreateVisitaDto) {
    return this.visitasService.criar(dto);
  }
}