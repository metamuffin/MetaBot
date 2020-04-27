import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";
import { ModuleDND } from "./dnd";
import { ModuleMusic } from "./music";
import { ModuleTutorial } from "./tutorialmodule"
import { ModuleCrypto } from "./crypto";
import { ModuleVoiceAssistant } from './voice-assistant';

export function registerModules():void {
    App.modules.push(
        // /*
        ModuleDND,
        ModuleCrypto,
        // */
        ModuleTest, 
        ModuleMusic,
        ModuleVoiceAssistant,
        ModuleTutorial
    )
}
