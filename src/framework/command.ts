import { EType, Helper } from "./helper";
import { Message, Channel, GuildMember, User, TextChannel, Client, Guild, ColorResolvable } from "discord.js";
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

    handle: (context: Context) => void,
    


}

export class Context {
    public args:Array<any>;
    public channel:TextChannel
    public author:User
    public message:Message
    public translation:any
    public guild:Guild

    constructor (event:Message,module:IModule, callstack:Array<ICommand>, command:ICommand, args:Array<string>) {
        this.message = event
        this.author = event.author
        this.guild = event.guild
        if (!(event.channel instanceof TextChannel)){
            throw new Error("Cannot use Commands in DM Channels")
            return
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : (():any=>{return null})()
        this.translation = Helper.getUserTranslation(this.message.author)
        this.args = Helper.parseArguments(args.join(" "),command.argtypes,this);
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