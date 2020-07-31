import { MongoClient, Database as MongoDatabase, Collection } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { App } from './core.ts';
import { TranslationModel, UserModel, ServerModel, GlobalModel, UserModelForServer } from "../models.ts";
import { User } from "../api/user.ts";




export class Database {
    
    public static globals: any;
    public static dbclient: MongoClient = new MongoClient();
    public static db:MongoDatabase = Database.dbclient.database("metabot");
    public static collectionUser:Collection<UserModel> = Database.db.collection<UserModel>("user")
    public static collectionServer:Collection<ServerModel> = Database.db.collection<ServerModel>("server")
    public static collectionGlobal:Collection<GlobalModel> = Database.db.collection<GlobalModel>("global")
    public static collectionTranslation:Collection<TranslationModel> = Database.db.collection<TranslationModel>("translation")

    public static async getServerDoc(id:string): Promise<ServerModel> {
        var res: ServerModel|null = await this.collectionServer.findOne({id})
        if (!res) throw new Error("Unimplemented");
        return res
    }

    public static async getUserDoc(id:string): Promise<UserModel> {
        var res: UserModel|null = await this.collectionUser.findOne({id})
        if (!res) throw new Error("Unimplemented");
        return res
    }

    public static async getUserDocForServer(id:string,gid:string): Promise<UserModelForServer> {
        var res = (await this.getUserDoc(id)).servers[gid]
        if (!res) throw new Error("Unimplemented");
        return res
        
    }

    public static async getTranslation(id:string):Promise<any> {

    }
    
}