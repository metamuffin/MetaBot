import { IModule } from "../framework/module.ts";
import { ICommand } from "../framework/command.ts";
import { Helper } from "../framework/helper.ts";
import { SelectUI } from "../framework/interfacing.ts";



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
        var respond = (choice:string) => {
            c.log("",`Du hast ${choice} gewählt.`)
        }
        var ui = new SelectUI(c,"Wähle eine Frucht!",[
            {
                icon: "apple",
                text: "Apfel",
                unicode: "",
                callback: () => {respond("Apfel")}
            },
            {
                icon: "cherries",
                text: "Kirschen",
                unicode: "",
                callback: () => {respond("Kirschen")}
            }
        ], {
            color: 0xFFFF00,
            public: false
        })
        ui.send()
    
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
