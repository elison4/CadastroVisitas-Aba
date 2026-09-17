import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateFotoDto {
  @IsInt()
  @Min(1)
  visitante_id: number;

  @IsString()
  @IsNotEmpty()
  caminho_arquivo: string;

  @IsString()
  @IsNotEmpty()
  tipo_mime: string;

  @IsInt()
  @Min(1)
  tamanho_bytes: number;

  
}