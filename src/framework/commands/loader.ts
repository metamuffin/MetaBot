import { App } from "../core"
import { ModuleMisc } from "./misc"



export var loadNativeCommands = ():void => {
    App.modules.push(
        ModuleMisc
    )
}