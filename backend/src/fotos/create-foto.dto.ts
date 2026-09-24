import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateFotoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  visitante_id: number;
}