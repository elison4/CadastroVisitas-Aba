import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import {
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger'

import { CreateAutoCadastroDto } from './create-auto-cadastro.dto'
import { AutoCadastroService } from './auto-cadastro.service'

@Controller('auto-cadastro')
export class AutoCadastroController {
  constructor(
    private readonly autoCadastroService: AutoCadastroService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome_completo: {
          type: 'string',
          example: 'João da Silva',
        },
        email: {
          type: 'string',
          example: 'joao@email.com',
        },
        telefone: {
          type: 'string',
          example: '(48) 99999-9999',
        },
        instituicao: {
          type: 'string',
          example: 'Empresa Exemplo',
        },
        menor: {
          type: 'boolean',
          example: false,
        },
        finalidade: {
          type: 'string',
          example: 'Atendimento',
        },
        foto: {
          type: 'string',
          format: 'binary',
          description:
            'Foto do visitante. Obrigatória para maiores de idade e não permitida para menores.',
        },
      },
      required: [
        'nome_completo',
        'email',
        'menor',
      ],
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/fotos',
        filename: (_req, file, callback) => {
          const extensao =
            file.originalname
              .split('.')
              .pop()
              ?.toLowerCase() || 'jpg'

          const nome = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extensao}`

          callback(null, nome)
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException(
              'Apenas arquivos de imagem são permitidos.',
            ),
            false,
          )
        }

        callback(null, true)
      },
    }),
  )
  async cadastrar(
    @Body() dto: CreateAutoCadastroDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    return this.autoCadastroService.cadastrar(
      dto,
      arquivo,
    )
  }
}