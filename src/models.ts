

export interface TranslationModel {
    
}

export interface UserModel {
    id:string
    servers: { [key: string]: UserModelForServer }    
    language:string
}
export interface UserModelForServer {
    warningTimestamp:number
    warnings:number
    permissions:Array<string>
}

export interface ServerModel {
    id:string
    enabledModules:Array<string>
    messageBlacklist:Array<string>
    modules:Array<string>
}

export interface GlobalModel {

}