import { Message } from 'discord.js';
import { GenericContext } from './context';
import { logWithTags, messageLogNote } from './helper';



export interface IHandler {
    name: string,
    enablePermission: string | null,
    disablePermission: string | null,
    doPermissionError: boolean,
    regex: RegExp,
    handle: (context: HandlerContext) => void
}


export class HandlerContext extends GenericContext {
    public handler: IHandler

    constructor(event: Message, handler: IHandler) {
        super(event)
        this.handler = handler
    }
    public clog(s: string) {
        logWithTags(["COMMAND", this.handler.name, ...messageLogNote(this.message)], s)
    }

}