import { EType, Helper } from "./helper";
import { Message, Channel, GuildMember, User, TextChannel, Client } from "discord.js";
import { IModule } from "./module";
import { App } from "./core";

export interface IArgument {
    type:EType,
    name:string,
    optional:boolean
}

export interface ICommand {
    name:string,
    alias:Array<string>,
    argtypes:Array<IArgument>,
    useSubcommands:boolean,
    subcommmands:Array<ICommand>,
    requiredPermission:string|null,

    handle: (context: CContext) => void,
    


}

export class CContext {
    public args:Array<[EType,any]> = [];
    public channel:TextChannel
    public author:User
    public message:Message
    public translation:any

    constructor (event:Message,module:IModule, callstack:Array<ICommand>) {
        this.message = event
        this.author = event.author
        if (!(event.channel instanceof TextChannel)){
            throw new Error("Cannot use Commands in DM Channels")
            return
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : (():any=>{return null})()
        this.translation = Helper.getUserTranslation(this.message.author)
    }

    public log = (title:string,description:string):void => {
        this.send(title,description,"log")
    }
    public err = (title:string,description:string):void => {
        this.send(title,description,"error")
    }

    public send = (title:string,description:string,color:string|number) => {
        if (typeof color == "string"){
            switch (color) {
                case "log":
                    color = 0xa70fff
                    break;
                case "error":
                    color = 0xff0000
                    break;

                default:
                    break;
            }
        }
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