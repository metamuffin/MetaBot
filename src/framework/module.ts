import { Command } from "./command";



export interface Module {
    name:string,
    command:Array<Command>,
}
