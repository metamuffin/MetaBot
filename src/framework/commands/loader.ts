import { App } from "../core"
import { ModuleMisc } from "./misc"
import { ModuleConfiguration } from "./configuration"



export var loadNativeCommands = ():void => {
    App.modules.push(ModuleMisc)
    App.modules.push(ModuleConfiguration)
}