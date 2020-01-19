import { Controller, Get, HttpCode, HttpException, Param, Delete, Put, Post, Body, HttpStatus, Res, Logger } from '@nestjs/common';
import { UsersDataService } from 'src/services/users-data/users-data.service';
import { DailyService } from 'src/services/daily/daily.service';
import { UserDto } from 'src/models/userDto';
import { User } from 'src/models/user';
import { Daily } from 'src/models/daily';
import { response } from 'express';

@Controller('daily')
export class DailyController {
    private readonly logger = new Logger(DailyController.name);
    constructor(private usersService: UsersDataService,
                private dailyService: DailyService) {}

        @Get()
        async getDailys() {
            return await this.dailyService.getDailys()
                .catch( (e) => {
                    this.logger.error(e);
                    throw e;
                });
        }

        @Get('all')
        async getAllData() {
            const users = await this.usersService.getUsers();
            const daily = await this.dailyService.getDailys();
            const result: UserDto[] = [];
            users.map( (user) => {
                result.push(
                    new UserDto(user, daily.filter(
                        (task) => task.userId === user.id )),
                        );
            } );
            return result;
        }

        @Post()
        async createDaily(@Body() daily: Daily) {
            await this.dailyService.createDaily(daily.task as string, daily.userId);
        }

        @Delete(':id')
        async deleteDaily(@Param() params) {
            await this.dailyService.deleteDaily(params.id);
        }

        @Put(':id')
        async editDaily(@Param() params, @Body() daily: Daily) {
            if (daily.id !== parseInt(params.id, 10) ) {
                throw new HttpException(`id mismatch, param: ${params.id}, daily: ${daily.id}`, HttpStatus.BAD_REQUEST);
            }
            await this.dailyService.editDaily(daily);
        }

}
