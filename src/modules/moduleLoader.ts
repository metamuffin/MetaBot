import { App } from "../framework/core.ts";
import { ModuleTest } from "./testmodule.ts";
//import { ModuleDND } from "./dnd";
import { ModuleMusic } from "./music.ts";
import { ModuleTutorial } from "./tutorialmodule.ts"
//import { ModuleCrypto } from "./crypto";
import { ModuleVoiceAssistant } from './voice-assistant.ts';
import { ModuleModerator } from "./moderator.ts";

export function registerModules():void {
    App.modules.push(
        /*
        ModuleDND,
        ModuleCrypto,
        */
        ModuleTest, 
        ModuleMusic,
        ModuleVoiceAssistant,
        ModuleTutorial,
        ModuleModerator
    )
}
