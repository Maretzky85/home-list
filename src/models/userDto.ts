import { User } from "./user";
import { Daily } from "./daily";

export class UserDto{
    constructor(user: User, tasks: Array<Daily>){
        this.tasks = tasks,
        this.user = user
    }
    user: User
    tasks: Daily[]
}