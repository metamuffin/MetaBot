import { IModule } from '../module';
import { ICommand } from '../command';
import { EType, Helper } from '../helper';
import { Database } from '../database';


var CommandPermissionPermissionAdd:ICommand = {
    name: "add",
    alias: ["a"],
    requiredPermission: "core.permission.add",
    argtypes: [
        {
            name: "member",
            optional: false,
            type: EType.MemberDataForServer
        },
        {
            name: "permission-name",
            optional: false,
            type: EType.String
        }
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: async (c) => {
        if (!c.args[0]) return
        if (!c.args[1]) return
        //if (!Helper.ensurePermission(c,c.args[1],true)) return
        if (c.args[0].permissions.includes(c.args[1])) return c.err("Permission already applied.","")
        console.log({t1: c.args[0]});
        c.args[0].permissions.push(c.args[1])
        console.log({t1: c.args[0]});
        
        await Database.updateUserDocForServer(c.args[0].id,c.args[0].gid,c.args[0])
        c.log(c.translation.permission.permission.success,c.translation.permission.permission.add_success.replace("{0}",c.args[0].id).replace("{1}",c.args[1]));
    }
}

var CommandPermissionPermissionRemove:ICommand = {
    name: "remove",
    alias: ["r","d"],
    requiredPermission: "core.permission.remove",
    argtypes: [
        {
            name: "member",
            optional: false,
            type: EType.MemberDataForServer
        },
        {
            name: "permission-name",
            optional: false,
            type: EType.String
        }
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: (c) => {
        if (c.args.includes(undefined)) return
        if (!c.args[0].permissions.includes(c.args[1])) return c.err(c.translation.error,c.translation.permission.permission.permission_not_found)
        if (c.args.includes(undefined)) return
        if (!Helper.ensurePermission(c,c.args[1],true)) return
        c.args[0].permissions.push(c.args[1])
        c.log(c.translation.permission.permission.success,c.translation.permission.permission.remove_success.replace("{0}",c.args[0].name).replace("{1}",c.args[1]));
    }
}

var CommandPermissionPermissionList:ICommand = {
    name: "list",
    alias: ["l"],
    requiredPermission: "core.permission.list",
    argtypes: [
        {
            name: "member",
            optional: false,
            type: EType.MemberDataForServer
        }
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: (c) => {
        if (!c.args[0]) return
        c.log(c.translation.permission.permission.permission_list,`\`${c.args[0].permissions.join("`\n`")}\``)
    }
}

var CommandPermissionPermission:ICommand = {
    name: "permission",
    alias: ["perm"],
    requiredPermission: "core.permission.default",
    argtypes: [],
    useSubcommands: true,
    subcommmands: [
        CommandPermissionPermissionAdd,
        CommandPermissionPermissionRemove,
        CommandPermissionPermissionList
    ],
    handle: (c) => {}
    
}

export var ModulePermission:IModule = {
    name: "permission",
    commands: [
        CommandPermissionPermission
    ],
    handlers: [],
    init: async () => {
        
    }
}