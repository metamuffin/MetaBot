import { IModule } from '../framework/module.ts';
import { ICommand } from '../framework/command.ts';




var CommmandLevelingLevel:ICommand = {
    name: "level",
    alias: ["lvl"],
    argtypes: [],
    requiredPermission: "leveling.level.get",
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        
    }
}










var ModuleLeveling:IModule = {
    name: "leveling",
    commands: [
        CommmandLevelingLevel
    ],
    handlers: [

    ],
    init: async () => {
        
    }
}