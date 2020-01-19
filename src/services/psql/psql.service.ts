import { Injectable } from '@nestjs/common';
import { Client, Configuration } from 'ts-postgres';
import { from } from 'rxjs';
import { User } from '../../models/user';
import { Daily } from 'src/models/daily';
import { config } from 'src/config/config';

// const config: Configuration = {
//     host: '127.0.0.1',
//     port: 5432,
//     database: 'home',
//     user: 'home',
//     password: 'home',
// };

const dbCongig = config;

@Injectable()
export class PsqlService {

    private client: Client;

    async getClient() {
        if (this.client === undefined) {
            this.client = new Client(dbCongig);
            await this.client.connect();
        }
        return this.client;
    }

    async addUser() {
        const client = new Client(dbCongig);
        await client.connect();
        const users: Daily[] = [];

        const result = await client.query(
        //     `SELECT '' || $1 || '' AS message`,
        // ['world']
            `INSERT INTO users(name) VALUES('' || $1 || '')`, ['Marek'],
        ).catch( (e) => console.log(e) ).then( (res) => console.log(res));
        await client.end();
    }
}

