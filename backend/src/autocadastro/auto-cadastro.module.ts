import { Module } from '@nestjs/common'

import { AutoCadastroController } from './auto-cadastro.controller'
import { AutoCadastroService } from './auto-cadastro.service'

@Module({
  controllers: [
    AutoCadastroController,
  ],
  providers: [
    AutoCadastroService,
  ],
})
export class AutoCadastroModule {}