import { IModule } from "../module";
import { ICommand } from "../command";
import { EType, Helper } from "../helper";
import { App } from "../core";


var CommandConfigModuleDisable:ICommand = {
    name: "disable",
    alias: ["d"],
    argtypes: [
        {
            type:EType.String,
            name: "Module Name",
            optional: false
        }
    ],
    requiredPermission: "core.config.module.disable",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        var modlist = App.modules.slice(0).map(e=>e.name.toLowerCase())
        if (modlist.includes(c.args[0][1].toLowerCase())) {
            var cfg = Helper.getServerData(c.guild.id).modules
            if (!cfg.includes(c.args[0][1].toLowerCase())) {
                cfg.remove(c.args[0][1].toLowerCase())
                c.log(c.translation.core.success_generic,c.translation.core.config.module.success_disabled)
            } else {
                c.err(c.translation.core.error_generic,c.translation.core.config.module.error_already_disabled.replace("{0}",c.args[0][1]))
            }
        } else {
            c.err(c.translation.core.error_generic,c.translation.core.config.module.error_module_not_found.replace("{0}",c.args[0][1]))
        }
        
    }
}

var CommandConfigModuleEnable:ICommand = {
    name: "enable",
    alias: ["e"],
    argtypes: [
        {
            type: EType.String,
            name: "Module Name",
            optional: false
        }
    ],
    requiredPermission: "core.config.module.enable",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        var modlist = App.modules.slice(0).map(e=>e.name.toLowerCase())
        if (modlist.includes(c.args[0][1].toLowerCase())) {
            var cfg = Helper.getServerData(c.guild.id).modules
            if (!cfg.includes(c.args[0][1].toLowerCase())) {
                cfg.push(c.args[0][1].toLowerCase())
                c.log(c.translation.core.success_generic,c.translation.core.config.module.success_enabled)
            } else {
                c.err(c.translation.core.error_generic,c.translation.core.config.module.error_already_enabled.replace("{0}",c.args[0][1]))
            }
        } else {
            c.err(c.translation.core.error_generic,c.translation.core.config.module.error_module_not_found.replace("{0}",c.args[0][1]))
        }
    }
}

var CommandConfigModule:ICommand = {
    name: "module",
    alias: ["mod"],
    useSubcommands: true,
    subcommmands: [
        CommandConfigModuleEnable,
        CommandConfigModuleDisable
    ],
    argtypes: [],
    requiredPermission: null,
    handle: (c)=>{}
}

var Test123:ICommand = {
    name: "test123",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c)=>{c.log("BLUB","BLUB")}
}

export var ModuleConfiguration:IModule = {
    name: "config",
    commands: [
        CommandConfigModule,
        Test123
    ]
}