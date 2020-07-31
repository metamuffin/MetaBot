import { IModule } from '../framework/module.ts';
import { IHandler } from '../framework/handler.ts';
import { Database } from '../framework/database.ts';
import { Helper } from '../framework/helper.ts';
import { GenericContext } from '../framework/context.ts';


export async function moderatorWarn(c:GenericContext, reason:string){
    var uac = await c.getAuthorDocForServer()
    if (uac.warningTimestamp && uac.warnings > 0){
        if (uac.warningTimestamp > uac.warnings * (60*60*24)) uac.warnings = 0
    }
    if (!uac.warnings) uac.warnings = 0;
    uac.warnings += 1
    uac.warningTimestamp = Date.now()

    c.send("Verwarnung!",reason,0xFF0000)

    if (uac.warnings >= 3) {
        //c.channel.memberPermissions(c.author)
    }
}

export async function moderatorGetWarn(c:GenericContext){
    var uac = await c.getAuthorDocForServer()
    if (uac.warningTimestamp && uac.warnings > 0){
        if (uac.warningTimestamp > uac.warnings * (60*60*24)) uac.warnings = 0
    }
    return uac.warnings
}



var HandlerModeratorBlacklist:IHandler = {
    name: "blacklist",
    regex: /.+/,
    disablePermission: "moderator.bypass-blacklist.general",
    enablePermission: null,
    doPermissionError: false,
    handle: async (c) => {
        if (!c.message.content) return
        for (const item of (await c.getServerDoc()).messageBlacklist) {
            var regexp = new RegExp(item,"i")
            if (regexp.test(c.message.content)) {
                c.message.delete()
                await moderatorWarn(c,c.translation.moderator.blacklist.blacklist_violation)
                return
            }
        }
    }

}

var HandlerModeratorLinks:IHandler = {
    name: "links",
    regex: /https?:\/\/\.+discord\.gg\/\.+/,
    disablePermission: "moderator.discord_invite",
    enablePermission: null,
    doPermissionError: false,
    handle: async (c) => {
        c.message.delete()
        await moderatorWarn(c,c.translation.moderator.blacklist.invite_pasted)
    }

}



export var ModuleModerator:IModule = {
    name: "moderator",
    commands: [

    ],
    handlers: [
        HandlerModeratorBlacklist,
        HandlerModeratorLinks
    ],
    init: async () => {
        
    }
}