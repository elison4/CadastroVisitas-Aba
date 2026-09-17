import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVisitanteDto {
  @IsString()
  @MinLength(3)
  nome_completo: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  instituicao?: string;

  @IsOptional()
  @IsBoolean()
  menor?: boolean;
}