import { HasID } from "./misc.ts"


export type Channel = TextChannel | VoiceChannel

export class TextChannel extends HasID{
    constructor() {
        super()
    }

    async send(message:any):Promise<void> {

    }
}

export class VoiceChannel {

    public members:Array<any> = []

    constructor() {
        
    }
}