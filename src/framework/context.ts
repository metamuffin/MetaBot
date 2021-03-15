import { IModule } from "./module";
import { Helper, logWithTags, messageLogNote } from "./helper";
import { Message, Guild, TextChannel, ColorResolvable, User } from "discord.js";

import { Database } from "./database";
import { ServerModel, UserModelForServer, UserModel } from "../models";
import { TranslationModel } from "../translation";
import { BOT_VERBOSE_MODE } from "./core";



export class GenericContext {
    public channel: TextChannel
    public author: User
    public message: Message
    public translation: TranslationModel
    public server: Guild
    private disabled: boolean


    constructor(event: Message) {
        this.message = event
        this.author = event.author
        // TODO
        // @ts-ignore
        this.server = event.guild
        if (!(event.channel instanceof TextChannel)) {
            throw new Error("Cannot use Commands in DM Channels")
        }
        this.channel = (event.channel instanceof TextChannel) ? event.channel : ((): any => { return null })()
        var t: any = {} // TODO
        this.disabled = false
        this.translation = t
    }



    public verboseClog(s: string, e?: Array<string>) {
        if (BOT_VERBOSE_MODE) this.clog(s, e)
    }

    public clog(s: string, extraTags?: Array<string>) {
        if (!extraTags) extraTags = [];
        logWithTags(["GENERAL", ...extraTags, ...messageLogNote(this.message)], s)
    }

    public async init(): Promise<boolean> {
        var t = await Database.getTranslation(this.message.author.id)

        if (!t) {
            this.log("This language is missing", "The language you selected is not yet availible. Feel free to contribute to Metabot by translating. Also note that the current translations are done via a automatic translation and so might not be correct. https://www.github.com/MetaMuffin/Metabot")
            return false
        }
        this.translation = t
        return await this.init2()
    }
    public async init2(): Promise<boolean> {
        return true
    }

    public async log(title: string | undefined, description: string | undefined): Promise<Message> {
        this.verboseClog(`${(title || "").split("\n")[0].substr(0, 100)} - ${(description || "").split("\n")[0].substr(0, 100)}`, ["RESPONSE"])
        return await this.send(title || "", description || "", 0xa70fff)
    }

    public async err(title: string, description: string): Promise<Message | undefined> {
        if (this.disabled) return
        return await this.send(title, description, 0xff0000)
    }

    public async send(title: string, description: string, color: ColorResolvable): Promise<Message> {
        return await this.channel.send({
            embed: {
                color: color,
                title: title,
                description: description,
                footer: {
                    text: ``
                }
            }
        });
    }

    public async getServerDoc(): Promise<ServerModel> {
        return await Database.getServerDoc(this.server.id)
    }
    public async getAuthorDoc(): Promise<UserModel> {
        return await Database.getUserDoc(this.author.id)
    }
    public async getAuthorDocForServer(): Promise<UserModelForServer> {
        return await Database.getUserDocForServer(this.author.id, this.server.id)
    }
    public async getAuthorLang(): Promise<string> {
        return (await this.getAuthorDoc()).language
    }
    public async updateAuthorDoc(doc: UserModel): Promise<void> {
        await Database.updateUserDoc(doc)
    }
    public async updateAuthorDocForServer(doc: UserModelForServer): Promise<void> {
        await Database.updateUserDocForServer(doc);
    }
    public async updateServerDoc(doc: ServerModel): Promise<void> {
        await Database.updateServerDoc(doc)
    }

    public async perm_catch(e: any) {
        this.err("Missing permission.", "Please inform the server owner to grant sufficient permission to MetaBot.")
        this.disabled = true
    }

}