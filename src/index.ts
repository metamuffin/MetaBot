import { App } from "./framework/core";
import { registerModules } from "./modules/moduleLoader";
import { Database } from "./framework/database";



var bot = new App()

registerModules()


bot.setWorkspace("../MetaBot-DB/")
console.log("Preparing...");
bot.prepare()
console.log("Starting Bot.");

bot.start()