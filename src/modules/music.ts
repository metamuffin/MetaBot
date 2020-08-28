import { IModule } from "../framework/module";
import { ICommand } from '../framework/command';
import { EType, IdentifiedClass, Helper } from '../framework/helper';
import { StreamDispatcher, TextChannel, User, VoiceChannel, VoiceConnection } from "discord.js";
const ytdl:any = null


interface PlaylistElement {
    display: string,
    url: string
}


export class MusicPlayer extends IdentifiedClass {
    public vchannel:VoiceChannel
    public tchannel:TextChannel
    public connection:VoiceConnection|undefined = undefined
    public playlist:Array<PlaylistElement> = []
    public isPlaying:boolean = false
    public voters:Array<string> = [];
    public streamDispatcher:StreamDispatcher|undefined = undefined;
    public language:string = "en";
    public loop:boolean = false;
    public currentTitle:PlaylistElement|undefined = undefined

    constructor(vchannel:VoiceChannel,tchannel:TextChannel, lang:string){
        super()
        this.language = lang
        this.vchannel = vchannel
        this.tchannel = tchannel
        players.push(this)
        this.create()
    }

    async create(){
        this.connection = await this.vchannel.join();
    }
    async destroy(){
        this.connection?.disconnect()
        var id = this.id
        setTimeout(function() { players.splice(players.findIndex((e) => { e.id == id })) },0)
    }

    async next(){
        this.voters = []
        var next = this.playlist.shift()
        if (!next){
            this.tchannel.send({embed:{
                color: 0x00FF00,
                title: "Queue empty!",
                description: "Playback stopped"
            }})
            setTimeout(() => {
                if (!this.isPlaying) this.destroy()
            },10000)
            return
        }
        
        if (this.loop) this.playlist.push( next )
        
        this.tchannel.send({embed:{
            color: 0x00FF00,
            title: next?.display,
            description: "Now Playing."
        }})

        this.isPlaying = true;
        this.currentTitle = next
        if (!this.connection) this.tchannel.send("Internal Error: 234124325")
        /*this.streamDispatcher = this.connection?.playStream(ytdl(next?.url))
            .on("end",() => {
                this.isPlaying = false;
                this.currentTitle = undefined;
                this.next()
                
            })*/
    }

    async add(search:string){
        ytdl.getInfo(search,(err:any,info:any) => {
            if (err) {
                console.log(err)
                this.tchannel.send({embed:{
                    color:0xFF0000,
                    title: "ERROOOOOOOOOOOOOOOR",
                    description: "Uff..."
                }})
                return
            };
            if (this.isPlaying){
                this.tchannel.send({embed:{
                    color: 0x00FF00,
                    title: info.player_response.videoDetails.title,
                    description: "Playback scheduled."
                }})
            }
            this.playlist.push({
                display: info.player_response.videoDetails.title,
                url: info.video_url
            })

            
            this.ensurePlaying()
        })
    }

    async voteskip(user:User){
        if (!this.isPlaying){
            this.tchannel.send({embed:{
                color:0xFF0000,
                title: "Error",
                description: "Nothing is currently playing."
            }})
            return
        }
        if (this.voters.includes(user.id)){
            this.tchannel.send({embed:{
                color:0xFF0000,
                title: "STOP!",
                description: "You can only vote once!"
            }})
            return
        }
        this.voters.push(user.id)
        var skipped = (this.voters.length) >= Math.ceil(this.vchannel.members.size / 2)
        
        this.tchannel.send({embed:{
            color:0xFFFF00,
            title: (skipped) ? "Skipped" : "",
            description: `Voteskip (${this.voters.length} / ${Math.ceil(this.vchannel.members.size / 2)})`
        }})
        
        if (skipped){
            this.streamDispatcher?.end()
        }
        
    }

    async ensurePlaying(){
        if (!this.isPlaying) await this.next()
    }
}

var players:Array<MusicPlayer> = []

var getMusicPlayer = (channel:VoiceChannel):MusicPlayer|undefined => {
    for (const p of players) {
        if (p.vchannel.id = channel.id) return p
    }
    return undefined;
}


var CommandMusicPlay:ICommand = {
    name: "play",
    alias: ["p"],
    argtypes: [
        {
            name: "URL / Name",
            optional: false,
            type: EType.String
        }
    ],
    requiredPermission: "music.play",
    subcommmands: [],
    useSubcommands:false,
    handle: async (c) => {
        if (c.message?.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member.voice.channel)
            if (!player) {
                player = new MusicPlayer(c.message.member.voice.channel,c.channel,await c.getAuthorLang())
            }
            player?.add(c.args[0])

        } else {
            c.err(c.translation.error,c.translation.music.play.not_in_a_voicechannel)
        }
    }
}

var CommandMusicSkip:ICommand = {
    name: "skip",
    alias: ["n"],
    argtypes: [],
    requiredPermission: "music.vote-skip",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        if (c.message?.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member.voice.channel)
            if (!player) {
                c.err(c.translation.error,c.translation.music.no_player_found)
                return
            }
            player.voteskip(c.author)
        } else {
            c.err(c.translation.error,c.translation.music.play.not_in_a_voicechannel)
        }
    }
}

var CommandMusicVolume:ICommand = {
    name: "skip",
    alias: ["n"],
    argtypes: [],
    requiredPermission: "music.vote-skip",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        if (c.message.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member?.voice.channel)
            if (!player) {
                c.err(c.translation.error,c.translation.music.no_player_found)
                return
            }
            player.streamDispatcher?.setVolume(1)
        } else {
            c.err(c.translation.error,c.translation.music.play.not_in_a_voicechannel)
        }
    }
}


var CommandMusicLoop:ICommand = {
    name: "loop",
    alias: ["lp"],
    argtypes: [
        {
            name: "State",
            optional: false,
            type: EType.Boolean
        }
    ],
    requiredPermission: "music.loop",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        if (c.message.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member?.voice.channel)
            if (!player) {
                c.err(c.translation.error,c.translation.music.no_player_found)
                return
            }
            player.loop = c.args[0]
            if (player.isPlaying && player.currentTitle) player.playlist.push(player.currentTitle)
            c.log("",(c.args[0]) ? c.translation.music.loop.state_updated_enable :  c.translation.music.loop.state_updated_disable)
        } else {
            c.err(c.translation.error,c.translation.music.play.not_in_a_voicechannel)
        }
    }
}



export var ModuleMusic:IModule = {
    name: "music",
    commands: [
        CommandMusicPlay,
        CommandMusicSkip,
        CommandMusicLoop
    ],
    handlers: [
        
    ],
    init: async () => {
        
    }
}