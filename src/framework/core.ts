import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js"
import { Database } from "./database";


@Discord
export class App {
    public static client: Client;
    public static prefix: string;
    public static workspace: string;

    setWorkspace(path:string):void {
        App.workspace = path;
    }

    prepare():void {

        Database.load()
    }
    
    start():void {
        App.client.login(
            Database.get().bot.token,
            `${__dirname}/*Discord.ts` // glob string to load the classes
        );
        
    }
    
}