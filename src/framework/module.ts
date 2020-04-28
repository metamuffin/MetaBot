import { ICommand } from "./command";
import { IHandler } from "./handler"


export interface IModule {
    name:string,
    commands:Array<ICommand>,
    handlers:Array<IHandler>
}
