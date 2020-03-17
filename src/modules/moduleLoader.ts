import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";
import { ModuleDND } from "./dnd";
import { ModuleMusic } from "./music";
import { ModuleTutorial } from "./tutorialmodule"

export function registerModules():void {
    App.modules.push(
        // /*
        ModuleTest, 
        ModuleDND,
        ModuleMusic,
        // */
        ModuleTutorial
    )
}
