import { IModule } from "../framework/module";
import { ICommand } from "../framework/command";
import { Helper } from "../framework/helper";



var CommandTestPing:ICommand = {
    name: "ping",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: "test.ping",
    handle: (c) => {
        c.log("Pong!","Blub...")
    }
    
}


var CommandTestGetPerm:ICommand = {
    name: "getperm",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        c.log("BLUB","BLUB")
        Helper.getUserAccount(c.guild,c.author).permissions.push("test.*")
    }
    
}

var CommandTestInterface:ICommand = {
    name: "testui",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        
    
    }
}


export var ModuleTest:IModule = {
    name: "test",
    commands: [
        CommandTestPing,
        CommandTestGetPerm,
        CommandTestInterface
    ],
    handlers: [],
    init: () => {
        
    }
}
