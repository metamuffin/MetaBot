import { IModule } from "./module.ts";
import { Helper } from "./helper.ts";
import { Message } from "../api/message.ts";
import { TextChannel } from "../api/channel.ts";
import { Guild } from "../api/guild.ts";
import { User } from "../api/user.ts";
import { ColorResolvable } from "../api/misc.ts";
import { Database } from "./database.ts";
import { ServerModel, UserModelForServer, UserModel } from "../models.ts";



export class GenericContext {
    public channel:TextChannel
    public author:User
    public message:Message
    public translation:any
    public server:Guild

    constructor (event:Message) {
        this.message = event
        this.author = event.author
        this.server = event.guild
        if (!(event.channel instanceof TextChannel)){
            throw new Error("Cannot use Commands in DM Channels")
            return
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : (():any=>{return null})()
        this.translation = Database.getTranslation(this.message.author.id)
    }

    public async log(title:string,description:string):Promise<Message> {
        return await this.send(title,description,0xa70fff)
    }
    
    public async err (title:string,description:string):Promise<Message> {
        return await this.send(title,description,0xff0000)
    }

    public async send(title:string,description:string,color:ColorResolvable): Promise<Message> {
        return await this.channel.send({embed:{
            color: color,
            title: title,
            description: description,
            footer: {
              text: ``
            }
        }});
    }
    
    public async getServerDoc():Promise<ServerModel> {
        return await Database.getServerDoc(this.server.id)
    }
    public async getAuthorDoc():Promise<UserModel> {
        return await Database.getUserDoc(this.author.id)
    }
    public async getAuthorDocForServer(): Promise<UserModelForServer>{
        return await Database.getUserDocForServer(this.author.id,this.server.id)
    }
    public async getAuthorLang():Promise<string> {
        return (await this.getAuthorDoc()).language
    }
}