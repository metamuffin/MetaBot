import { ICommand } from "../command"
import { IModule } from "../module"






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
    name: "blub",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        c.log("BLUB","BLUB")
    }
}

export var ModuleMisc:IModule = {
    name: "misc",
    commands: [
        CommandMiscAbout,
        CommandMiscBlub
    ]
}
