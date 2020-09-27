import { readFileSync } from "fs";
import { MongoClient } from "mongodb"
import { TranslationModel } from "../src/translation";
import { dist_language_keys } from "./translate";


async function main() {
    var dbclient = new MongoClient("mongodb://localhost:27017/metabot");
    await dbclient.connect()
    var db = dbclient.db("metabot")
    var tc = db.collection<TranslationModel>("translation");
    tc.deleteMany({})
    Promise.all(dist_language_keys.map(lang => (async () => {
        console.log(`Loading ${lang}`);
        var j = JSON.parse(readFileSync(`translations/${lang}.json`).toString())
        await tc.insertOne(j)
        
    })).map(f => f()));
}
main()
