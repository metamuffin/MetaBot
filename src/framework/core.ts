import { Discord, On, Client, IAppConfig } from "@typeit/discord";
import { Message } from "discord.js"
import { Database } from "./database";
import { IModule } from "./module";
import { Helper } from "./helper";
import { ICommand, CContext } from "./command";
import { loadNativeCommands } from "./commands/loader";


@Discord
export class App {
    public static client: Client;
    public static prefix: string = "}";
    public static workspace: string;
    public static modules: Array<IModule> = [];

    setWorkspace(path:string):void {
        App.workspace = path;
    }

    prepare():void {
        App.client = new Client();

        Database.load()

        loadNativeCommands()
    }
    
    start():void {
        App.client.login(
            Database.get().bot.token,
            `${__dirname}/*Discord.ts`
        );
        Database.get().bot.token = "THIS WAS DELETED.... HAHAHAHAA"
        
    }

    @On("message")
    public static messageHandler(message: Message):void {
        let isCommand:boolean = message.content.startsWith(App.prefix)
        let c_names:Array<string> = [];
        if (isCommand){
            c_names = Helper.getCommandNames(message.content)
        }
        console.log(c_names);
        
        let foundCommand:boolean = false;
        var activeModules:Array<string> = Helper.getServerData(message.guild.id).modules;
        for (const m of App.modules) {
            if (!activeModules.includes(m.name)) continue;
            if (isCommand){
                for (const h of m.commands){
                    var res = App.getMatchingCommand(h,c_names)
                    if (res.command != null){
                        console.log("Found a matching command.");
                        foundCommand = true;
                        console.log(res.names);
                        
                        
                        let context:CContext = new CContext(message,m,[],res.command,res.names)
                        if (Helper.ensurePermission(context,h.requiredPermission)){
                            console.log("Handling this Command.");
                            res.command.handle(context)
                        } else {
                            console.log("Permission denied.");
                        }
                    }
                }
            }
        }
        if (isCommand && !foundCommand){
            message.reply("Command not found.")
        }
    }

    public static getMatchingCommand(command:ICommand, names:Array<string>):{command:ICommand|null,names:Array<string>} {
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
