import { ICommand } from "../framework/command";
import { App } from "../framework/core";
import { EType } from "../framework/helper";
import { IModule } from "../framework/module";






const CommandEventsDMState: ICommand = {
    name: "dm-event-hook",
    alias: ["evdm"],
    argtypes: [
        {
            name: "user",
            optional: false,
            type: EType.Integer
        },
        {
            name: "event",
            optional: false,
            type: EType.Integer
        }
    ],
    requiredPermission: "events.dm-hook",
    useSubcommands: false,
    subcommmands: [],
    handle: async (c) => {
        
    }
}



export const ModuleEvents: IModule = {
    name: "events",
    commands: [],
    handlers: [],
    init: async () => {

    }
}