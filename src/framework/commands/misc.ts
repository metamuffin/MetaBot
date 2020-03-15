import { ICommand } from "../command"
import { IModule } from "../module"
import { EType } from "../helper"
import { App } from "../core"
import { Database } from "../database"
import { exec } from "child_process"
import * as ts from "typescript"





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
                    try{
                        outstr += `\u251c\u2500 **${command.name}:** ${c.translation[mod.name][command.name].description || "No Description Specified."}\n`
                    } catch (e) {
                        c.err("There may be something missing in the help because of an internal error :(",`Error on \`${mod.name}.${command.name}\``)
                        console.log(`[ERROR] ${command.name}`);
                    }
                }
            }
            outstr += "\nMore help can be found with the command: `"+App.prefix+"help <name>`"
            c.log(c.translation.misc.help.title_generic,outstr)
        } else {
            for (const mod of App.modules) {
                if (mod.name = c.args[0]){
                    

                    
                    break
                }
            }
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
            c.err("Error",e)
        } finally {
            c.log("",`\`${p}\``)
        }
    }
}

export var ModuleMisc:IModule = {
    name: "misc",
    commands: [
        CommandMiscAbout,
        CommandMiscBlub,
        CommandMiscSave,
        CommandMiscEval
    ]
}
