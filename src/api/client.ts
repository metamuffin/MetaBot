import { User } from "./user.ts";


export class Client {

    public user:User|undefined
    public client_id: string
    
    constructor(id:string) {
        this.client_id = id
        this.user = new User();
    }

    async login(client_secret:string) {

    }
}