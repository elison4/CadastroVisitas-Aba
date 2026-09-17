import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateVisitaDto {
  @IsInt()
  @Min(1)
  visitante_id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  finalidade?: string;
}