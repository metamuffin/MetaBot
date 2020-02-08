import { Message, User, AudioPlayer } from "discord.js";
import { Database } from "./database";
import { CContext, IArgument } from "./command";
import { userInfo } from "os";


export enum EType {
    String,
    Integer,
    Float,
    Command,
    Member,
}

export class Helper {
    // Returns the name of command read from a Message that was interpreted as an command.
    // For the usage of Sub-commands, also the next words are returned in the array.
    public static getCommandNames(msg:string):Array<String> {
        return msg.substr(1,msg.length).split(" ")
    }

    public static ensurePermission(context:CContext, permstring: string|null, doError:boolean=true):boolean{
        if (permstring == null) return true;
        let userperms:Array<string> = this.getUserAccount(context.guild,context.author).permissions
        userperms.map((e)=>{e.toLowerCase()})
        permstring = permstring.toLowerCase()

        let permparts:Array<string> = permstring.split(".")
        let permok:boolean = false;

        for (let i = 0; i < permparts.length; i++) {
            let permtest:string = (i == permparts.length-1) ? permstring : (permparts.slice(0,i+1).join(".") + ".*")
            console.log(permtest);
            if (userperms.includes(permtest)) {
                permok = true;
            }
        }
        if ((!permok) && doError){
            context.err(context.translation.core.permission.no_permission.title,context.translation.core.permission.no_permission.description.replace("{perm}",permstring))
        }
        return permok;
    }

    public static parseArguments(msg:string,types:Array<IArgument>,context:CContext):Array<any> {
        types = types.slice(0)
        var c_arg = types.pop() || {type:EType.String,optional:true,name:"unnamed"}
        var in_quotes = false;
        var current_buffer:string = ""
        var args:Array<any> = [];

        for (let i = 0; i < msg.length; i++) {
            const c = msg.charAt(i);
        
            if (c == " " && !in_quotes){
                args.push(this.parseArgument(current_buffer,c_arg.type,context))
                current_buffer = "";
            }

            current_buffer += c
        }


        return []
    }

    public static parseArgument(buffer:string,type:EType,context:CContext):any|null {
        var r:any|null = ""
        if (type == EType.String) r = buffer
        if (type == EType.Float) {
            try {
                r = parseFloat(buffer.trim());
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.gerneral.parse_error.float_invalid);
            }
        }
        if (type == EType.Integer) {
            try {
                r = parseInt(buffer.trim());
            } catch (e) {
                context.err(context.translation.core.general.parse_error.title,context.translation.core.gerneral.parse_error.int_invalid);
            }
        }
        return r
    }

    public static getUserTranslation(u:User):any{
        return Database.get().lang[this.getGlobalUserAccount(u).language]
    }

    public static getGenericAccount(obj:any,indetifier:any):[any,boolean] {
        var new_created:boolean = false;
        if(!obj.hasOwnProperty(indetifier.toString())) {
            obj[indetifier.toString()] = {...obj.default};
            new_created = true
        }
        return [obj[indetifier.toString()], new_created];
    }

    public static getGlobalUserAccount(u:User):any{
        var r = Helper.getGenericAccount(Database.get().members,u.id);
        if (r[1]){
            r[0].id = u.id
            r[0].name = u.username
        }
        return r[0]
    }
    public static getUserAccount(guild_id:any, u:User){
        return Helper.getGenericAccount(Helper.getGenericAccount(Database.get().servers,guild_id)[0],u.id)[0];
    }

    public static getServerData(id:any):any {
        return Helper.getGenericAccount(Database.get().servers,id)[0];
    }
}