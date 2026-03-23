import { findPlayerByUserIdFromOtherVersion } from "./find_player"

export async function generateUserId(): Promise<number> {
    let result: number

    do result = Math.trunc(Math.random() * 99999999)
    while (await findPlayerByUserIdFromOtherVersion(result))

    return result
}