import { IModule } from "../framework/module";
import { IHandler } from "../framework/handler";
import { Database } from "../framework/database";
import { EType, Helper } from "../framework/helper";
import { GenericContext } from "../framework/context";
import { ICommand } from "../framework/command";
import { DiscordAPIError } from "discord.js";
import { getMusicPlayer, MusicPlayer, MusicPlayerControler } from "./music";

class AmongusPlayerControler extends MusicPlayerControler {
    public player: MusicPlayer;

    constructor(player: MusicPlayer) {
        super();
        this.player = player;
    }
    public async update() {
        var notMuted = this.player.vchannel.members
            .map((member) => !member.voice.selfMute)
            .reduce((a, v) => (a + (v ? 1 : 0)), 0);
        if (notMuted > 1) {
            if(this.player.isPlaying) this.player.stop()
        } else {
            if(!this.player.isPlaying) this.player.next()
        }
    }
    public init() {
        setInterval(this.update, 2000);
    }
    public destroy() {
        this.player.ensurePlaying();
        this.player.controler = undefined;
    }
}

var CommandAmongUsStart: ICommand = {
    name: "amongusmode",
    alias: ["agmode"],
    requiredPermission: "debug.experimental-commands",
    argtypes: [
        {
            name: "Status",
            optional: false,
            type: EType.Boolean,
        },
    ],
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        if (c.message?.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member.voice.channel);
            if (!player) {
                player = new MusicPlayer(
                    c.message.member.voice.channel,
                    c.channel,
                    c.translation
                );
                await player.create()
            }
            if (c.args[0]) {
                player.playlist.push({display_author: "Blub",display_title: "blub",url: "https://www.youtube.com/watch?v=82rdLJWxRGM"})
                player.playlist.push({display_author: "Blub",display_title: "blub",url: "https://www.youtube.com/watch?v=82rdLJWxRGM"})
                player.playlist.push({display_author: "Blub",display_title: "blub",url: "https://www.youtube.com/watch?v=82rdLJWxRGM"})
                if (player.controler)
                    return c.err(c.translation.error, "Unknown 123235234");
                var agcont = new AmongusPlayerControler(player);
                player.controler = agcont;
                await player.ensurePlaying()
                agcont.init();
                await agcont.update()
            } else {
                if (player.controler instanceof AmongusPlayerControler) {
                    player.controler.destroy();
                } else {
                    c.err("Amongus mode not enabled", "");
                }
            }
        } else {
            c.err(
                c.translation.error,
                c.translation.music.play.not_in_a_voicechannel
            );
        }
    },
};

export var ModuleAmongUs: IModule = {
    name: "amongus",
    commands: [CommandAmongUsStart],
    handlers: [],
    init: async () => {},
};
