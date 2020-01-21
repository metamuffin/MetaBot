import { App } from "../framework/core";
import { ModuleTest } from "./testmodule";


export function registerModules():void {
    App.modules.push(
        ModuleTest
    )
}
