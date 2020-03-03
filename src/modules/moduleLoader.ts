import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";
import { ModuleDSA } from "./dsa";
import { ModuleMusic } from "./music";
import { ModuleTutorial } from "./tutorialmodule"

export function registerModules():void {
    App.modules.push(
        // /*
        ModuleTest, 
        ModuleDSA,
        ModuleMusic,
        // */
        ModuleTutorial
    )
}
