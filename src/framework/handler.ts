import { GenericContext } from './context.ts';



export interface IHandler {
    name: string,
    enablePermission: string|null,
    disablePermission: string|null,
    doPermissionError: boolean,
    regex: RegExp,
    handle: (context: HandlerContext)=>void
}


export class HandlerContext extends GenericContext {
    public handler:IHandler

    constructor (event:Message, handler:IHandler) {
        super(event)
        this.handler = handler
    }
}