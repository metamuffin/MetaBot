import { EType, Helper } from "./helper";
import { IModule } from "./module";
import { App } from "./core";
import { GenericContext } from "./context";
import { Message } from "discord.js";

export interface IArgument {
    type:EType,
    name:string,
    optional:boolean
}

export interface ICommand {
    name:string,
    alias:Array<string>,
    argtypes:Array<IArgument>,
    useSubcommands:boolean,
    subcommmands:Array<ICommand>,
    requiredPermission:string|null,

    handle: (context: CommandContext) => void,
    


}

export class CommandContext extends GenericContext{
    public args:Array<any>;

    constructor (event:Message,module:IModule, callstack:Array<ICommand>, command:ICommand, args:Array<string>) {
        super(event);
        this.args = Helper.parseArguments(args.join(" "),command.argtypes,this);
    }
}
