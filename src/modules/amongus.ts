import { IModule } from "../framework/module";
import { EType, Helper } from "../framework/helper";
import { ICommand } from "../framework/command";
import { getMusicPlayer, MusicPlayer, MusicPlayerControler } from "./music";

class AmongusPlayerControler extends MusicPlayerControler {
    private player: MusicPlayer;
    private intervalHandle: NodeJS.Timeout;

    constructor(player: MusicPlayer) {
        super();
        this.player = player;
        player.controler = this;

        this.intervalHandle = setInterval(async () => {
            
            var notMuted = this.player.vchannel.members
                .map((member) => !member.voice.selfMute)
                .reduce((a, v) => a + (v ? 1 : 0), 0);
            if (notMuted > 3) {
                if (!this.player.isPaused) {
                    this.player.pause();
                    console.log("pause");
                }
            } else {
                if (this.player.isPaused) {
                    this.player.resume();
                    console.log("resume");
                }
            }
        }, 1000);
        console.log(!this.player);
    }
    public destroy() {
        clearInterval(this.intervalHandle);
        this.player.ensurePlaying();
        this.player.controler = undefined;
    }
}

var CommandAmongUsStart: ICommand = {
    name: "amongusmode",
    alias: ["agmode"],
    requiredPermission: "amongus.mode",
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
            if (!player) return
            if (c.args[0]) {
                if (player.controler) return c.err(c.translation.error, "Unknown 123235234");
                var agcont = new AmongusPlayerControler(player);
                player.pause()
            } else {
                if (player.controler instanceof AmongusPlayerControler) {
                    player.controler.destroy();
                } else {
                    c.err("Amongus mode was not enabled", "");
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
