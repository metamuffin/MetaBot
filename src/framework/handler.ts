import { GenericContext } from './context';
import { Message } from 'discord.js';



export interface IHandler {
    name: string,
    enablePermission: string,
    disablePermission: string,
    doPermissionError: boolean,
    regex: RegExp,
    handle: (context: HandlerContext)=>string
}


export class HandlerContext extends GenericContext {
    public handler:IHandler

    constructor (event:Message, handler:IHandler) {
        super(event)
        this.handler = handler
    }
}