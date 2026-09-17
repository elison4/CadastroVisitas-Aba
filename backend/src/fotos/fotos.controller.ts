import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFotoDto } from './create-foto.dto';
import { FotosService } from './fotos.service';

@Controller('fotos')
@UseGuards(JwtAuthGuard)
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}

  @Get()
  async listarTodos() {
    return this.fotosService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.fotosService.buscarPorId(Number(id));
  }

  @Post()
  async criar(@Body() dto: CreateFotoDto) {
    return this.fotosService.criar(dto);
  }
}