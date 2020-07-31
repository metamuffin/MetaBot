import { HasID } from "./misc.ts"
import { Message } from "./message.ts"




export class MessageReaction extends HasID{
    public emoji:Emoji = new Emoji()
    public message:Message = new Message()
}

export class Emoji extends HasID{
    public name:string = "Nope"
}