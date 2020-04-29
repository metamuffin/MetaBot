import { IModule } from '../framework/module';
import { IHandler } from '../framework/handler';
import { Database } from '../framework/database';
import { User, Guild } from 'discord.js';
import { Helper } from '../framework/helper';
import { GenericContext } from '../framework/context';


export function moderatorWarn(c:GenericContext, reason:string){
    var uac = Helper.getUserAccount(c.guild,c.author)
    if (uac.warning_timestamp && uac.warnings > 0){
        if (uac.warning_timestamp > uac.warnings * (60*60*24)) uac.warnings = 0
    }
    if (!uac.warnings) uac.warnings = 0;
    uac.warnings += 1
    uac.warning_timestamp = Date.now()

    c.send("Verwarnung!",reason,0xFF0000)

    if (uac.warnings >= 3) {
        c.channel.memberPermissions(c.author)
    }
}

export function moderatorGetWarn(c:GenericContext){
    var uac = Helper.getUserAccount(c.guild,c.author)
    if (uac.warning_timestamp && uac.warnings > 0){
        if (uac.warning_timestamp > uac.warnings * (60*60*24)) uac.warnings = 0
    }
    return uac.warnings
}



var HandlerModeratorBlacklist:IHandler = {
    name: "blacklist",
    regex: /.+/,
    disablePermission: "moderator.bypass-blacklist.general",
    enablePermission: null,
    doPermissionError: false,
    handle: (c) => {
        if (!c.message.content) return
        for (const item of Database.get().blacklist.general) {
            var regexp = new RegExp(item,"i")
            if (regexp.test(c.message.content)) {
                c.message.delete()
                moderatorWarn(c,c.translation.moderator.blacklist.blacklist_violation)
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
    handle: (c) => {
        c.message.delete()
        moderatorWarn(c,c.translation.moderator.blacklist.invite_pasted)
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
    init: () => {
        
    }
}