import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js"
import { Database } from "./database";
import { IModule } from "./module";


@Discord
export class App {
    public static client: Client;
    public static prefix: string;
    public static workspace: string;
    public static modules: Array<IModule>;

    setWorkspace(path:string):void {
        App.workspace = path;
    }

    prepare():void {
        App.client = new Client();

        Database.dbnames.push("bot")
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
        if (isCommand){
            let c_parsed = Helper.parse()
        }

        for (const m of App.modules) {
            if (isCommand){
                for (const h of m.commands){
                    
                }
            }
        }
    }
}