import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PsqlService } from 'src/services/psql/psql.service';
import { User } from 'src/models/user';
import { Daily } from 'src/models/daily';
import { UserDto } from 'src/models/userDto';
import { DataType } from 'ts-postgres';

@Injectable()
export class UsersDataService {
    private readonly logger = new Logger(UsersDataService.name);
    constructor(private psql: PsqlService) {}

    async getUsers() {
        const client = await this.psql.getClient();

        const result = await client.query(
            `SELECT * from users`,
        );
        return result.rows.map( (user) => new User(user[1] as string, user[0] as number) );
    }

    async getUserByUsername(userName: string) {
        const client = await this.psql.getClient();
        return await client.query(
            `SELECT * from users
            WHERE name = '' || $1 || ''`, [userName],
        );
    }

    async getUserById(id: number) {
        const client = await this.psql.getClient();
        return await client.query(
            `SELECT * from users
            WHERE id = ${id}`, [id],
        );
    }

    async createUser(userName: string) {
        const client = await this.psql.getClient();
        const user = await this.getUserByUsername(userName);
        if (user.rows.length !== 0) {
            throw Error('User exist');
        }
        const newUser = await client.query(
            `INSERT INTO users(name)
            VALUES(''||$1||'')`, [userName],
        );
        return await this.getUserByUsername(userName);
    }

    async deleteUser(id: number) {
        const client = await this.psql.getClient();
        const deletedUser = await client.query(
                `DELETE FROM users
                WHERE id = ${id}`, [id],
            ).catch( (e) => {
                this.logger.error('error in deleteUser method of users-data.service: ', e);
                throw new HttpException('Query error', HttpStatus.BAD_REQUEST);
            } );
        if (deletedUser.status === 'DELETE 0') {
            throw new HttpException('User id does not exist', HttpStatus.NOT_FOUND);
        }
        return 'ok';
    }

    async editUser(id: number, name: string) {
        const client = await this.psql.getClient();
        const users: User[] = await this.getUserById(id)
            .then( (response) => response.rows
            .map( (user) => new User(user[1] as string, user[0] as number) ) );
        if (users.length !== 1) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const updateUser = await client.query(
            `UPDATE users
            SET name = ''||$1||''
            WHERE id = ${id}`, [name],
        );
        if (updateUser.status !== 'UPDATE 1') {
            this.logger.warn(updateUser);
            throw new HttpException('Update error:' + updateUser.status, HttpStatus.BAD_REQUEST);
        }
        return 'ok';
    }

}
