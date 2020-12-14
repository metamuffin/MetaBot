import { GenericContext } from "./context";

export async function ensurePermission(context:GenericContext, permstring: string|null, doError:boolean=true):Promise<boolean> {
    if (permstring == null) return true;
    
    let userperms:Array<string> = (await context.getAuthorDocForServer()).permissions
    userperms.map((e)=>{e.toLowerCase()})
    permstring = permstring.toLowerCase()

    let permparts:Array<string> = permstring.split(".")
    let permok:boolean = false;

    for (let i = 0; i < permparts.length; i++) {
        let permtest:string = (i == permparts.length-1) ? permstring : (permparts.slice(0,i+1).join(".") + ".*")
        
        if (userperms.includes(permtest)) {
            permok = true;
        }
    }
    
    if (userperms.includes("*")) permok = true;
    if ((!permok) && doError){
        context.err(context.translation.core.permission.no_permission.title,context.translation.core.permission.no_permission.description.replace("{perm}",permstring))
    }
    return permok;
}
