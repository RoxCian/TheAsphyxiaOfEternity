import { IRbPlayerAccount, IRbPlayerBase } from "../../models/utility/profile"

export async function generateUserId(): Promise<number> {
    let result: number

    do result = Math.trunc(Math.random() * 99999999)
    while (((await DB.Find<IRbPlayerAccount>(null, { $or: [{ collection: "rb.rb3.player.account" }, { collection: "rb.rb4.player.account" }, { collection: "rb.rb5.player.account" }, { collection: "rb.rb6.player.account" }], userId: result })).length > 0) && ((await DB.Find<IRbPlayerBase>(null, { $or: [{ collection: "rb.rb1.player.base" }, { collection: "rb.rb2.player.base" }], userId: result })).length > 0))

    return result
}