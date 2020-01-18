import { Controller, Get, Inject, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersDataService } from 'src/services/users-data/users-data.service';
import { UserDto } from 'src/models/userDto';
import { DailyService } from 'src/services/daily/daily.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersDataService,
                private dailyService: DailyService){}

    @Get()
    async getUsers(){
        console.log('users controller root method...')
        return await this.usersService.getUsers()
    }

    @Get('daily')
    async getDaily(){
        await this.dailyService.createDaily('blabla', 0)
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

    @Get('addUser')
    @HttpCode(201)
    async addUser(){
        await this.usersService.createUser('maretzky')
            .catch( (error) => {throw new HttpException("user exist", HttpStatus.CONFLICT)} )
        return 'yay'
    }

    @Get('deleteUser')
    async deleteUser(){
        await this.usersService.deleteUser(10)
    }

    @Get('editUser') 
    async editUser() {
        await this.usersService.editUser(3, 'maretzky')
    }

}
