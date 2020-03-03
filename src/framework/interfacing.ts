import { VoidCallback } from "./types";
import { Context } from "./command";
import { Message, ColorResolvable, MessageReaction, User } from "discord.js";

export interface InterfaceOption {
    text:string,
    icon:string,
    callback:VoidCallback
}
export interface InterfaceConfig {
    public:boolean,
    allowedIds:Array<number>
    color:ColorResolvable
}

export type InterfaceOptionList = Array<InterfaceOption>;


export class Interface {
    public context:Context
    public prompt:string
    public options:InterfaceOptionList
    public config:InterfaceConfig

    public message:Message|null = null

    constructor(context_:Context,prompt_:string,options_:InterfaceOptionList,config_:InterfaceConfig) {
        this.context = context_
        this.prompt = prompt_
        this.options = options_
        this.config = config_
    }

    public send():void {
        var messageContent:string = ""
        for (let optionCounter = 0; optionCounter < this.options.length; optionCounter++) {
            const option = this.options[optionCounter];
            messageContent += `\n${optionCounter+1}. :${option.icon}: ${option.text}`        
        }

        this.context.channel.send({embed:{
            color: this.config.color,
            title: this.prompt,
            description: messageContent,
            //timestamp: new Date(),
            footer: {
              text: ``
            }
        }})
        .then((msg) => {
            this.message = (msg instanceof Message) ? msg : null
            for (let optionCounter = 0; optionCounter < this.options.length; optionCounter++) {
                const option = this.options[optionCounter];
                this.message?.react(option.icon)
            }

        })

        InterfaceHandler.

    }
}

export class InterfaceHandler {
    public static onReaction(reaction:MessageReaction,user:User):boolean{
        return false
    }
}