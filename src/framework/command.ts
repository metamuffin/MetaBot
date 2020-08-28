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

    handle: (context: CommandContext) => any,
    


}

export class CommandContext extends GenericContext{
    public args:Array<any>;
    private command
    private args_raw
    
    constructor (event:Message,module:IModule, callstack:Array<ICommand>, command:ICommand, args:Array<string>) {
        super(event);
        this.command = command
        this.args_raw = args
        var __temp: any = undefined
        this.args = __temp
    }
    
    public async init2() {
        this.args = await Helper.parseArguments(this.args_raw.join(" "),this.command.argtypes,this);
    }
}
