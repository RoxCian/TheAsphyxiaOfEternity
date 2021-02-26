import { IRb1PlayerBase } from "../../models/rb1/profile"
import { IRb5PlayerAccount, IRb5PlayerBase } from "../../models/rb5/profile"
import { IRb6PlayerAccount, IRb6PlayerBase } from "../../models/rb6/profile"

export type IRbPlayerAccount = IRb6PlayerAccount | IRb5PlayerAccount
export type IRbPlayerBase = IRb6PlayerBase | IRb5PlayerBase | IRb1PlayerBase

export type FindPlayerResult = {
    account?: IRbPlayerAccount
    base: IRbPlayerBase
    userId: number
    name: string
}

export async function tryFindPlayer(rid: string, forVersion?: number): Promise<FindPlayerResult> {
    let result = <FindPlayerResult>{}
    let account: IRbPlayerAccount

    // RB6
    account = await DB.FindOne<IRb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
    if ((account != null) && (forVersion != 6)) {
        result.account = account
        result.base = await DB.FindOne<IRb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        return result
    }

    // RB5
    account = await DB.FindOne<IRb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
    if ((account != null) && (forVersion != 5)) {
        result.account = account
        result.base = await DB.FindOne<IRb5PlayerBase>(rid, { collection: "rb.rb5.player.base" })
        result.name = result.base.name
        result.userId = result.account.userId
        return result
    }

    // RB1
    if (forVersion != 1) {
        result.base = await DB.FindOne<IRb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })
        result.name = result.base.name
        result.userId = result.base.userId
        return result
    }
}