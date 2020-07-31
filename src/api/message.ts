import { User } from "./user.ts";
import { Guild } from "./guild.ts";
import { TextChannel } from "./channel.ts";
import { HasID } from "./misc.ts"


export class Message extends HasID{

    public author:User
    public guild:Guild
    public channel:TextChannel
    public content:string = ""

    constructor() {
        super()
        this.author = new User()
        this.guild = new Guild()
        this.channel = new TextChannel()
    }

    async delete():Promise<void> {

    }
    async reply():Promise<Message> {
        return new Message()
    }
    async react(s:string) {
        
    }

}