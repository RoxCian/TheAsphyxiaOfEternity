import { Rb1PlayerBase } from "../../models/rb1/profile"
import { Rb2PlayerBase } from "../../models/rb2/profile"
import { Rb3PlayerAccount, Rb3PlayerBase } from "../../models/rb3/profile"
import { Rb4PlayerAccount, Rb4PlayerBase } from "../../models/rb4/profile"
import { Rb5PlayerAccount, Rb5PlayerBase } from "../../models/rb5/profile"
import { Rb6PlayerAccount, Rb6PlayerBase } from "../../models/rb6/profile"
import { RbVersion } from "../../models/shared/rb_types"

type RbPlayerAccount = Rb6PlayerAccount | Rb5PlayerAccount | Rb4PlayerAccount | Rb3PlayerAccount
type RbPlayerBase = Rb6PlayerBase | Rb5PlayerBase | Rb4PlayerBase | Rb3PlayerBase | Rb2PlayerBase | Rb1PlayerBase

export type FindPlayerResult = {
    account?: RbPlayerAccount
    base: RbPlayerBase
    userId: number
    name: string
    version: RbVersion
}
export async function findPlayer(rid: string, version: RbVersion): Promise<FindPlayerResult> {
    const result = { version: version } as FindPlayerResult
    let account: RbPlayerAccount
    let base: RbPlayerBase

    switch (version) {
        case 1:
            base = await DB.FindOne<Rb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })
            result.userId = base?.userId
            break
        case 2:
            base = await DB.FindOne<Rb2PlayerBase>(rid, { collection: "rb.rb2.player.base" })
            result.userId = base?.userId
            break
        case 3:
            account = await DB.FindOne<Rb3PlayerAccount>(rid, { collection: "rb.rb3.player.account" })
            base = await DB.FindOne<Rb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
            break
        case 4:
            account = await DB.FindOne<Rb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })
            base = await DB.FindOne<Rb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })
            break
        case 5:
            account = await DB.FindOne<Rb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
            base = await DB.FindOne<Rb5PlayerBase>(rid, { collection: "rb.rb5.player.base" })
            break
        case 6:
            account = await DB.FindOne<Rb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
            base = await DB.FindOne<Rb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
            break
    }
    if (!base) return undefined
    result.base = base
    result.name = base.name
    if (account) {
        result.account = account
        result.userId = account.userId
    }
    return result
}
export async function findPlayerByUserIdFromOtherVersion(userId: number, forVersion?: RbVersion): Promise<FindPlayerResult> {
    const result = {} as FindPlayerResult
    let account: RbPlayerAccount
    let base: RbPlayerBase

    // RB1
    if (forVersion !== 1) {
        base = await DB.FindOne<Rb1PlayerBase>(undefined, { collection: "rb.rb1.player.base", userId })
        if (base) {
            result.base = base
            result.name = base.name
            result.userId = base.userId
            result.version = 1
            return result
        }
    }

    // RB2
    if (forVersion !== 2) {
        base = await DB.FindOne<Rb2PlayerBase>(undefined, { collection: "rb.rb2.player.base", userId })
        if (base) {
            result.base = base
            result.name = base.name
            result.userId = base.userId
            result.version = 2
            return result
        }
    }

    // RB3
    if (forVersion !== 3) {
        account = await DB.FindOne<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account", userId })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb3PlayerBase>(undefined, { collection: "rb.rb3.player.base", userId })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 3
            return result
        }
    }

    // RB4
    if (forVersion !== 4) {
        account = await DB.FindOne<Rb4PlayerAccount>(undefined, { collection: "rb.rb4.player.account", userId })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb4PlayerBase>(undefined, { collection: "rb.rb4.player.base", userId })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 4
            return result
        }
    }

    // RB5
    if (forVersion !== 5) {
        account = await DB.FindOne<Rb5PlayerAccount>(undefined, { collection: "rb.rb5.player.account", userId })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb5PlayerBase>(undefined, { collection: "rb.rb5.player.base", userId })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 5
            return result
        }
    }

    // RB6
    if (forVersion !== 6) {
        account = await DB.FindOne<Rb6PlayerAccount>(undefined, { collection: "rb.rb6.player.account", userId })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb6PlayerBase>(undefined, { collection: "rb.rb6.player.base", userId })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 6
            return result
        }
    }

    return result
}
export async function findPlayerFromOtherVersion(rid: string, forVersion?: RbVersion): Promise<FindPlayerResult> {
    const result = {} as FindPlayerResult
    let account: RbPlayerAccount
    let base: RbPlayerBase

    // RB1
    if (forVersion !== 1) {
        base = await DB.FindOne<Rb1PlayerBase>(rid, { collection: "rb.rb1.player.base" })
        if (base) {
            result.base = base
            result.name = base.name
            result.userId = base.userId
            result.version = 1
            return result
        }
    }

    // RB2
    if (forVersion !== 2) {
        base = await DB.FindOne<Rb2PlayerBase>(rid, { collection: "rb.rb2.player.base" })
        if (base) {
            result.base = base
            result.name = base.name
            result.userId = base.userId
            result.version = 2
            return result
        }
    }

    // RB3
    if (forVersion !== 3) {
        account = await DB.FindOne<Rb3PlayerAccount>(rid, { collection: "rb.rb3.player.account" })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb3PlayerBase>(rid, { collection: "rb.rb3.player.base" })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 3
            return result
        }
    }

    // RB4
    if (forVersion !== 4) {
        account = await DB.FindOne<Rb4PlayerAccount>(rid, { collection: "rb.rb4.player.account" })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb4PlayerBase>(rid, { collection: "rb.rb4.player.base" })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 4
            return result
        }
    }

    // RB5
    if (forVersion !== 5) {
        account = await DB.FindOne<Rb5PlayerAccount>(rid, { collection: "rb.rb5.player.account" })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb5PlayerBase>(rid, { collection: "rb.rb5.player.base" })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 5
            return result
        }
    }

    // RB6
    if (forVersion !== 6) {
        account = await DB.FindOne<Rb6PlayerAccount>(rid, { collection: "rb.rb6.player.account" })
        if (account) {
            result.account = account
            result.base = await DB.FindOne<Rb6PlayerBase>(rid, { collection: "rb.rb6.player.base" })
            result.name = result.base.name
            result.userId = result.account.userId
            result.version = 6
            return result
        }
    }
}