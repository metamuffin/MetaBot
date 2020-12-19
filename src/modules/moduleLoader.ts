import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";
//import { ModuleDND } from "./dnd";
import { ModuleMusic } from "./music";
import { ModuleTutorial } from "./tutorialmodule"
//import { ModuleCrypto } from "./crypto";
//import { ModuleVoiceAssistant } from './voice-assistant';
import { ModuleModerator } from "./moderator";
import { ModuleAmongUs } from "./musicmanager";
import { ModuleChannelmanager } from "./channelmanager";

export function registerModules():void {
    App.modules.push(
        ModuleTest, 
        ModuleMusic,
        ModuleChannelmanager,
        ModuleTutorial,
        ModuleModerator,
        ModuleAmongUs,
    )
}
