import { Injectable } from '@nestjs/common';
import { Client, Configuration } from 'ts-postgres'
import { from } from 'rxjs';
import { User } from '../../models/user'
import { Daily } from 'src/models/daily';

const config: Configuration = {
    host: '127.0.0.1',
    port: 5432,
    database: 'home',
    user: 'home',
    password: 'home'
}

@Injectable()
export class PsqlService {

    async getUsers() {
        const client = new Client(config)
        await client.connect();
        let users: User[] = []

        let result = await client.query(
            `SELECT * from users`
        );        

        await client.end();
        return result.rows.map( (row) => new User( parseInt(row[0].toString()), row[1].toString()) )
    }

    async getDaily() {
        const client = new Client(config)
        await client.connect();
        let users: Daily[] = []

        let result = await client.query(
            `SELECT * from daily`
        );        
        await client.end();
        return result.rows.map( (row) => new Daily(  parseInt(row[0].toString()), row[1].toString(), parseInt(row[2].toString()) ) )
    }
}

