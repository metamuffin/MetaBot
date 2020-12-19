import { ICommand } from "../command"
import { IModule } from "../module"
import { EType, Helper } from "../helper"
import { App } from "../core"
import { Database } from "../database"
import { TranslationModel } from "../../translation"


export function typeToName(type: EType, t: TranslationModel): string {
    var n = "Unknown"
    if (type == EType.String) n = t.core.general.types.string
    else if (type == EType.Integer) n = t.core.general.types.int
    else if (type == EType.Boolean) n = t.core.general.types.boolean
    else if (type == EType.Float) n = t.core.general.types.float
    else if (type == EType.MemberData) n = t.core.general.types.member
    else if (type == EType.MemberDataForServer) n = t.core.general.types.member
    else if (type == EType.Command) n = t.core.general.types.command
    return n
}


var CommandMiscAbout:ICommand = {
    name: "about",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        var out = "";
        out += "This Bot is powered by MetaBot.\n"
        out += "MetaBot is a open-source framework that makes creating bots easier by handling stuff like permissions, modules, data-storage and more.\n"
        out += "MetaBot is licenced under the GNU General Public Licence Version 3, so feel free to contribute or modify this project.\n"
        out += "See the source, issue-tracker, feauture-suggestions and documentation on https://www.github.com/MetaMuffin/MetaBot!"
        out += "Active contributers: only MetaMuffin :("
        c.log("About",out)
    }
}


var CommandMiscHelp:ICommand = {
    name: "help",
    alias: ["h"],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [
        {
            type: EType.String,
            name: "Command Path",
            optional: false
        }
    ],
    requiredPermission: null,
    handle: async (c) => {
        if (c.args[0] == ""){
            var outstr = ""
            for (const mod of App.modules) {
                if (!((await c.getServerDoc()).enabledModules.includes(mod.name))){
                    outstr += `~~${mod.name}~~: ${c.translation.misc.help.not_enabled}\n`
                    continue
                }
                outstr += `**__${mod.name}__**\n`
                for (const command of mod.commands) {
                    try{
                        //var unsafe_translation: any = c.translation
                        //var desc: string = `*${c.translation.misc.help.no_description}*`
                        //if (unsafe_translation[mod.name]) if (unsafe_translation[mod.name][command.name]?.description) unsafe_translation[mod.name][command.name].description
                        //outstr += `\u251c\u2500 **${command.name}:** ${desc}\n`
                        outstr += `\u251c\u2500 **${command.name}:**\n`
                    } catch (e) {
                        c.err("There may be something missing in the help because of a missing translation :(",`Error on \`${mod.name}.${command.name}\``)
                        console.log(`[ERROR] ${command.name}`);
                    }
                }
            }
            outstr += "\n" + c.translation.misc.help.more_help.replace("{0}",App.prefix) + "\n"
            outstr += c.translation.misc.help.path_desc + "\n"
            c.log(c.translation.misc.help.title_generic,outstr)
        } else {
            var find_command = (com:ICommand,names:Array<string>,path:Array<string>):string => {
                if (names.length < 1){
                    var out = ""
                    out += `**__${com.name}__**\n`
                    out += `${c.translation.misc.help.alias} ${com.alias.join(", ")}\n`
                    out += `${c.translation.misc.help.arguments}`
                    if (com.argtypes.length == 0) out += c.translation.misc.help.none + "\n"
                    else {
                        out += "\n"
                        for (const a of com.argtypes) {
                            out += `- \`${a.name}\`: ${typeToName(a.type,c.translation)} (${a.optional ? c.translation.misc.help.optional : c.translation.misc.help.required})\n`
                        }
                    }
                    out += `${c.translation.misc.help.help_description}: ${Helper.deepGet(c.translation,path)?.description || c.translation.misc.help.no_description}\n\n`
                    out += `${c.translation.misc.help.help_permission}: \`${com.requiredPermission}\`\n`
                    out += `${c.translation.misc.help.help_subcommands}: ${(com.useSubcommands) ? ("`" + com.subcommmands.map(sc=>sc.name).join("`, `") + "`") : c.translation.misc.help.none}` 
                    return out
                }
                if (com.useSubcommands){
                    for (const scom of com.subcommmands) {
                        if (scom.name == names[0] || scom.alias.includes(names[0])){
                            names.shift()
                            path.push(scom.name)
                            return find_command(scom,names,path)
                        }
                    }
                }
                return c.translation.core.general.command_not_found
            }

            var c_names:Array<string> = c.args[0].split(".")
            for (const mod of App.modules) {
                for (const com of mod.commands){
                    if (com.name == c_names[0] || com.alias.includes(c_names[0])) {
                        c_names.shift()
                        c.log(c.translation.misc.help.title_generic,find_command(com,c_names,[mod.name,com.name]))
                        return
                    }
                }
            }
            c.err(c.translation.error,c.translation.core.general.command_not_found)
        }
    }
}

/*
var CommandMiscEval:ICommand = {
    name: "eval",
    alias: ["exec"],
    argtypes: [
        {
            name: "Code",
            type: EType.String,
            optional: false
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    requiredPermission: "debug.exec",
    handle: (c) => {
        var p:any = null;
        try {
            p = eval(c.args[0]).toString()
        } catch (e) {
            c.err(c.translation.error,e)
        } finally {
            c.log("",`\`${p}\``)
        }
    }
}*/

export var CommandMiscEcho:ICommand = {
    name: "echo",
    alias: [],
    argtypes: [
        {
            name: "Text",
            type: EType.String,
            optional: false
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    requiredPermission: null,
    handle: (c) => {
        c.channel.send(c.args[0])
    }
}

export var ModuleMisc:IModule = {
    name: "misc",
    commands: [
        CommandMiscAbout,
        CommandMiscHelp,
        //CommandMiscEval,
        CommandMiscEcho
    ],
    handlers: [],
    init: async () => {
        
    }
}
