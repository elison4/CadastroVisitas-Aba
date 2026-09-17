import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VisitantesController } from './visitantes.controller';
import { VisitantesService } from './visitantes.service';

@Module({
  imports: [AuthModule],
  controllers: [VisitantesController],
  providers: [VisitantesService],
})
export class VisitantesModule {}