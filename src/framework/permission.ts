import { GuildMember } from "discord.js";
import { PermissionBundle, PermissionModifier, PermissionModifierOrigin, ServerModel } from "../models";
import { GenericContext } from "./context";

export async function ensurePermission(context: GenericContext, permtest: string | null, doError: boolean = true): Promise<boolean> {
    if (permtest == null) return true;
    var permok = await checkPermission(context, permtest)
    if ((!permok) && doError) {
        context.err(context.translation.core.permission.no_permission.title, context.translation.core.permission.no_permission.description.replace("{perm}", permtest))
    }
    return permok
}

export async function checkPermission(context: GenericContext, permtest: string) {
    console.time("permdb")
    var permok = false;
    var modifiers = [
        ...(await context.getAuthorDocForServer()).permissions,
        ...(await getMemberRolePermModifiers(await context.getServerDoc(), context.message.member))
    ]
    console.timeEnd("permdb")
    console.time("permcheck")
    modifiers = modifiers.sort((a, b) => a.order - b.order)
    for (const mod of modifiers) {
        if (mod.action == "grant") if (doesPermstringInterect(mod.name, permtest)) permok = true
        if (mod.action == "revoke") if (doesPermstringInterect(mod.name, permtest)) permok = false
    }
    console.timeEnd("permcheck")
    return permok
}

export async function getMemberRolePermModifiers(serverdoc: ServerModel, member: GuildMember | null | undefined): Promise<PermissionModifierOrigin[]> {
    if (!member) return []
    let allroleperms: { [key: string]: PermissionBundle } = serverdoc.rolePermissions
    let userroles = member.roles.cache
    let userroleperms: PermissionModifierOrigin[] = []
    for (const [ur_id, ur] of userroles) {
        if (!allroleperms.hasOwnProperty(ur.id)) continue
        userroleperms.push(...allroleperms[ur.id].map(e => ({
            ...e, origin: ur
        })))
    }
    return userroleperms
}

export function doesPermstringInterect(base: string, test: string): boolean {
    if (base == "*") return true
    /*
    Tests:
    base,test => result

    a,b => false
    a,a => true
    a.c,a => true
    a,a.c => true
    * => true
    */
    return test.substr(0, base.length).startsWith(base)
}