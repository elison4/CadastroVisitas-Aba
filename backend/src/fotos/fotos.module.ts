import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FotosController } from './fotos.controller';
import { FotosService } from './fotos.service';

@Module({
  imports: [AuthModule],
  controllers: [FotosController],
  providers: [FotosService],
})
export class FotosModule {}