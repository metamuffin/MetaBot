
import { App } from './core';
import { UserModel, ServerModel, GlobalModel, UserModelForServer } from "../models";
import {User} from "discord.js"
import {MongoClient,Db,Collection} from "mongodb"
import { create } from 'domain';
import { Server } from 'http';
import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { TranslationModel } from '../translation';



export class Database {
    
    public static globals: GlobalModel;
    public static dbclient: MongoClient
    public static db: Db;
    public static collectionUser:Collection<UserModel>
    public static collectionServer:Collection<ServerModel>
    public static collectionGlobal:Collection<GlobalModel>
    public static collectionTranslation:Collection<TranslationModel>

    public static async init(){
        this.dbclient = new MongoClient("mongodb://localhost:27017/metabot");
        await this.dbclient.connect()
        this.db = Database.dbclient.db("metabot")
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
        if (!res) res = await Database.createServer(id)
        return res
    }

    public static async getUserDoc(id:string): Promise<UserModel> {
        var res: UserModel|null = await this.collectionUser.findOne({id})
        if (!res) res = await Database.createUser(id);
        return res
    }

    public static async getUserDocForServer(id:string,gid:string): Promise<UserModelForServer> {
        var res = (await this.getUserDoc(id)).servers[gid]
        if (!res) res = await Database.createUserForServer(id,gid)
        return res
        
    }

    public static async getTranslation(id: string): Promise<TranslationModel | undefined> {
        var name = (await this.getUserDoc(id)).language
        var res = await this.getTranslationByName(name)
        return res
    }


    public static async getTranslationByName(id:string):Promise<TranslationModel | undefined> {
        
        var res: TranslationModel | null = await this.collectionTranslation.findOne({lang: id})
        console.log(res);
        
        if (!res) return undefined
        return res
    }
    
    public static async updateServerDoc(id:string, value: ServerModel) {
        await Database.collectionServer.replaceOne({id},value)
    }

    public static async updateUserDoc(id:string, value: UserModel) {
        await Database.collectionUser.replaceOne({id},value)
    }

    public static async updateUserDocForServer(id:string,gid:string, value: UserModelForServer) {
        var user = await Database.getUserDoc(id)
        user.servers[gid] = value
        await Database.collectionUser.replaceOne({id},user)
    }

    public static async createServer(id:string):Promise<ServerModel> {
        var j:ServerModel = JSON.parse((await readFile("./defaults/default_server.json")).toString())
        j.id = id;
        await Database.collectionServer.insertOne(j)
        return j
    }
    
    public static async createUser(id:string):Promise<UserModel> {
        var j:UserModel = JSON.parse((await readFile("./defaults/default_user.json")).toString())
        j.id = id;
        await Database.collectionUser.insertOne(j)
        return j
    }


    public static async createUserForServer(id:string,gid:string):Promise<UserModelForServer> {
        var j:UserModelForServer = JSON.parse((await readFile("./defaults/default_user_for_server.json")).toString())
        var user = await this.getUserDoc(id);
        user.servers[gid] = j
        this.updateUserDocForServer(id,gid,j)
        return j
    }
}
