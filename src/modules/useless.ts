import { IModule } from "../framework/module";
import { ICommand } from "../framework/command";
import { EType, Helper } from "../framework/helper";
import { SelectUI } from "../framework/ui";
import { MessageEmbed } from "discord.js";

const BONK_GIFS = [
    // "https://media.tenor.co/videos/390f0c49262c8581a66e5fe0799984b5/mp4",
    // "https://media.tenor.co/videos/be8c3507c4afb089deab987ea363fb2a/mp4",
    "https://media.tenor.com/images/59d86f655ce0640bce42d75d786c4492/tenor.gif",

]
const HUG_GIFS = [
    "https://media.giphy.com/media/e3DlZj2QRzFPiZw0ED/giphy.gif",
    "https://i.imgur.com/wrJ0RQB.gif",
]


var CommandUselessBonk:ICommand = {
    name: "bonk",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [
        {
            name: "message",
            optional: true,
            type: EType.String
        }
    ],
    requiredPermission: "useless.bonk",
    handle: async (c) => {
        var gif = BONK_GIFS[Math.floor(Math.random() * BONK_GIFS.length)]
        const embed = new MessageEmbed()
            .setDescription(`${c.author.username} bonks ${c.args[0]}`)
            .setImage(gif)
        c.channel.send(embed)
    }
}


var CommandUselessHug:ICommand = {
    name: "hug",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [
        {
            name: "message",
            optional: true,
            type: EType.String
        }
    ],
    requiredPermission: "useless.bonk",
    handle: async (c) => {
        var gif = HUG_GIFS[Math.floor(Math.random() * HUG_GIFS.length)]
        const embed = new MessageEmbed()
            .setDescription(`${c.author.username} hugs ${c.args[0]}`)
            .setImage(gif)
        c.channel.send(embed)
    }
}

export var ModuleUseless:IModule = {
    name: "useless",
    commands: [
        CommandUselessBonk,
        CommandUselessHug,
    ],
    handlers: [],
    init: async () => {
        
    }
}
