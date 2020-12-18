import { IModule } from '../framework/module';
import { EType, Helper } from '../framework/helper';
import { ICommand } from '../framework/command';
import { GenericContext } from '../framework/context';
import { VoiceChannel } from 'discord.js';

export async function getChannelByName(c: GenericContext, name: string): Promise<VoiceChannel | undefined> {
    if (name == ".") {
        if (c.message.member?.voice.channel) return c.message.member.voice.channel
        else return undefined
    }
    var ch = c.server.channels.cache.find(ch => ch.name == name && ch.type == "voice")
    if (!ch) return undefined
    //@ts-ignore
    return ch
}


var CommandChannelmanagerMoveAll: ICommand = {
    name: "moveall",
    alias: ["movea","ma"],
    requiredPermission: "channelmanager.moveall",
    argtypes: [
        {
            name: "source",
            optional: false,
            type: EType.String
        },
        {
            name: "destination",
            optional: false,
            type: EType.String
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        var sch = await getChannelByName(c, c.args[0])
        var dch = await getChannelByName(c, c.args[1])
        if (!sch) return c.err("", "Source channel not found.")
        if (!dch) return c.err("", "Destination channel not found.")
        sch?.members.forEach(m => {
            if (!dch) return
            m.voice.setChannel(dch).catch(e => c.perm_catch(e))
        })
    }
}

var CommandChannelmanagerSwapChannels: ICommand = {
    name: "swapchannels",
    alias: ["swapch","swapc", "swapall"],
    requiredPermission: "channelmanager.moveall",
    argtypes: [
        {
            name: "channel A",
            optional: false,
            type: EType.String
        },
        {
            name: "channel B",
            optional: false,
            type: EType.String
        }
    ],
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        var cha = await getChannelByName(c, c.args[0])
        var chb = await getChannelByName(c, c.args[1])
        if (!cha) return c.err("", "Channel A not found.")
        if (!chb) return c.err("", "Channel B not found.")
        var chc = [cha,chb].map(c => ({
            position: c.position,
            name: c.name,
            parent: c.parent,
            topic: "",
            target_id: "",
        }))
        const apply_config = async (chci:any) => {
            var chr = c.server.channels.resolve(chci.target_id)
            if (!chr) return c.err("Something went wrong.","")
            await chr.setName(chci.name).catch(e => c.perm_catch(e))
            await chr.setParent(chci.parent).catch(e => c.perm_catch(e))
            await chr.setPosition(chci.position).catch(e => c.perm_catch(e))
            // await chr.setTopic(chci.topic).catch(e => c.perm_catch(e))
        }
        chc[0].target_id = chb.id
        chc[1].target_id = cha.id
        chc.sort((a,b) => a.position - b.position)
        if (chc[0].parent?.id === chc[1].parent?.id) chc[0].position -= 1
        console.log(chc);
        await Promise.all(chc.map(chci => apply_config(chci)))
        await c.log("","Done")
    }
}




export var ModuleChannelmanager: IModule = {
    name: "channelmanager",
    commands: [
        CommandChannelmanagerMoveAll,
        CommandChannelmanagerSwapChannels,
    ],
    handlers: [
    ],
    init: async () => {

    }
}