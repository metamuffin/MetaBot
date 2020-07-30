import { EType, Helper } from "./helper.ts";
import { IModule } from "./module.ts";
import { App } from "./core.ts";
import { GenericContext } from "./context.ts";
import { Message } from "../api/message.ts";

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
