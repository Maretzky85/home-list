import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersDataService } from './users-data/users-data.service';
import { PsqlService } from './services/psql/psql.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersDataService, PsqlService],
})
export class AppModule {}
