import { ICommand } from "./command";



export interface IModule {
    name:string,
    commands:Array<ICommand>,
}
