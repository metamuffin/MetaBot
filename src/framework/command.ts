import { EType, Helper, logWithTags, messageLogNote } from "./helper";
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
    public args:Array<any> = [];
    public args_pre: Array<any> | undefined;
    private command:ICommand
    private args_raw:Array<String>
    
    constructor (event:Message,module:IModule, callstack:Array<ICommand>, command:ICommand, args:Array<string>) {
        super(event);
        this.command = command
        this.args_raw = args
    }

    public clog(s:string,extraTags?: Array<string>) {
        if (!extraTags) extraTags = [];
        logWithTags(["COMMAND",...extraTags,this.command.name,...messageLogNote(this.message)],s)
    }

    public async init2(): Promise<boolean> {
        this.args_pre = await Helper.parseArguments(this.args_raw.join(" "),this.command.argtypes,this);
        if (!this.args_pre) return false
        this.args = this.args_pre
        return true
    }
}
