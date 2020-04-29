import { IModule } from "../framework/module";
import { ICommand } from "../framework/command";

/*
! MetaBot Tutorial
* This is the source file of a very basic Module with a lot of comments to show the usage of some common features of this framework.

*/

interface MeinInterface {
    x: number,
    y: string
}


var CommandTutorialPing:ICommand = {// Naming-style of commands should be: Command<module><name> with <name> being the name of the command and <module> being the name of the module the command belongs to.
    name: "ping",                   // the name of this command will also be one way to call it. 
    alias: ["pong"],                // Alternative or shorter form that can be used.
    requiredPermission: null,       // No Permission is required to use it.
    useSubcommands: false,          // It does not use any subcommands
    subcommmands: [],               // So the the subcommands-array should be empty
    argtypes: [],                   // Arguments are also not required.
    handle: (context) => {
        /*
            When the Command is called from the chat, the framework will execute this
            function with a instance of the Context that includes information about the
            message that triggered the event and some helper functions.
        */
        // the 'log' function logs embeded messages in reply to the message that called the command
        // Usage: context.log(<title>,<description>)
        context.log("Pong!","It looks like this Command Worked.") // TODO: You should use the translation database for these logs!
    }
}

export var ModuleTutorial:IModule = {
    name: "tutorial", // Names of Modules are always snake_case.
    commands: [ // A List of all Top-Level commands that belong to this Module
        CommandTutorialPing
    ],
    handlers: [],
    init: () => {
        
    }
}

