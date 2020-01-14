import { Type } from "./helper"


export interface Command {
    name:string,
    
    handle: (args: Array<[Type,any]>, event: any) => void,



}