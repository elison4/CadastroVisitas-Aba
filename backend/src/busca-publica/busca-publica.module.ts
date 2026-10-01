import { Module } from '@nestjs/common'

import { BuscaPublicaController } from './busca-publica.controller'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [BuscaPublicaController],
})
export class BuscaPublicaModule {}