import { HasID } from "./misc.ts"
import { Message } from "./message.ts"


export type Channel = TextChannel | VoiceChannel

export class TextChannel extends HasID{
    constructor() {
        super()
    }

    async send(message:any):Promise<Message> {

    }

   
}

export class VoiceChannel extends HasID {

    public members:Array<any> = []

    constructor() {
        super()
    }

    async join(): Promise<VoiceConnection|undefined> {
        return undefined;
    }

}


export class VoiceConnection {
    async disconnect(){

    }
    async playStream(): Promise<StreamDispatcher> {
        return new StreamDispatcher()
    }
}

export class StreamDispatcher {
    end() {

    }

    setVolume(vol: number) {

    }
}