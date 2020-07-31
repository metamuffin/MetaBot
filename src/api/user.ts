import { HasID } from "./misc.ts"
import { VoiceChannel } from "./channel.ts"


export class User extends HasID{
    public id:string = ""
    public voiceChannel: VoiceChannel | undefined
}