import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";
import { ModuleDSA } from "./dsa";


export function registerModules():void {
    App.modules.push(
        ModuleTest,
        ModuleDSA
    )
}
