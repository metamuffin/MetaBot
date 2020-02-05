import { IModule } from "../module";
import { ICommand } from "../command";
import { EType } from "../helper";




var CommandConfigModule:ICommand = {
    name: "module",
    alias: ["mod"],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [
        {
            type:EType.String,
            name: "Module Name",
            optional: false
        }
    ],
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