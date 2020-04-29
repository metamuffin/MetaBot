import { TextChannel, User, Message, Guild, ColorResolvable } from "discord.js";
import { IModule } from "./module";
import { Helper } from "./helper";


export class GenericContext {
    public channel:TextChannel
    public author:User
    public message:Message
    public translation:any
    public guild:Guild

    constructor (event:Message) {
        this.message = event
        this.author = event.author
        this.guild = event.guild
        if (!(event.channel instanceof TextChannel)){
            throw new Error("Cannot use Commands in DM Channels")
            return
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : (():any=>{return null})()
        this.translation = Helper.getUserTranslation(this.message.author)
    }

    public log = (title:string,description:string):void => {
        this.send(title,description,0xa70fff)
    }
    
    public err = (title:string,description:string):void => {
        this.send(title,description,0xff0000)
    }

    public send = (title:string,description:string,color:ColorResolvable) => {
        this.channel.send({embed:{
            color: color,
            title: title,
            description: description,
            //timestamp: new Date(),
            footer: {
              text: ``
            }
          }});
    }
}