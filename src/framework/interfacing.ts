import { VoidCallback } from "./types";
import { Context } from "./command";
import { Message, ColorResolvable, MessageReaction, User } from "discord.js";
import { IdentifiedClass } from "./helper";

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


export class Interface extends IdentifiedClass {
    public context:Context
    public prompt:string
    public options:InterfaceOptionList
    public config:InterfaceConfig


    public message:Message|null = null

    constructor(context_:Context,prompt_:string,options_:InterfaceOptionList,config_:InterfaceConfig) {
        super()
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
            if (this.message == null) console.log("Internal Error: 2193489489023");
            for (let optionCounter = 0; optionCounter < this.options.length; optionCounter++) {
                const option = this.options[optionCounter];
                this.message?.react(option.icon)
            }

        })

        InterfaceHandler.registerInterface(this)

    }

    public handleInteraction(reaction:MessageReaction,user:User):boolean {

        // TODO
        
        this.destroy()

        return false
    }

    public destroy():void {
        if (!this.message) return console.log("Internal Error 1193129381293");
        this.message.delete()
    }
}

export class InterfaceHandler {
    private static interfaces:Array<Interface> = []

    public static registerInterface(i:Interface):void {
        this.interfaces.push(i)
    }

    public static unregisterInterface(i:Interface):void {
        this.interfaces.findIndex(e=>i.id==e.id)
    }

    public static onReaction(reaction:MessageReaction,user:User):boolean{
        for (const i of this.interfaces) {
            if (!i.message) continue
            if (i.message.id == reaction.message.id){
                return i.handleInteraction(reaction,user)
            }
        }
        
        return false
    }
}