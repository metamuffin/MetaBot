import { User } from "./user.ts";


export class Client {

    public user:User

    constructor() {
        this.user = new User();
    }

    login(token:string):void {

    }
}