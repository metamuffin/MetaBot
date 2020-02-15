import { ICommand } from "../command"
import { IModule } from "../module"
import { EType } from "../helper"
import { App } from "../core"
import { Database } from "../database"






var CommandMiscAbout:ICommand = {
    name: "about",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        c.log("About","This bot was made using the MetaBot-Framework.")
    }
    
}


var CommandMiscBlub:ICommand = {
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
    handle: (c) => {
        if (c.args[0] == ""){
            var outstr = ""
            for (const mod of App.modules) {
                if (!Database.get().servers[c.guild.id].modules.includes(mod.name)){
                    outstr += `~~${mod.name}~~: Not Enabled\n`
                    continue
                }
                outstr += `**__${mod.name}__**\n`
                for (const command of mod.commands) {
                    
                    outstr += `\u251c\u2500 **${command.name}:** ${c.translation[mod.name][command.name].description || "No Description Specified."}\n`
                }
            }
            outstr += "\nMore help can be found with the command: `"+App.prefix+"help <name>`"
            c.log(c.translation.misc.help.title_generic,outstr)
        }
    }
}

var CommandMiscSave:ICommand = {
    name: "save",
    alias: [],
    argtypes: [],
    requiredPermission: "misc.save",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        Database.save()
        c.log("","Database is saved.")
    }
}

export var ModuleMisc:IModule = {
    name: "misc",
    commands: [
        CommandMiscAbout,
        CommandMiscBlub,
        CommandMiscSave
    ]
}
