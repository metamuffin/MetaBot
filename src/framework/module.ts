import { ICommand } from "./command.ts";
import { IHandler } from "./handler.ts"


export interface IModule {
    name:string,
    commands:Array<ICommand>,
    handlers:Array<IHandler>,
    init: ()=>Promise<void>
}
