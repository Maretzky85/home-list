import { Controller, Get, Inject } from '@nestjs/common';
import { UsersDataService } from 'src/users-data/users-data.service';
import { PsqlService } from 'src/services/psql/psql.service';
import { User } from 'src/models/user';
import { async } from 'rxjs/internal/scheduler/async';
import { UserDto } from 'src/models/userDto';

@Controller('users')
export class UsersController {

    constructor(private psql: PsqlService){}

    @Get()
    async getUsers(){
        console.log('users controller root method...')
        const result = await this.psql.getUsers()
        console.log(result)
        return result
    }

    @Get('daily')
    async getDaily(){
        return await this.psql.getDaily()
    }

    @Get('all')
    async getAllData(){
        let users = await this.psql.getUsers()
        let daily = await this.psql.getDaily()
        let result: UserDto[] = []
        users.map( (user) => {
            result.push(new UserDto(user, daily.filter( (daily) => daily.user_id === user.id ))) 
        } )
        return result
    }

}
