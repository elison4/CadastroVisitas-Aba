import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VisitasController } from './visitas.controller';
import { VisitasService } from './visitas.service';

@Module({
  imports: [AuthModule],
  controllers: [VisitasController],
  providers: [VisitasService],
})
export class VisitasModule {}