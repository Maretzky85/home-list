import { Controller, Get, Inject, HttpException, HttpStatus, HttpCode, Post, Body, Param } from '@nestjs/common';
import { UsersDataService } from 'src/services/users-data/users-data.service';
import { UserDto } from 'src/models/userDto';
import { DailyService } from 'src/services/daily/daily.service';
import { User } from 'src/models/user';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersDataService,
                private dailyService: DailyService){}

    @Get()
    async getUsers(){
        return await this.usersService.getUsers()
    }

    @Get('all')
    async getAllData(){
        let users = await this.usersService.getUsers();
        let daily = await this.dailyService.getDailys();
        let result: UserDto[] = []
        users.map( (user) => {
            result.push(
                new UserDto(user, daily.filter(
                    (daily) => daily.userId === user.id ))
                    ) 
        } )
        return result
    }

    @Post()
    @HttpCode(201)
    async addUser(@Body() user: User){
        await this.usersService.createUser(user.name)
            .catch( (error) => {throw new HttpException('user exist', HttpStatus.CONFLICT); } );
    }

    @Get('deleteUser')
    async deleteUser() {
        await this.usersService.deleteUser(10);
    }

    @Get('editUser')
    async editUser() {
        await this.usersService.editUser(3, 'maretzky');
    }

    @Get('/:id/daily')
    async getDailyForUser(@Param() params) {
        return this.dailyService.getDailyByUserId(params.id);
    }

}
