import { Database } from "./database";
import { CommandContext, IArgument } from "./command";
import { GenericContext } from './context';
import { Guild, Channel, TextChannel, Message, VoiceChannel, DMChannel } from "discord.js";
import { App } from "./core";

export enum EType {
    String,
    Integer,
    Float,
    Command,
    MemberData,
    MemberDataForServer,
    Boolean,
}

export class IdentifiedClass {
    public id:number = 0
    constructor(){
        this.id = Math.floor(Math.random()*10**16)
    }
}

export function logWithTags(tags:Array<string>, text: string) {
    console.log(`[${tags.join("] [")}] ${text}`)
}

export function channelPath(server:Guild,channel:Channel):string {
    var name = ""
    if (channel instanceof TextChannel) name = channel.name;
    else if (channel instanceof VoiceChannel) name = channel.name;
    else if (channel instanceof DMChannel) name = "DM Channel (that should be impossible"
    return `${server.name}/${name}`
}
export function messageLogNote(message:Message):Array<string> {
    if (!message.guild) return []
    return [channelPath(message.guild,message.channel), message.author.username + '#' + message.author.discriminator];
}


export class Helper {
    // Returns the name of command read from a Message that was interpreted as an command.
    // For the usage of Sub-commands, also the next words are returned in the array.
    public static getCommandNames(msg:string):Array<string> {
        return msg.substr(App.prefix.length,msg.length).split(" ")
    }

    public static async parseArguments(msg:string,types:Array<IArgument>,context:GenericContext):Promise<Array<any> | undefined> {
        types = types.slice(0)
        var c_arg = types.shift() || {type:EType.String,optional:true,name:"unnamed"}
        var in_quotes = false;
        var current_buffer:string = ""
        var args:Array<any> = [];
        
        if ((msg.match(/"/g) || []).length % 2 == 1) {
            context.err(context.translation.core.general.parse_error.title,"Uneven number of quotes.")
            return []
        }
        msg += " "

        for (let i = 0; i < msg.length; i++) {
            const c = msg.charAt(i);
            var not_escaped = (i != 0) ? (msg.charAt(i-1) != "\\") : true
            
        
            if (c == " " && (!in_quotes) && not_escaped){
                var parsed = await this.parseArgument(current_buffer,c_arg.type,context)
                if (parsed === undefined) {
                    context.err(context.translation.core.general.parse_error.title,"Argument invalid.")
                    return undefined
                }
                args.push(parsed)
                var temp:IArgument|undefined = types.shift()
                if (temp == undefined){
                    if (i == msg.length - 1) break
                    context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.not_enough_args)
                    return undefined
                }
                c_arg = temp;
                current_buffer = "";

            }

            if (c=="\"" && not_escaped){
                in_quotes =! in_quotes
                continue
            }
            if (c=="\\" && not_escaped) continue

            current_buffer += c
        }


        return args
    }

    public static async parseArgument(buffer:string,type:EType,context:GenericContext):Promise<any|null> {
        var r:any|null = ""
        if (type == EType.String) r = buffer.trim()
        if (type == EType.Float) {
            try {
                if (buffer.trim() == "") throw new Error()
                r = parseFloat(buffer.trim())
                if (r == NaN || Number.isNaN(r)) throw Error()
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.float_invalid);
                r = undefined
            }
        }
        if (type == EType.Integer) {
            try {
                if (buffer.trim() == "") throw new Error()
                r = parseInt(buffer.trim());
                if (r == NaN || Number.isNaN(r)) throw Error()
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.int_invalid);
                r = undefined
            }
        }
        if (type == EType.MemberData) {
            try {
                r = parseInt(buffer.trim())
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.member_id_not_an_integer)
                r = undefined
            } finally {
                r = await Database.getExistingUserDoc(buffer.trim())
                if (!r) {
                    return context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.member_not_found);
                }
                
            }
        }
        if (type == EType.MemberDataForServer) {
            try {
                r = parseInt(buffer.trim())
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.member_id_not_an_integer)
                r = undefined
            } finally {
                r = await Database.getExistingUserDoc(buffer.trim())
                if (!r && buffer.trim() != "default") {
                    return context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.member_not_found);
                }
                r = await Database.getUserDocForServer(buffer.trim(),context.server.id)
            }
        }
        if (type == EType.Boolean) {
            r = ["on","true","enable","enabled","1","yes","y"].includes(buffer.trim().toLowerCase())
        }
        return r
    }


    public static deepGet(obj:any,path:Array<string>): any|undefined{
        var cur = obj
        for (const key of path) {
            if (!cur[key]) return undefined
            cur = cur[key]
        }
        return cur
    }
}

export function limitLen(s:string,limit?:number):string {
    limit ||= 1900
    if (s.length > limit) {
        return s.slice(0,1900) + `\n :( ${s.length - limit} more bytes cant be shown.`
    } else return s
}