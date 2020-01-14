import { App } from "./framework/core";



var bot = new App()

bot.setWorkspace("../MetaBot-DB")
console.log("Preparing...");
bot.prepare()
console.log("Starting Bot.");
bot.start()