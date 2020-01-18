import { Controller, Get, HttpCode, HttpException } from '@nestjs/common';
import { UsersDataService } from 'src/services/users-data/users-data.service';
import { DailyService } from 'src/services/daily/daily.service';
import { UserDto } from 'src/models/userDto';

@Controller('daily')
export class DailyController {
    constructor(private usersService: UsersDataService,
                private dailyService: DailyService){}

        @Get()
        async getDailys(){
            return await this.dailyService.getDailys()
        }
    
        @Get('all')
        async getAllData(){
            let users = await this.usersService.getUsers()
            let daily = await this.dailyService.getDailys()
            let result: UserDto[] = []
            users.map( (user) => {
                result.push(
                    new UserDto(user, daily.filter( 
                        (daily) => daily.user_id === user.id ))
                        ) 
            } )
            return result
        }
    
        @Get('addDaily')
        @HttpCode(201)
        async addUser(){
            await this.dailyService.createDaily('okulary', 0)
            return 'ok'
        }
    
        @Get('deleteDaily')
        async deleteDaily(){
            await this.dailyService.deleteDaily(10)
        }
    
        @Get('editUser') 
        async editUser() {
            await this.dailyService.editDaily(3, 'maretzky')
        }

}
