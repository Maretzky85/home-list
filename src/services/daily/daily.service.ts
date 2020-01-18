import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PsqlService } from '../psql/psql.service';
import { Daily } from 'src/models/daily';

@Injectable()
export class DailyService {
    constructor(private psql: PsqlService){}

    async getDailys(){
        let users: Daily[]
        let client = await this.psql.getClient()
        let result = await client.query(
            `SELECT * from daily`
        );
        return result.rows.map( (daily) => new Daily(daily[0] as number, daily[1] as string, daily[2] as number) )
    }

    async getDailyById(id: number){
        let client = await this.psql.getClient()
        return await client.query(
            `SELECT * from daily
            WHERE id = ${id}`, [id]
        );
    }

    async createDaily(taskName: string, userId: number){
        let client = await this.psql.getClient()
        let newDaily = await client.query(
            `INSERT INTO daily(name, user_id)
            VALUES(''||$1||'', ${userId})`, [taskName]
        )
        if (newDaily.status !== 'INSERT 0 1'){
            throw new HttpException('Daily creation error: ' + newDaily.status, HttpStatus.BAD_GATEWAY)
        }
        return 'ok'
    }

    async deleteDaily(id:number){
        let client = await this.psql.getClient()
        let deletedUser = await client.query(
                `DELETE FROM daily
                WHERE id = ${id}`, [id]
            ).catch( (e) => {
                console.log('error in deleteDaily method of daily.service: ' + e);
                throw new HttpException('Query error', HttpStatus.BAD_REQUEST)
            } )
        if (deletedUser.status === 'DELETE 0'){
            throw new HttpException('Daily id does not exist', HttpStatus.NOT_FOUND)
        }
        return 'ok'
    }

    async editDaily(id: number, name:string) {
        let client = await this.psql.getClient()
        let users: Daily[] = await this.getDailyById(id)
            .then( (response) => response.rows
            .map( (daily) => new Daily(daily[0] as number, daily[1] as string, daily[2] as number) ) )
        if (users.length !== 1){
            throw new HttpException('Daily does not exist', HttpStatus.NOT_FOUND)
        }
        let updateUser = await client.query(
            `UPDATE daily
            SET name = ''||$1||''
            WHERE id = ${id}`, [name]
        )
        if (updateUser.status !== 'UPDATE 1') {
            console.log(updateUser)
            throw new HttpException('Update error:' + updateUser.status, HttpStatus.BAD_REQUEST)
        }
        return 'ok'
    }

}
