

export enum EType {
    EString,
    EInteger,
    EFloat,
    ECommand,
    EMember,
}

export class Helper {
    // Returns the name of command read from a Message that was interpreted as an command.
    // For the usage of Sub-commands, also the next words are returned in the array.
    public static getCommandNames(msg:string):Array<String> {
        return msg.split("")
    }
}