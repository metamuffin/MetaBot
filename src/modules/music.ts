import { IModule } from "../framework/module";
import { CommandContext, ICommand } from '../framework/command';
import { EType, IdentifiedClass, Helper } from '../framework/helper';
import { StreamDispatcher, TextChannel, User, VoiceChannel, VoiceConnection } from "discord.js";
import ytsr from "ytsr"
import ytdl from "ytdl-core"

interface PlaylistElement {
    display_title: string,
    display_author: string,
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
        
        if (this.loop) this.playlist.push(next)
        
        this.tchannel.send({embed:{
            color: 0x00FF00,
            title: next?.display_title,
            description: "Now Playing."
        }})

        this.isPlaying = true;
        this.currentTitle = next
        if (!this.connection) this.tchannel.send("Internal Error: 234124325")
        this.streamDispatcher = this.connection?.play(ytdl(next?.url))
            .on("close",() => {
                console.log("Stream closed");
                this.isPlaying = false;
                this.currentTitle = undefined;
                this.next()
            })
    }

    async add(search:string){
        var info = await ytdl.getInfo(search)
        if (this.isPlaying){
            this.tchannel.send({embed:{
                color: 0x00FF00,
                title: info.player_response.videoDetails.title,
                description: "Playback scheduled."
            }})
        }
        this.playlist.push({
            display_title: info.player_response.videoDetails.title,
            display_author: info.player_response.videoDetails.author,
            url: info.video_url
        })

        
        this.ensurePlaying()
        
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
        var skipped = (this.voters.length) >= Math.ceil((this.vchannel.members.size - 1) / 2)
        
        this.tchannel.send({embed:{
            color:0xFFFF00,
            title: (skipped) ? "Skipped" : "",
            description: `Voteskip (${this.voters.length} / ${Math.ceil((this.vchannel.members.size - 1) / 2)})`
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

function getMusicPlayerForUser(c: CommandContext): MusicPlayer | undefined {
    if (c.message.member?.voice.channel) {
        var player = getMusicPlayer(c.message.member?.voice.channel)
        if (!player) {
            c.err(c.translation.error,c.translation.music.no_player_found)
            return undefined
        }
        return player
    } else {
        c.err(c.translation.error,c.translation.music.play.not_in_a_voicechannel)
    }
    return undefined
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
            var url = ""
            if (c.args[0].match(/https?:\/\/.+/i)) {
                url = c.args[0]
            } else {
                var results = await ytsr(c.args[0],{limit:1})
                console.log(results);
                
                for (const r of results.items) {
                    if (r.type == "video") {
                        url = r.link
                    }
                }
            }

            var player = getMusicPlayer(c.message.member.voice.channel)
            if (!player) {
                player = new MusicPlayer(c.message.member.voice.channel,c.channel,await c.getAuthorLang())
            }
            player?.add(url)

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
        var player = getMusicPlayerForUser(c)
        if (!player) return
        player.voteskip(c.author)
    }
}

var CommandMusicVolume:ICommand = {
    name: "volume",
    alias: ["vol"],
    argtypes: [
        {
            name: "Volume",
            optional: false,
            type: EType.Float
        }
    ],
    requiredPermission: "music.volume",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        var player = getMusicPlayerForUser(c)
        if (!player) return
        player.streamDispatcher?.setVolume(c.args[0])
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
        var player = getMusicPlayerForUser(c)
        if (!player) return
        player.loop = c.args[0]
        if (player.isPlaying && player.currentTitle) player.playlist.push(player.currentTitle)
        c.log("",(c.args[0]) ? c.translation.music.loop.state_updated_enable :  c.translation.music.loop.state_updated_disable)
    }
}

var CommandMusicQueue:ICommand = {
    name: "queue",
    alias: ["q"],
    argtypes: [],
    requiredPermission: "music.queue",
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        var player = getMusicPlayerForUser(c)
        if (!player) return
        var output = ""
        for (const i of player.playlist) {
            output += `[${i.display_title.replace(/[\[\]]/,"")}](${i.url})\n`
        }
        if (player.playlist.length == 0) output = "*nothing enqueued*"
        c.log("Player Queue",output)
    }
}

export var ModuleMusic:IModule = {
    name: "music",
    commands: [
        CommandMusicPlay,
        CommandMusicSkip,
        CommandMusicLoop,
        CommandMusicQueue,
        CommandMusicVolume,
    ],
    handlers: [
        
    ],
    init: async () => {
        
    }
}