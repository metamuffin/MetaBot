import { Database } from "./database";
import { CommandContext, IArgument } from "./command";
import { GenericContext } from './context';

export enum EType {
    String,
    Integer,
    Float,
    Command,
    MemberData,
    Boolean
}

export class IdentifiedClass {
    public id:number = 0
    constructor(){
        this.id = Math.floor(Math.random()*10**16)
    }
}

export class Helper {
    // Returns the name of command read from a Message that was interpreted as an command.
    // For the usage of Sub-commands, also the next words are returned in the array.
    public static getCommandNames(msg:string):Array<string> {
        return msg.substr(1,msg.length).split(" ")
    }

    public static async ensurePermission(context:GenericContext, permstring: string|null, doError:boolean=true):Promise<boolean> {
        if (permstring == null) return true;
        
        let userperms:Array<string> = (await context.getAuthorDocForServer()).permissions
        userperms.map((e)=>{e.toLowerCase()})
        permstring = permstring.toLowerCase()

        let permparts:Array<string> = permstring.split(".")
        let permok:boolean = false;

        for (let i = 0; i < permparts.length; i++) {
            let permtest:string = (i == permparts.length-1) ? permstring : (permparts.slice(0,i+1).join(".") + ".*")
            
            if (userperms.includes(permtest)) {
                permok = true;
            }
        }
        if (userperms.includes("*")) permok = true;
        if ((!permok) && doError){
            context.err(context.translation.core.permission.no_permission.title,context.translation.core.permission.no_permission.description.replace("{perm}",permstring))
        }
        return permok;
    }

    public static parseArguments(msg:string,types:Array<IArgument>,context:GenericContext):Array<any> {
        types = types.slice(0)
        var c_arg = types.shift() || {type:EType.String,optional:true,name:"unnamed"}
        var in_quotes = false;
        var current_buffer:string = ""
        var args:Array<any> = [];

        if (msg.search(" ") % 2 == 1) {
            context.err(context.translation.core.general.parse_error.title,"")
            return []
        }
        msg += " "

        for (let i = 0; i < msg.length; i++) {
            const c = msg.charAt(i);
            
        
            if (c == " " && (!in_quotes)){
                current_buffer = current_buffer.replace("\"","")
                var parsed = this.parseArgument(current_buffer,c_arg.type,context)
                args.push(parsed)
                var temp:IArgument|undefined = types.shift()
                if (temp == undefined){
                    if (i == msg.length - 1) break
                    context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.not_enough_args)
                    return args
                }
                c_arg = temp;
                current_buffer = "";

            }
            if (c=="\""){
                in_quotes =! in_quotes
            }

            current_buffer += c
        }


        return args
    }

    public static parseArgument(buffer:string,type:EType,context:GenericContext):any|null {
        var r:any|null = ""
        if (type == EType.String) r = buffer.trim()
        if (type == EType.Float) {
            try {
                r = parseFloat(buffer.trim());
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.gerneral.parse_error.float_invalid);
                r = undefined
            }
        }
        if (type == EType.Integer) {
            try {
                r = parseInt(buffer.trim());
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.gerneral.parse_error.int_invalid);
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

                r = Database.getUserDocForServer(buffer.trim(),context.server.id)
                
                if (!r) {
                    context.err(context.translation.core.general.parse_error.title,context.translation.core.general.parse_error.member_not_found);
                }
            }
        }
        if (type == EType.Boolean) {
            r = (buffer.trim() == "1" || buffer.trim() == "on" || buffer.trim() == "true" || buffer.trim() == "enable" || buffer.trim() == "enabled")
        }
        return r
    }


    public static deepGet(obj:any,path:Array<string>){
        var cur = obj
        for (const key of path) {
            cur = cur[key]
        }
        return cur
    }
}