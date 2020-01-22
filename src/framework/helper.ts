import { Message, User, AudioPlayer } from "discord.js";
import { Database } from "./database";
import { CContext } from "./command";
import { userInfo } from "os";


export enum EType {
    EString,
    EInteger,
    EFloat,
    ECommand,
    EMember,
}

export class Helper {
    // Returns the name of command read from a Message that was interpreted as an command.
    // For the usage of Sub-commands, also the next words are returned in the array.
    public static getCommandNames(msg:string):Array<String> {
        return msg.substr(1,msg.length).split(" ")
    }

    public static ensurePermission(context:CContext, permstring: string|null, doError:boolean=true):boolean{
        if (permstring == null) return true;
        let userperms:Array<string> = this.getUserAccount(context.author).permissions
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

    public static getUserTranslation(u:User):any{
        return Database.get().lang[this.getUserAccount(u).language]
    }

    public static getUserAccount(u:User):any{
        if (!Database.get().members.hasOwnProperty(u.id.toString())){
            Database.get().members[u.id.toString()] = {...(Database.get().members.default)};
        }
        
        return Database.get().members[u.id.toString()]
    }
}