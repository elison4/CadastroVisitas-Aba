import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateFotoDto } from './create-foto.dto';
import { FotosService } from './fotos.service';

@ApiBearerAuth()
@Controller('fotos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}

  @Get()
  async listarTodos() {
    return this.fotosService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.fotosService.buscarPorId(id);
  }

  @Post()
  @Roles('ADMIN', 'OPERADOR')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        visitante_id: {
          type: 'integer',
          example: 8,
          description: 'Código/ID do visitante',
        },
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem do visitante',
        },
      },
      required: ['visitante_id', 'foto'],
    },
  })
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/fotos',
        filename: (_req, file, callback) => {
          const extensao =
            file.originalname.split('.').pop()?.toLowerCase() || 'jpg';

          const nome = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extensao}`;

          callback(null, nome);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Apenas arquivos de imagem são permitidos.'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async criar(
    @Body() dto: CreateFotoDto,
    @UploadedFile() arquivo: Express.Multer.File,
  ) {
    return this.fotosService.criar(dto, {
      filename: arquivo.filename,
      originalname: arquivo.originalname,
      mimetype: arquivo.mimetype,
      size: arquivo.size,
    });
  }
}