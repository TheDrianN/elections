import { Module } from '@nestjs/common';

import { ElectionsModule } from './elections/elections.module';
import { SubElectionsModule } from './sub-elections/sub-elections.module';

@Module({
  imports: [ElectionsModule, SubElectionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
