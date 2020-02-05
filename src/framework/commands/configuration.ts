import { IModule } from "../module";
import { ICommand } from "../command";




var CommandConfigModule:ICommand = {
    name: "module",
    alias: ["mod"],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        c.log("BLUB","BLUB")
    }
}



export var ModuleConfiguration:IModule = {
    name: "config",
    commands: [

    ]
}