import * as fs from 'fs';
import { App } from './core';



export class Database {

    private static db:any = {}

    static load():void {
        let path:string = App.workspace + "index.json"
        let j:any = fs.readFileSync(path).toString()
        let index = JSON.parse(j);
        let dbnames = index.names
        for (const dbname of dbnames) {
            let path:string = App.workspace + dbname + ".json"
            let j:any = fs.readFileSync(path).toString()
            console.log(`Parsing ${path} ...`);
            let obj = JSON.parse(j);
            
            let createpath:Array<string> = dbname.split("/")
            let container:any = Database.db;
            for (let i = 0; i < createpath.length; i++) {
                const e = createpath[i];
                if (!container.hasOwnProperty(e)) container[e] = {}
                if (i >= (createpath.length - 1) ) break;
                container = container[e]
            }
            
            container[createpath.pop()||"ERROR"] = obj
        }
    }
    static get():any {
        return Database.db;
    }

    static save():void {
        let path:string = App.workspace + "index.json"
        let j:any = fs.readFileSync(path).toString()
        let index = JSON.parse(j);
        let dbnames = index.names;
        for (const dbname of dbnames) {
            let path:string = App.workspace + dbname + ".json"
            let container:any = Database.db
        }
    }
}