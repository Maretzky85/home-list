import { Test, TestingModule } from '@nestjs/testing';
import { PsqlService } from './psql.service';

describe('PsqlService', () => {
  let service: PsqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsqlService],
    }).compile();

    service = module.get<PsqlService>(PsqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
