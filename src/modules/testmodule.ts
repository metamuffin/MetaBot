import { IModule } from "../framework/module";
import { ICommand } from "../framework/command";
import { Helper } from "../framework/helper";
import { SelectUI } from "../framework/ui";



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
    }
    
}

var CommandTestInterface:ICommand = {
    name: "testui",
    alias: [],
    useSubcommands: false,
    subcommmands: [],
    argtypes: [],
    requiredPermission: null,
    handle: async (c) => {
        var respond = (choice:string) => {
            c.log("",`Du hast ${choice} gewählt.`)
        }
        var ui = await new SelectUI(c,"Wähle eine Frucht!",[
            {
                icon: "apple",
                text: "Apfel",
                unicode: "🍎",
                callback: () => {respond("Apfel")}
            },
            {
                icon: "cherries",
                text: "Kirschen",
                unicode: "🍒",
                callback: () => {respond("Kirschen")}
            }
        ], {
            color: 0xFFFF00,
            public: false
        }).send()
    
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
    init: async () => {
        
    }
}
