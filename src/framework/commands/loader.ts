import { App } from "../core.ts"
import { ModuleMisc } from "./misc.ts"
import { ModuleConfiguration } from "./configuration.ts"
import { ModulePermission } from './permission.ts';



export var loadNativeCommands = ():void => {
    App.modules.push(ModuleMisc)
    App.modules.push(ModuleConfiguration)
    App.modules.push(ModulePermission)
}