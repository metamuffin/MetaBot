import { User } from "./user.ts";
import { RespClientCredentialsGrant } from "./responses.ts";
import { API } from "./api.ts"

export class Client {

    public user:User|undefined
    public client_id: string
    public token:string|undefined;
    private client_secret:string
    
    constructor(id:string,secret:string) {
        this.client_id = id
        this.client_secret = secret;
        this.user = new User();
    }

    async refreshToken(){
        var resp:RespClientCredentialsGrant = await API.apiRequest("/oauth2/token","POST",{
            grant_type: "client_credentials",
            scope: 'indentify connections'
        })
        console.log(resp);
        this.token = resp.access_token
        //setInterval(this.refreshToken,resp.expires_in)
    }


    async login() {
        await this.refreshToken()
    }
}

