import { VoidCallback } from "./types.ts";
import { CommandContext } from "./command.ts";
import { IdentifiedClass } from "./helper.ts";
import { App } from "./core.ts";
import { MessageReaction } from "../api/reaction.ts";
import { Message } from "../api/message.ts";
import { User } from "../api/user.ts";
import { ColorResolvable } from "../api/misc.ts";


export interface SelectUIOption {
    text:string,
    icon:string,
    unicode:string,
    callback:VoidCallback
}
export interface SelectiUIConfig {
    public:boolean,
    color:ColorResolvable
}

export type SelectUIOptionList = Array<SelectUIOption>;

export class GenericUI extends IdentifiedClass {
    public message:Message|null = null
    
    constructor(
        public context:CommandContext
        ) {
        super()
    }

    public handleMessageInteraction(message:Message): boolean {return false};
    public handleReactionInteraction(reaction:MessageReaction,user:User): boolean {return false};
}



export class SelectUI extends GenericUI {
    public prompt:string
    public options:SelectUIOptionList
    public config:SelectiUIConfig
    
    
    
    constructor(context:CommandContext,prompt:string,options:SelectUIOptionList,config:SelectiUIConfig) {
        super(context)
        this.prompt = prompt
        this.options = options
        this.config = config 
    }

    public async send():Promise<void> {
        var messageContent:string = ""
        for (let optionCounter = 0; optionCounter < this.options.length; optionCounter++) {
            const option = this.options[optionCounter];
            messageContent += `\n${optionCounter+1}. :${option.icon}: ${option.text}`        
        }
        
        var message = await this.context.channel.send({embed:{
            color: this.config.color,
            title: this.prompt,
            description: messageContent,
            footer: {
                text: ``
            }
        }})
        .then((msg) => {
            this.message = (msg instanceof Message) ? msg : null
            if (this.message == null) console.log("Internal Error: 2193489489023");
            for (let optionCounter = 0; optionCounter < this.options.length; optionCounter++) {
                const option = this.options[optionCounter];
                /*var emoji = App.client.emojis.find((e) => {console.log(e.name); return e.name == option.icon})
                if (!emoji) emoji = this.context.guild.emojis.find((e) => {console.log(e.name); return e.name == option.icon})
                if (!emoji) return this.context.err("Emoji not found :(","")
                console.log(emoji);*/
                
                this.message?.react(option.unicode)
            }
            
        })
        
        InterfaceHandler.registerInterface(this)
        
    }
    
    public handleReactionInteraction(reaction:MessageReaction,user:User):boolean {
        console.log(reaction.emoji.name);
        
        var chosen = this.options.find((o) => o.icon == reaction.emoji.name)
        if (!chosen) return false
        chosen.callback()
        this.destroy()
        
        return true
    }

    // Dont accept messages to this UI
    public handleMessageInteraction(message: Message): boolean {
        return false
    }
    
    public destroy():void {
        if (!this.message) return console.log("Internal Error 1193129381293");
        this.message.delete()
        InterfaceHandler.unregisterInterface(this)
    }
    
}

export class InterfaceHandler {
    private static interfaces:Array<GenericUI> = []

    public static registerInterface(i:GenericUI):void {
        this.interfaces.push(i)
    }

    public static unregisterInterface(i:GenericUI):void {
        this.interfaces.splice(this.interfaces.findIndex(e=>i.id==e.id),1)
    }

    public static onReaction(reaction:MessageReaction,user:User):boolean{
        for (const i of this.interfaces) {
            if (!i.message) continue
            if (i.message.id == reaction.message.id){
                return i.handleReactionInteraction(reaction,user)
            }
        }
        
        return false
    }

    public static onMessage(message:Message):boolean {
        for (const i of this.interfaces) {
            if (!i.message) continue
            if (i.context.channel.id == message.channel.id && i.context.author.id == message.author.id){
                return i.handleMessageInteraction(message)
            }
        }
        
        return false
    }
}