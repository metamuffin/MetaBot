import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js"
import { Database } from "./database";
import { IModule } from "./module";
import { Helper } from "./helper";
import { ICommand, CContext } from "./command";


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
        let c_names:Array<String> = [];
        if (isCommand){
            c_names = Helper.getCommandNames(message.content)
        }
        console.log(c_names);
        
        let foundCommand:boolean = false;
        for (const m of App.modules) {
            if (isCommand){
                for (const h of m.commands){
                    var res = App.getMatchingCommand(h,c_names)
                    if (res != null){
                        console.log("Found a matching command.");
                        foundCommand = true;
                        let context:CContext = new CContext(message,m,[])
                        if (Helper.ensurePermission(context,h.requiredPermission)){
                            h.handle(context)
                        }
                    }
                }
            }
        }
        if (isCommand && !foundCommand){
            message.reply("Command not found.")
        }
    }

    public static getMatchingCommand(command:ICommand, names:Array<String>): ICommand | null {
        if (!(command.name == names[0])) return null;
        if (!command.useSubcommands){
            return command
        } else {
            var names_shifted:Array<String> = names.slice(0)
            names_shifted.shift()
            for (const c of command.subcommmands) {
                var res = this.getMatchingCommand(c,names)
                if (res != null) {
                    return res;
                }
            }
            return null;
        }
    }

}