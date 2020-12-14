


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
    permissions:Array<string>
}

export interface ServerModel {
    id:string
    enabledModules:Array<string>
    messageBlacklist:Array<string>
    rolePermissions: {[key: string]: RolePermission}
}

export interface RolePermission {
    grants: string[],
    revokes: string[],
    order: number[],
}

export interface GlobalModel {
    id:string
    secret:string
}