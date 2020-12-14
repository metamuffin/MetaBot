import { Database } from "./database";
import { IModule } from "./module";
import { Helper, logWithTags, messageLogNote } from "./helper";
import { ICommand, CommandContext} from './command';
import { loadNativeCommands } from "./commands/loader";
import { HandlerContext } from "./handler";
import { InterfaceHandler } from "./interfacing";
import { Client, MessageReaction, User, Message, PartialUser } from "discord.js";
import { ensurePermission } from "./permission";

export var BOT_VERBOSE_MODE = true;


export class App {
    public static client: Client;
    public static prefix: string = "}";
    public static workspace: string;
    public static modules: Array<IModule> = [];

    
    setWorkspace(path:string):void {
        App.workspace = path;
    }

    async init() {
        await Database.init()
        App.client = new Client({});
        App.client.login(Database.globals.secret)
        App.client.on("message",App.messageHandler)
        App.client.on("messageReactionAdd",App.reactionHandler)
        loadNativeCommands()
        for (const m of App.modules) {
            console.log(`Initializing module ${m.name}...`);
            await m.init()
        }
    }

    public static reactionHandler(reaction:MessageReaction, user:User | PartialUser):void {
        // TODO
        var u: any = user
        InterfaceHandler.onReaction(reaction,u)
    }

    public static async messageHandler(message: Message):Promise<void> {
        if (message.author.id == App.client.user?.id) return
        logWithTags(["MESSAGE",...messageLogNote(message)],message.content)
        
        
        if (InterfaceHandler.onMessage(message)) return        

        let isCommand:boolean = message.content.startsWith(App.prefix)
        let c_names:Array<string> = [];
        if (isCommand){
            c_names = Helper.getCommandNames(message.content)
        }
        
        let foundCommand:boolean = false;
        if (!message.guild) return console.log("Uff todo todo todo: line 48:core.ts");
        var activeModules:Array<string> = (await Database.getServerDoc(message.guild.id)).enabledModules;
        for (const m of App.modules) {
            if (!activeModules.includes(m.name)) continue;
            if (isCommand){
                for (const h of m.commands){
                    var res = App.getMatchingCommand(h,c_names)
                    if (res.command != null){
                        foundCommand = true;
                        
                        let context:CommandContext = new CommandContext(message,m,[],res.command,res.names)
                        if (!await context.init()) return
                        
                        context.clog("Found a matching command for " + message.content.split(" ")[0]);
                        
                        if (!context.args_pre) {
                            context.err("Too few or many arguments!","")
                        }

                        var permok = await ensurePermission(context,h.requiredPermission)
                        if (permok){
                            context.clog("Executing command")
                            res.command.handle(context)
                        } else {
                            context.clog("Permission denied.");
                        }
                    }
                }
            }
            for (const handler of m.handlers) {
                if (message.content && handler.regex.test(message.content)){
                    var context = new HandlerContext(message,handler)
                    if (!await context.init()) return
                    if (ensurePermission(context,handler.enablePermission,handler.doPermissionError) && (!ensurePermission(context,handler.disablePermission,false))) {
                        handler.handle(context)
                    }
                }
            }
        }
        if (isCommand && !foundCommand){
            message.reply("Command not found.")
        }
    }

    public static getMatchingCommand(command:ICommand, names:Array<string>):{command:ICommand|null,names:Array<string>} {
        if (!(names && names.length > 0)) return {command:null,names:[]};
        if (!((command.name == names[0].toLowerCase()) || (command.alias.includes(names[0].toLowerCase())))) return {command:null,names:[]};
        
        var names_shifted:Array<string> = names.slice(0)
        names_shifted.shift()

        if (!command.useSubcommands){
            return {command:command,names:names_shifted}
        } else {
            
            for (const c of command.subcommmands) {
                var res = this.getMatchingCommand(c,names_shifted)
                if (res.command != null) {
                    return res
                }
            }
            return {command:null,names:[]};
        }
    }
}
