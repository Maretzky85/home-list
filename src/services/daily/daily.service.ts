import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PsqlService } from '../psql/psql.service';
import { Daily } from 'src/models/daily';
import { Result } from 'ts-postgres';

@Injectable()
export class DailyService {
    constructor(private psql: PsqlService) {}
    private readonly logger = new Logger(DailyService.name);

    async getDailys() {
        const client = await this.psql.getClient();
        const result = await client.query(
            `SELECT * from daily`,
        )
        .then( (dailies) => this.mapResultToDailies(dailies))
        .catch( (e) => {
            this.logger.error('Error querying dailyies', e);
            throw new QueryError(`Querry error`);
    });
        return result;
    }

    async getDailyById(id: number) {
        const client = await this.psql.getClient();
        const result = await client.query(
            `SELECT * from daily
            WHERE id = ${id}`, [id],
        ).then( (dailies) => this.mapResultToDailies(dailies))
        .catch( (e) => {
            this.logger.error('Error querying dailyies', e);
            throw new QueryError('Error querying dailyies');
    });
        return result;
    }

    async getDailyByUserId(id: number) {
        const client = await this.psql.getClient();
        const result = await client.query(
            `SELECT * from daily
            WHERE user_id = ${id}`, [id],
        )
        .then( (dailies) => this.mapResultToDailies(dailies))
        .catch( (e) => {
            this.logger.error('Error querying dailyies', e);
            throw new QueryError('Error querying dailyies');
        });
        return result;
    }

    async createDaily(taskName: string, userId: number) {
        const client = await this.psql.getClient();
        const newDaily = await client.query(
            `INSERT INTO daily(name, user_id)
            VALUES(''||$1||'', ${userId})`, [taskName],
        );
        if (newDaily.status !== 'INSERT 0 1') {
            this.logger.warn('Daily creation error: ' + newDaily.status);
            throw new HttpException('Daily creation error: ' + newDaily.status, HttpStatus.BAD_GATEWAY);
        }
    }

    async deleteDaily(id: number) {
        const client = await this.psql.getClient();
        const deletedUser = await client.query(
                `DELETE FROM daily
                WHERE id = ${id}`, [id],
            ).catch( (e) => {
                this.logger.error('error in deleteDaily method of daily.service: ', e);
                throw new HttpException('Query error', HttpStatus.BAD_REQUEST);
            } );
        if (deletedUser.status === 'DELETE 0') {
            this.logger.warn(`Daily of id: ${id} not found`);
            throw new HttpException('Daily id does not exist', HttpStatus.NOT_FOUND);
        }
    }

    async editDaily(daily: Daily) {
        const client = await this.psql.getClient();
        const dailys: Daily[] = await this.getDailyById(daily.id);
        if (dailys.length !== 1) {
            this.logger.warn(`Daily of id ${daily.id} not found`);
            throw new HttpException('Daily does not exist', HttpStatus.NOT_FOUND);
        }
        const updateUser = await client.query(
            `UPDATE daily
            SET name = ''||$1||''
            WHERE id = ${daily.id}`, [daily.task as string],
        );
        if (updateUser.status !== 'UPDATE 1') {
            this.logger.warn(`error by: ${updateUser}`);
            throw new HttpException('Update error:' + updateUser.status, HttpStatus.BAD_REQUEST);
        }
    }

    private mapResultToDailies(result: Result) {
        return result.rows.map( (daily) => new Daily(daily[1] as string, daily[2] as number, daily[0] as number) );
    }

}
