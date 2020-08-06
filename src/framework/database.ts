import { MongoClient, Database as MongoDatabase, Collection } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { App } from './core.ts';
import { TranslationModel, UserModel, ServerModel, GlobalModel, UserModelForServer } from "../models.ts";
import { User } from "../api/user.ts";




export class Database {
    
    public static globals: GlobalModel;
    public static dbclient: MongoClient
    public static db:MongoDatabase
    public static collectionUser:Collection<UserModel>
    public static collectionServer:Collection<ServerModel>
    public static collectionGlobal:Collection<GlobalModel>
    public static collectionTranslation:Collection<TranslationModel>

    public static async init(){
        this.dbclient = new MongoClient();
        this.db = Database.dbclient.database("metabot");
        this.collectionUser= Database.db.collection<UserModel>("user")
        this.collectionServer = Database.db.collection<ServerModel>("server")
        this.collectionGlobal = Database.db.collection<GlobalModel>("global")
        this.collectionTranslation = Database.db.collection<TranslationModel>("translation")
        var t = await this.collectionGlobal.findOne({})
        if (!t) throw new Error("No global config in database");
        this.globals = t;
    }

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