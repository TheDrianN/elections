import { Module } from '@nestjs/common';
import { SubElectionsService } from './sub-elections.service';
import { SubElectionsController } from './sub-elections.controller';

@Module({
  controllers: [SubElectionsController],
  providers: [SubElectionsService],
})
export class SubElectionsModule {}
