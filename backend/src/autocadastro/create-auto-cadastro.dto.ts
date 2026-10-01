import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateAutoCadastroDto {
  @IsString()
  @MinLength(3)
  nome_completo: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  telefone?: string

  @IsOptional()
  @IsString()
  instituicao?: string

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  menor: boolean

  @IsOptional()
  @IsString()
  finalidade?: string
}