import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'

import { VisitasController } from './visitas.controller'
import { VisitasPublicaController } from './visitas-publica.controller'

import { VisitasService } from './visitas.service'

@Module({
  imports: [AuthModule],
  controllers: [
    VisitasController,
    VisitasPublicaController,
  ],
  providers: [VisitasService],
})
export class VisitasModule {}