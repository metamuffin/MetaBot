console.log("Started. -> Importing");
import { App } from "./framework/core";
import { registerModules } from "./modules/moduleLoader";
console.log("Imported. -> Logging in");

async function main(){
    var bot = new App()
    
    registerModules()
    
    
    bot.setWorkspace("../MetaBot-DB/")
    console.log("Starting Bot.");
    await bot.init()
    console.log("Running...");

}

main()