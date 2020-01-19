export class Daily {
    constructor(task: string, userId: number, id?: number){
        this.id = id;
        this.task = task;
        this.userId = userId;
    }
    id?: number;
    task: string;
    userId: number;
}