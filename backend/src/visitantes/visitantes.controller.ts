import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VisitantesService } from './visitantes.service';
import { CreateVisitanteDto } from './create-visitante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('visitantes')
export class VisitantesController {
  constructor(private readonly visitantesService: VisitantesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
async listarTodos() {
  return this.visitantesService.listarTodos();
}

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.visitantesService.buscarPorId(Number(id));
  }

  @Post()
  async criar(@Body() dto: CreateVisitanteDto) {
    return this.visitantesService.criar(dto);
  }
}