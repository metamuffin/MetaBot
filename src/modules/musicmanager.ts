import { IModule } from "../framework/module";
import { EType, Helper } from "../framework/helper";
import { ICommand } from "../framework/command";
import { getMusicPlayer, MusicPlayer, MusicPlayerControler } from "./music";
import { App } from "../framework/core";

class MuteAllPlayerControler extends MusicPlayerControler {
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
                }
            } else {
                if (this.player.isPaused) {
                    this.player.resume();
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


class AutoVolumePlayerControler extends MusicPlayerControler {
    private player: MusicPlayer;
    private factor: number;
    private originalVolume: number = 1;
    private speakingLast: boolean = false
    private updater: any;

    constructor(player: MusicPlayer, factor: number) {
        super();
        this.factor = factor
        this.player = player;
        player.controler = this;
        this.updater = async () => {
            var speakingCount = this.player.vchannel.members
                .map((member) => member.voice.speaking)
                .reduce((a, v) => a + (v ? 1 : 0), 0);
            console.log(speakingCount);
            if (speakingCount > 1 && this.player.streamDispatcher) {
                if (!this.speakingLast) {
                    this.originalVolume = this.player.streamDispatcher.volume
                    this.player.streamDispatcher?.setVolume(this.originalVolume * this.factor)
                    this.speakingLast = true
                }
            } else {
                if (this.speakingLast && this.player.streamDispatcher) {
                    this.player.streamDispatcher.setVolume(this.originalVolume)
                    this.speakingLast = false
                }
            }
        }
        this.player.connection?.on("speaking", this.updater)
        console.log(!this.player);
    }
    public destroy() {
        this.player.connection?.off("speaking", this.updater)
        this.player.ensurePlaying();
        this.player.controler = undefined;
    }
}



var CommandMusicManagerPlayMuteAll: ICommand = {
    name: "playonallmuted",
    alias: ["amongusmode", "agmode", "poam", "playallmute"],
    requiredPermission: "musicmanager.mute-all-mode",
    argtypes: [
        {
            name: "State",
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
                if (player.controler) return c.err(c.translation.error, "This music player already uses a automated controller");
                var agcont = new MuteAllPlayerControler(player);
                player.pause()
            } else {
                if (player.controler instanceof MuteAllPlayerControler) {
                    player.controler.destroy();
                } else {
                    c.err("Mode was not enabled", "");
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


var CommandMusicManagerAutoVolume: ICommand = {
    name: "autovolume",
    alias: ["autovol", "av", "decreasevolumeonanyspeaking"],
    requiredPermission: "musicmanager.auto-volume-mode",
    argtypes: [
        {
            name: "State",
            optional: false,
            type: EType.Boolean,
        },
        {
            name: "Decreasing Factor",
            optional: false,
            type: EType.Float,
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        if (c.message?.member?.voice.channel) {
            var player = getMusicPlayer(c.message.member.voice.channel);
            if (!player) return
            if (c.args[0]) {
                if (player.controler) return c.err(c.translation.error, "This music player already uses a automated controller");

                var vol = 0.5

                var agcont = new AutoVolumePlayerControler(player, vol);
            } else if (player.controler instanceof AutoVolumePlayerControler) player.controler.destroy();
            else c.err("Mode was not enabled", "");
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
    commands: [CommandMusicManagerPlayMuteAll, CommandMusicManagerAutoVolume],
    handlers: [],
    init: async () => { },
};
