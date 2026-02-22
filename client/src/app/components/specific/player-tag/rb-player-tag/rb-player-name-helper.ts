import { RbVersion } from "rbweb"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"
import { Signal } from "@angular/core"

export type RbPlayerEntry = {
    name: string
    title?: string
    tagClass?: string
}
type MusicId = number
type CpuId = number
const Rb3SpecialCpuPlayers: Record<MusicId, RbPlayerEntry> = {
    410: { name: "♠", title: "CECIL SPADE", tagClass: "pwt cecil" },    // Velvet Sentiment
    413: { name: "♥", title: "ROSE HEART", tagClass: "pwt rose" },      // Ambitious
    414: { name: "♣", title: "FRANCIS CLUB", tagClass: "pwt francis" }, // SPEED BLADE
    415: { name: "♦", title: "LILY DIA", tagClass: "pwt lily" },        // Arcanos
    416: { name: "JOKER", tagClass: "pwt joker" },                      // CLAMARE
}
const Rb4ReflecMeijin: RbPlayerEntry = { name: "リフレク名人", title: "リフレク名人 / Reflec Meijin", tagClass: "meijin" }
const Rb4SpecialCpuPlayers: Record<CpuId, RbPlayerEntry> = {
    20: Rb4ReflecMeijin,
    21: Rb4ReflecMeijin,
    22: Rb4ReflecMeijin,
    23: Rb4ReflecMeijin,
    24: Rb4ReflecMeijin,
    25: Rb4ReflecMeijin,
    26: { name: "Rose", tagClass: "pwq rose" },
    27: { name: "Merly", tagClass: "pwq merly" },
    28: { name: "Francis", tagClass: "pwq francis" },
    29: { name: "Jack", tagClass: "pwq jack" },
    30: { name: "Lily", tagClass: "pwq lily" },
    31: { name: "Alice", tagClass: "pwq alice" },
    32: { name: "Cecil", tagClass: "pwq cecil" },
    33: { name: "???", tagClass: "pwq colette-joker" },
    34: { name: "Hanzo", tagClass: "pwq hanzo" },
    35: { name: "Chaos Joker", tagClass: "pwq chaos-joker" },
    40: { name: "Asura", title: `Triple face devil "Asura"`, tagClass: "ms asura" },
    41: { name: "Chimera", title: `Frightening beast king "Chimera"`, tagClass: "ms chimera" },
    42: { name: "Leviathan", title: `Wyvern in sea of endless "Leviathan"`, tagClass: "ms leviathan" },
    43: { name: "Vampire", title: `Emperor of darkness "Vampire"`, tagClass: "ms vampire" },
    44: { name: "Cyclops", title: `World devouring giant "Cyclops"`, tagClass: "ms cyclops" },
    45: { name: "Griffin", title: `Aerial monster sprite "Griffin"`, tagClass: "ms griffin" },
    46: { name: "Bahamūt", title: `Overlord over the universe "Bahamūt"`, tagClass: "ms bahamut" },
    47: { name: "Bahamūt†", title: `Overlord over the universe "Bahamūt†"`, tagClass: "ms bahamut" },
}
export function getPlayerEntry(version: RbVersion, player?: string, cpuId?: number, musicId?: number): RbPlayerEntry {
    if (cpuId == undefined) return { name: player ?? "" }
    const defaultCpu: RbPlayerEntry = { name: cpuId === 0 ? "CPU" : `CPU ${cpuId}` }
    if (version === 3) {
        if (cpuId < 7 || cpuId > 9 || musicId == undefined) return defaultCpu
        return Rb3SpecialCpuPlayers[musicId] ?? defaultCpu
    } else if (version === 4) return Rb4SpecialCpuPlayers[cpuId] ?? defaultCpu
    return defaultCpu
}
export function playerEntryEquals(left: RbPlayerEntry, right: RbPlayerEntry) {
    return left.name === right.name && left.title === right.title
}