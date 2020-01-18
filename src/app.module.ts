import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controllers/users/users.controller';
import { UsersDataService } from './services/users-data/users-data.service';
import { PsqlService } from './services/psql/psql.service';
import { DailyService } from './services/daily/daily.service';
import { DailyController } from './controllers/daily/daily.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, DailyController],
  providers: [AppService, UsersDataService, PsqlService, DailyService],
})
export class AppModule {}
