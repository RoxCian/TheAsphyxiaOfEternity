import { findPlayerByUserIdFromOtherVersion } from "./find_player"

export async function generateUserId(): Promise<number> {
    let result: number

    do result = Math.round(Math.random() * 99999998) + 1
    while (await findPlayerByUserIdFromOtherVersion(result))

    return result
}