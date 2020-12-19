import { Role } from "discord.js";



export interface UserModel {
    id:string
    servers: { [key: string]: UserModelForServer }    
    language:string
}
export interface UserModelForServer {
    id:string
    gid:string
    warningTimestamp:number
    warnings:number
    permissions: PermissionBundle
}

export interface ServerModel {
    id:string
    enabledModules:Array<string>
    messageBlacklist:Array<string>
    rolePermissions: {[key: string]: PermissionBundle}
}

export type PermissionBundle = PermissionModifier[]
export interface PermissionModifier {
    action: "grant" | "revoke"
    name: string,
    order: number,
}
export interface PermissionModifierOrigin extends PermissionModifier {
    origin: Role | undefined
}

export interface GlobalModel {
    id:string
    secret:string
}