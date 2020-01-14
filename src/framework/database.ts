import * as fs from 'fs';
import { App } from './core';



export class Database {
    public static dbnames:Array<String> = [];
    private static db:any = {}

    static load():void {
        for (const dbname of Database.dbnames) {
            let path:string = App.workspace + dbname
            let j:any = fs.readFileSync(path).toJSON()
            Database.db[dbname.replace("/","-")] = j;
        }
    }
    static get():any {
        return Database.db;
    }
}