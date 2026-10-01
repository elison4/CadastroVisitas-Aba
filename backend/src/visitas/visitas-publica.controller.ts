import { Body, Controller, Post } from '@nestjs/common'
import { CreateVisitaDto } from './create-visitas.dto'
import { VisitasService } from './visitas.service'

@Controller('visitas-publica')
export class VisitasPublicaController {
  constructor(
    private readonly visitasService: VisitasService,
  ) {}

  @Post()
  async criar(@Body() dto: CreateVisitaDto) {
    return this.visitasService.criarPublica(dto)
  }
}
