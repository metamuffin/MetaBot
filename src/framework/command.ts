import { EType } from "./helper";


export interface ICommand {
    name:string,
    argtypes:Array<EType>,
    useSubcommands:boolean;
    subcommmands:Array<ICommand>

    handle: (args: Array<[EType,any]>, event: any) => void,



}