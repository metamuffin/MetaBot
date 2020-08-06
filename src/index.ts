console.log("Started. -> Importing");
import { App } from "./framework/core.ts";
import { registerModules } from "./modules/moduleLoader.ts";
console.log("Imported. -> Logging in");



var bot = new App()

registerModules()


bot.setWorkspace("../MetaBot-DB/")
console.log("Starting Bot.");
await bot.init()
console.log("Running...");
