import { App } from "../core"
import { ModuleMisc } from "./misc"
import { ModuleConfiguration } from "./configuration"
import { ModulePermission } from './permission';



export var loadNativeCommands = ():void => {
    App.modules.push(ModuleMisc)
    App.modules.push(ModuleConfiguration)
    App.modules.push(ModulePermission)
}