import { IModule } from "../framework/module";
import { ICommand } from "../framework/command";
import { App } from "../framework/core";
import { Database } from "../framework/database";
import { Helper } from "../framework/helper";



var CommandTestPing:ICommand = {
    name: "ping",
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
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: (c) => {
        c.log("BLUB","BLUB")
        Helper.getUserAccount(c.author).permissions.push("test.*")
    }
    
}

var CommandTestInterface:ICommand = {
    name: "testui",
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
    ]
}
