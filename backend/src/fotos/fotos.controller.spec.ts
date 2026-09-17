import { Test, TestingModule } from '@nestjs/testing';
import { FotosController } from './fotos.controller';

describe('FotosController', () => {
  let controller: FotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FotosController],
    }).compile();

    controller = module.get<FotosController>(FotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
