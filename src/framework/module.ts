import { ICommand } from "./command";



export interface IModule {
    name:string,
    command:Array<ICommand>,
}
