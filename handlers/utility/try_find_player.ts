import { IRb1PlayerBase } from "../../models/rb1/profile"
import { IRb2PlayerBase } from "../../models/rb2/profile"
import { IRb3PlayerAccount, IRb3PlayerBase } from "../../models/rb3/profile"
import { IRb4PlayerAccount, IRb4PlayerBase } from "../../models/rb4/profile"
import { IRb5PlayerAccount, IRb5PlayerBase } from "../../models/rb5/profile"
import { IRb6PlayerAccount, IRb6PlayerBase } from "../../models/rb6/profile"
import { IRbPlayerAccount, IRbPlayerBase } from "../../models/utility/profile"

export type FindPlayerResult = {
    account?: IRbPlayerAccount
    base: IRbPlayerBase
    userId: number
    name: string
    version: number
}

export async function tryFindPlayer(rid: string, forVersion?: number): Promise<FindPlayerResult> {
    let result = <FindPlayerResult>{}
    let account: IRbPlayerAccount
    let base: IRbPlayerBase

    // RB1
    base = await DB.FindOne<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })
    if ((base != null) && forVersion != 1) {
        result.base = base
        result.name = base.name
        result.userId = base.userId
        result.version = 1
        return result
    }

    // RB2
    base = await DB.FindOne<IRb2PlayerBase>(rid, { collection: "rb.rb2.player.base" })
    if ((base != null) && (forVersion != 2)) {
        result.base = base
        result.name = base.name
        result.userId = base.userId
        result.version = 2
        return result
    }

    // RB3
    account = await DB.FindOne<IRb3PlayerAccount>(rid, { collection: "rb.rb3.player.account" })
    if ((account != null) && (forVersion != 3)) {
        result.account = account
        result.base = await DB.FindOne<IRb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        result.version = 3
        return result
    }

    // RB4
    account = await DB.FindOne<IRb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })
    if ((account != null) && (forVersion != 4)) {
        result.account = account
        result.base = await DB.FindOne<IRb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        result.version = 4
        return result
    }

    // RB5
    account = await DB.FindOne<IRb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
    if ((account != null) && (forVersion != 5)) {
        result.account = account
        result.base = await DB.FindOne<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        result.version = 5
        return result
    }

    // RB6
    account = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
    if ((account != null) && (forVersion != 6)) {
        result.account = account
        result.base = await DB.FindOne<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        result.version = 6
        return result
    }
}