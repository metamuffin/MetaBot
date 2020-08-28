import { IModule } from "./module";
import { Helper } from "./helper";
import { Message, Guild, TextChannel, ColorResolvable, User } from "discord.js";

import { Database } from "./database";
import { ServerModel, UserModelForServer, UserModel } from "../models";
import { TranslationModel } from "../translation";



export class GenericContext {
    public channel:TextChannel
    public author:User
    public message:Message
    public translation:TranslationModel
    public server:Guild

    constructor (event:Message) {
        this.message = event
        this.author = event.author
        // TODO
        // @ts-ignore
        this.server = event.guild
        if (!(event.channel instanceof TextChannel)){
            throw new Error("Cannot use Commands in DM Channels")
            return
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : (():any=>{return null})()
        var t:any = {} // TODO
        this.translation = t
    }
    
    public async init() {
        var t = await Database.getTranslation(this.message.author.id)
        if (!t) return this.log("This language is missing", "The language you selected is not yet availible. Feel free to contribute to Metabot by translating. https://www.github.com/MetaMuffin/Metabot")
        this.translation = t
        await this.init2()
    }
    public async init2(){}

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
    public async updateAuthorDoc(doc: UserModel):Promise<void> {
        await Database.updateUserDoc(doc)
    }
    public async updateAuthorDocForServer(doc: UserModelForServer): Promise<void> {
        await Database.updateUserDocForServer(doc);
    }
    public async updateServerDoc(doc: ServerModel): Promise<void> {
        await Database.updateServerDoc(doc)
    }

}