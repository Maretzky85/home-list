export class User {
    constructor(name: string, id?: number){
        this.id = id,
        this.name = name
    }
    id?: number
    name: string
}