import { IModule } from "../framework/module";
import { CommandContext, ICommand } from '../framework/command';
import { EType, IdentifiedClass, Helper, logWithTags } from '../framework/helper';
import { StreamDispatcher, TextChannel, User, VoiceChannel, VoiceConnection } from "discord.js";
import yts from "yt-search"
import ytdl from "ytdl-core"
import { TranslationModel } from "../translation";
import { GenericContext } from "../framework/context";

interface PlaylistElement {
    display_title: string,
    display_author: string,
    url: string
}

export class MusicPlayerControler {
    onTrackEnd() { }
}

export class MusicPlayer extends IdentifiedClass {
    public vchannel: VoiceChannel
    public tchannel: TextChannel
    public connection: VoiceConnection | undefined = undefined
    public playlist: Array<PlaylistElement> = []
    public dlstream: any = undefined

    public isPlaying: boolean = false
    public isPaused: boolean = false;

    public voters: Array<string> = [];
    public streamDispatcher: StreamDispatcher | undefined = undefined;
    public loop: boolean = false;
    public currentTitle: PlaylistElement | undefined = undefined
    public translation: TranslationModel;
    public controler: MusicPlayerControler | undefined = undefined;

    constructor(vchannel: VoiceChannel, tchannel: TextChannel, translation: TranslationModel) {
        super()
        this.translation = translation
        this.vchannel = vchannel
        this.tchannel = tchannel
        players.push(this)
    }

    pause() { this.streamDispatcher?.pause(); this.isPaused = true }
    resume() { this.streamDispatcher?.resume(); this.isPaused = false }

    async create() {
        this.connection = await this.vchannel.join();
    }
    async destroy() {
        this.connection?.disconnect()
        var id = this.id
        setTimeout(function () { players.splice(players.findIndex((e) => { e.id == id })) }, 0)
    }

    async next() {
        this.voters = []
        var next = this.playlist.shift()
        if (!next) {
            this.tchannel.send({
                embed: {
                    color: 0x00FF00,
                    title: this.translation.music.queue_empty,
                    description: this.translation.music.playback_stopped
                }
            })
            setTimeout(() => {
                if (!this.isPlaying) this.destroy()
            }, 10000)
            return
        }

        if (this.loop) this.playlist.push(next)

        this.tchannel.send({
            embed: {
                color: 0x00FF00,
                title: next?.display_title,
                description: this.translation.music.now_playing
            }
        })

        this.isPlaying = true;
        this.currentTitle = next
        if (!this.connection) return this.tchannel.send("Internal Error: 234124325")
        this.dlstream = ytdl(next?.url)
        this.streamDispatcher = this.connection?.play(this.dlstream)
            .on("close", () => {
                logWithTags(["MUSICPLAYER", "STREAM"], "Stream closed");
                this.isPlaying = false;
                this.currentTitle = undefined;
                this.next()
            })
    }

    async add(item: PlaylistElement) {



        if (this.isPlaying) {
            this.tchannel.send({
                embed: {
                    color: 0x00FF00,
                    title: item.display_title,
                    description: this.translation.music.playback_scheduled
                }
            })
        }
        this.playlist.push({
            display_title: item.display_title,
            display_author: item.display_author,
            url: item.url
        })


        this.ensurePlaying()

    }

    async voteskip(user: User) {
        if (!this.isPlaying) {
            this.tchannel.send({
                embed: {
                    color: 0xFF0000,
                    title: this.translation.error,
                    description: this.translation.music.nothing_playing
                }
            })
            return
        }
        if (this.voters.includes(user.id)) {
            this.tchannel.send({
                embed: {
                    color: 0xFF0000,
                    title: this.translation.music.stop,
                    description: this.translation.music.only_one_vote
                }
            })
            return
        }
        this.voters.push(user.id)
        var skipped = (this.voters.length) >= Math.ceil((this.vchannel.members.size - 1) / 2)

        this.tchannel.send({
            embed: {
                color: 0xFFFF00,
                title: (skipped) ? this.translation.music.skipped : "",
                description: `${this.translation.music.voteskip} (${this.voters.length} / ${Math.ceil((this.vchannel.members.size - 1) / 2)})`
            }
        })

        if (skipped) {
            this.streamDispatcher?.end()
        }

    }

    async ensurePlaying() {
        if (!this.isPlaying) await this.next()
        else if (this.isPaused && !this.controler) this.streamDispatcher?.resume()
    }
}

var players: Array<MusicPlayer> = []

export var getMusicPlayer = (channel: VoiceChannel): MusicPlayer | undefined => {
    for (const p of players) {
        if (p.vchannel.id == channel.id) return p
    }
    return undefined;
}

function getMusicPlayerForUser(c: CommandContext): MusicPlayer | undefined {
    if (c.message.member?.voice.channel) {
        var player = getMusicPlayer(c.message.member?.voice.channel)
        if (!player) {
            c.err(c.translation.error, c.translation.music.no_player_found)
            return undefined
        }
        return player
    } else {
        c.err(c.translation.error, c.translation.music.play.not_in_a_voicechannel)
    }
    return undefined
}

var CommandMusicPlay: ICommand = {
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
    useSubcommands: false,
    handle: async (c) => {
        if (c.args[0].length < 2) return 
        if (c.message?.member?.voice.channel) {
            
            var opts: yts.OptionsWithQuery = {
                query: c.args[0],
                pages: 1,
            }
            var results = await yts(opts)
            var vidinfo = results.videos[0]
            if (!vidinfo) return c.err(c.translation.error, "No video found")
            var player = getMusicPlayer(c.message.member.voice.channel)
            if (!player) {
                player = new MusicPlayer(c.message.member.voice.channel, c.channel, c.translation)
                await player.create()
            }
            player?.add({
                display_title: vidinfo.title,
                display_author: vidinfo.author.name,
                url: vidinfo.url,
            })

        } else {
            c.err(c.translation.error, c.translation.music.play.not_in_a_voicechannel)
        }
    }
}

var CommandMusicSkip: ICommand = {
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

export function preprocessMusicVolume(vol: number, no_min: boolean = false): undefined | number {
    if (((vol < 0.2 && !no_min) || vol > 3) && vol != -1) return undefined
    if (vol == -1) vol = 10000
    return vol
}

var CommandMusicVolume: ICommand = {
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
        console.log(c.args);
        var vol = preprocessMusicVolume(c.args[0])
        if (!vol) return c.err(c.translation.error, "Volume out of range")
        var player = getMusicPlayerForUser(c)
        if (!player) return
        player.streamDispatcher?.setVolume(vol)
    }
}


var CommandMusicLoop: ICommand = {
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
        c.log("", (c.args[0]) ? c.translation.music.loop.state_updated_enable : c.translation.music.loop.state_updated_disable)
    }
}

var CommandMusicQueue: ICommand = {
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
            output += `[${i.display_title.replace(/[\[\]]/, "")}](${i.url})\n`
        }
        if (player.playlist.length == 0) output = `*${c.translation.music.queue.nothing_enqueued}*`
        c.log("Player Queue", output)
    }
}

export var ModuleMusic: IModule = {
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