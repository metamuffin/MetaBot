import { IModule } from '../module';
import { ICommand } from '../command';
import { EType, Helper } from '../helper';
import { Database } from '../database';
import { PermissionModifier, PermissionModifierOrigin, UserModelForServer } from '../../models';
import { ensurePermission, getMemberRolePermModifiers } from '../permission';
import { GuildManager, GuildMember } from 'discord.js';

function genToken(len: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
        // TODO use of unsecure Math.random randomness. Use crypto random instead
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



var allpermtoken = ""

var CommandPermissionPermissionAdd: ICommand = {
    name: "add",
    alias: ["a"],
    requiredPermission: "core.permission.add",
    argtypes: [
        {
            name: "type",
            optional: false,
            type: EType.String
        },
        {
            name: "member or role id",
            optional: false,
            type: EType.String
        },
        {
            name: "order",
            optional: false,
            type: EType.Integer
        },
        {
            name: "action",
            optional: false,
            type: EType.String
        },
        {
            name: "permission-name",
            optional: false,
            type: EType.String
        },
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: async (c) => {
        if (!["grant", "revoke"].includes(c.args[3])) return c.err("Invalid action", "")
        if (!ensurePermission(c, c.args[4], true)) return
        var newperm: PermissionModifier = {
            action: c.args[3],
            name: c.args[4],
            order: c.args[2]
        }
        if (c.args[0].toLowerCase() == "role") {
            var sd = (await Database.getServerDoc(c.server.id))
            if (!c.server.roles.resolve(c.args[1])) return c.err("role not found", "")
            if (!sd.rolePermissions[c.args[1]]) sd.rolePermissions[c.args[1]] = []
            var rp = sd.rolePermissions[c.args[1]]
            rp.push(newperm)
            await Database.updateServerDoc(sd)
        } else {
            var ud = await Database.getUserDocForServer(c.args[1], c.server.id)
            ud.permissions.push(newperm)
            await Database.updateUserDocForServer(ud)
        }
        c.log("", c.translation.permission.permission.success);
    }
}

var CommandPermissionPermissionRemove: ICommand = {
    name: "remove",
    alias: ["r", "d"],
    requiredPermission: "core.permission.remove",
    argtypes: [
        {
            name: "type",
            optional: false,
            type: EType.String
        },
        {
            name: "member or role id",
            optional: false,
            type: EType.String
        },
        {
            name: "index",
            optional: false,
            type: EType.Integer
        }
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: async (c) => {
        if (c.args[0].toLowerCase() == "role") {
            var sd = (await Database.getServerDoc(c.server.id))
            if (!sd.rolePermissions.hasOwnProperty(c.args[1])) return c.err(c.translation.permission.permission.permission_not_found, "")
            var rp = sd.rolePermissions[c.args[1]]
            if (c.args[2] >= rp.length) return c.err(c.translation.permission.permission.permission_not_found, "")
            if (!ensurePermission(c, rp[c.args[2]].name, true)) return
            rp.splice(c.args[2], 1)
            await Database.updateServerDoc(sd)
        } else {
            var ud = await Database.getUserDocForServer(c.args[1], c.server.id)
            if (c.args[2] >= ud.permissions.length) return c.err(c.translation.permission.permission.permission_not_found, "")
            if (!ensurePermission(c, ud.permissions[c.args[2]].name, true)) return
            ud.permissions.splice(c.args[2], 1)
            await Database.updateUserDocForServer(ud)
        }
        c.log("", c.translation.permission.permission.success);
    }
}

var CommandPermissionPermissionList: ICommand = {
    name: "list",
    alias: ["l"],
    requiredPermission: "core.permission.list",
    argtypes: [
        {
            name: "type",
            optional: false,
            type: EType.String
        },
        {
            name: "member or role id",
            optional: false,
            type: EType.String
        },
        {
            name: "include inherited perms",
            optional: true,
            type: EType.Boolean
        }
    ],
    useSubcommands: false,
    subcommmands: [],
    handle: async (c) => {
        var modifiers: PermissionModifierOrigin[] = []
        if (c.args[0].toLowerCase() == "role") {
            var raperms = (await c.getServerDoc()).rolePermissions
            if (!raperms.hasOwnProperty(c.args[1])) return c.err("Role not found", "ID invalid")
            modifiers = raperms[c.args[1]].map(e => ({ ...e, origin: undefined }))
        } else {
            var member: GuildMember = await c.server.members.fetch({ user: c.args[1] })
            modifiers = (await Database.getUserDocForServer(member.user.id, c.server.id)).permissions.map(e => ({ ...e, origin: undefined }));
            if (c.args[2]) modifiers = [...modifiers, ...(await getMemberRolePermModifiers(await c.getServerDoc(), member))]
        }
        const displayPerm = (p: PermissionModifierOrigin, index: number): [number, string] => {
            return [p.order, `${index}. (${p.order}) ${p.action.toUpperCase()}: ${p.name}` + (p.origin ? ` (inherited from '${p.origin.name}')` : "")]
        }
        const sorter = (a: [number, string], b: [number, string]) => b[0] - a[0]
        c.log(c.translation.permission.permission.permission_list, `\`${modifiers.map(displayPerm).sort(sorter).map(e => e[1]).join("`\n`")}\``)
    }
}

var CommandPermissionPermission: ICommand = {
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
    handle: (c) => { }

}

var CommandPermissionUsePermToken: ICommand = {
    name: "usepermtoken",
    alias: [],
    argtypes: [
        {
            name: "token",
            optional: false,
            type: EType.String
        }
    ],
    requiredPermission: null,
    subcommmands: [],
    useSubcommands: false,
    handle: async (c) => {
        if (c.args[0] == allpermtoken) {
            updateToken()
            var ud = await Database.getUserDocForServer(c.author.id, c.server.id)
            ud.permissions.push({
                order: 10,
                name: "*",
                action: "grant"
            })
            await Database.updateUserDocForServer(ud);
            c.log("Success", `Granted all permissions to ${c.author.username}`)
        } else {
            c.err("Du KEK!", "Das darfst du nicht!")
        }
    }
}

export var ModulePermission: IModule = {
    name: "permission",
    commands: [
        CommandPermissionPermission,
        CommandPermissionUsePermToken,
    ],
    handlers: [],
    init: async () => {
        updateToken()
    }
}


function updateToken() {
    allpermtoken = genToken(16)
    console.log(`ALL PERMISSIONS TOKEN: ${allpermtoken}`);
}