import { IModule } from '../framework/module';
import { ICommand } from '../framework/command';




var CommmandLevelingLevel:ICommand = {
    name: "level",
    alias: ["lvl"],
    argtypes: [],
    requiredPermission: "leveling.level.get",
    subcommmands: [],
    useSubcommands: false,
    handle: (c) => {
        
    }
}










var ModuleLeveling:IModule = {
    name: "leveling",
    commands: [
        CommmandLevelingLevel
    ],
    handlers: [

    ]
}