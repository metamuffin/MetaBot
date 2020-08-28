import { IModule } from '../framework/module';
import { IHandler } from '../framework/handler';
import { Database } from '../framework/database';
import { EType, Helper } from '../framework/helper';
import { GenericContext } from '../framework/context';
import { ICommand } from '../framework/command';
import { DiscordAPIError } from 'discord.js';


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
var CommandModeratorRemoveLastMessages:ICommand = {
    name: "removelastmessages",
    alias: ["rmlast","removelast"],
    requiredPermission: "moderator.remove_last_messages",
    argtypes: [
        {
            name: "Count",
            optional: false,
            type: EType.Integer
        },
        {
            name: "remove pinned",
            optional: true,
            type: EType.Boolean
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        if (c.args[0] > 100) return c.err(c.translation.error,"Too many messages to delete")
        if (!c.args[1]) c.args[1] = false
        var msgs = []
        for (const [_,message] of await c.channel.messages.fetch({limit: c.args[0]})) {
            if (message.pinned && (!c.args[1])) continue
            msgs.push(message)
        }
        try {
            await c.channel.bulkDelete(msgs)
        } catch (DiscordAPIError) {
            return c.err(c.translation.error,"I can only delete messages from the last 14 days because of the Discord API limitations. Sorry.")
        }
        setTimeout(async () => {
            var logm = await c.log("",`Deleted the last ${c.args[0]} messages.`)
            logm.delete({timeout: 5000})        
        }, 1000)
    }
}


export var ModuleModerator:IModule = {
    name: "moderator",
    commands: [
        CommandModeratorRemoveLastMessages
    ],
    handlers: [
        HandlerModeratorBlacklist,
        HandlerModeratorLinks
    ],
    init: async () => {
        
    }
}