import { readFileSync, writeFileSync } from "fs"

const translatte = require("translatte")




export const dist_language_keys = ["de","ru","fr"]
const source = "en"

async function translateA(from: string, to: string, text: string): Promise<string> {
    var o = await translatte(text, {to: to})
    if (o.error) throw new Error("EROROROROROORORR!")
    console.log(`"${text}" -> "${o.text}"`);
    return o.text
}

export async function translateDB() {
    var source_o = JSON.parse(readFileSync(`./translations/${source}.json`).toString())
    
    for (const lang of dist_language_keys) {
        console.log(`Translating from ${source} to ${lang}`);
        
        
        const recursiveTranslate = async (o: any): Promise<any> => {
            var out: any = {}
            for (const key in o) {
                if (o.hasOwnProperty(key)) {
                    const value = o[key];
                    if (typeof value == "string") {
                        out[key] = await translateA(source,lang,value)
                    } else if (typeof value == "object") {
                        out[key] = await recursiveTranslate(value)
                    } else {
                        console.log(`Invalid value:`);
                        console.log(value);
                    }
                }
            }
            return out
        }

        var lang_out = await recursiveTranslate(source_o)
        lang_out["lang"] = lang;
        writeFileSync(`./translations/${lang}.json`,JSON.stringify(lang_out))
        console.log(JSON.stringify(lang_out));
        
    }
    console.log("Done");
    
}
