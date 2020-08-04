import { IModule } from "../framework/module.ts";
import { ICommand } from '../framework/command.ts';
import { EType, IdentifiedClass } from '../framework/helper.ts';
import { App } from "../framework/core.ts";
import { VoiceChannel, VoiceConnection } from "../api/channel.ts";
import { TextChannel } from "../api/channel.ts";

interface PlaylistElement {
    display: string,
    url: string
}


export class VoiceAssistantPlayer extends IdentifiedClass {
    public vchannel:VoiceChannel
    public tchannel:TextChannel
    public connection:VoiceConnection|undefined = undefined
    public playlist:Array<PlaylistElement> = []
    public isPlaying:boolean = false
    public skipvotes:number = 0

    constructor(vchannel:VoiceChannel,tchannel:TextChannel){
        super()
        this.vchannel = vchannel
        this.tchannel = tchannel
        players.push(this)
        this.create()
    }

    create(){
        this.vchannel.join().then((con) => {
            this.connection = con;
        })
    }
    destroy(){
        this.connection?.disconnect()
        players.splice(players.findIndex((e) => { e.id == this.id }))
    }

    start() {
        
        
        
        
        this.vchannel.members.forEach(async (user) => { 
            console.log(user.displayName);
            
            var receiver = await this.connection?.createReceiver()
            console.log();
            
            receiver?.on("opus",(u:any,buff:any) => {
                console.log(u);
                console.log(buff);
                
                
            })
        })
        /*this.connection?.receivers.forEach((recv) => {
            if (recv.voiceConnection.client.user.id == App.client.user.id) return
            var receiver:VoiceReceiver = recv.voiceConnection.createReceiver()
            receiver.on("opus",(user,buff) => {
                console.log(user.id);
                console.log(buff.toString());                
            })
        })*/
    
    }

    stop() {
        this.destroy()
    } 
    

}

var players:Array<VoiceAssistantPlayer> = []

var getVoiceAssistantPlayer = (channel:VoiceChannel):VoiceAssistantPlayer|undefined => {
    for (const p of players) {
        if (p.vchannel.id = channel.id) return p
    }
    return undefined;
}


var CommandVoiceAssistantStart:ICommand = {
    name: "startva",
    alias: ["sva"],
    argtypes: [],
    requiredPermission: "voice-assistant.play",
    subcommmands: [],
    useSubcommands:false,
    handle: (c) => {
        if (c.message.author.voiceChannel) {
            var player = getVoiceAssistantPlayer(c.message.author.voiceChannel)
            if (!player) {
                player = new VoiceAssistantPlayer(c.message.author.voiceChannel,c.channel)
                c.log(c.translation.voice_assistant.startva.ok,"")
            }
            player?.start()


        } else {
            c.err(c.translation.error,c.translation.voice_assistant.play.not_in_a_voicechannel)
        }
    }
}

var CommandVoiceAssistantStop:ICommand = {
    name: "stopva",
    alias: [],
    argtypes: [],
    requiredPermission: "voice-assistant.stop",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        if (c.message.author.voiceChannel) {
            var player = getVoiceAssistantPlayer(c.message.author.voiceChannel)
            if (!player) {
                c.err(c.translation.error,c.translation.voice_assistant.no_player_found)
                return
            }
            player.stop()
            c.log(c.translation.voice_assistant.stopva.ok,"")
        } else {
            c.err(c.translation.error,c.translation.voice_assistant.play.not_in_a_voicechannel)
        }
    }
}


export var ModuleVoiceAssistant:IModule = {
    name: "voice_assistant",
    commands: [
        CommandVoiceAssistantStart,
        CommandVoiceAssistantStop
    ],
    handlers: [],
    init: async () => {
        
    }
}
