import { RbVersion } from "rbweb"

export type RbPlayerEntry = {
    name: string
    nameOrig?: string
    abbr?: string
    title?: string
    titleOrig?: string
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
const Rb4ReflecMeijin: RbPlayerEntry = { name: "リフレク名人", abbr: "名人", title: "リフレク名人 / Reflec Meijin", tagClass: "meijin" }
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
    35: { name: "Chaos Joker", abbr: "C. Joker", tagClass: "pwq chaos-joker" },
    40: { name: "Asura", abbr: "Asura", nameOrig: "阿修羅", title: `Triple face devil "Asura"`, titleOrig: "三面の凶気　阿修羅", tagClass: "ms asura" },
    41: { name: "Chimera", abbr: "Chimera", nameOrig: "キマイラ", title: `Frightening beast king "Chimera"`, titleOrig: "爆圧獣王　キマイラ", tagClass: "ms chimera" },
    42: { name: "Leviathan", abbr: "Leviathan", nameOrig: "リヴァイアサン", title: `Wyvern in sea of endless "Leviathan"`, titleOrig: "絶海の王龍　リヴァイアサン", tagClass: "ms leviathan" },
    43: { name: "Vampire", abbr: "Vampire", nameOrig: "ヴァンパイア", title: `Emperor of darkness "Vampire"`, titleOrig: "漆黒の魔皇帝　ヴァンパイア", tagClass: "ms vampire" },
    44: { name: "Cyclops", abbr: "Cyclops", nameOrig: "サイクロプス", title: `World devouring giant "Cyclops"`, titleOrig: "地を喰らう巨人　サイクロプス", tagClass: "ms cyclops" },
    45: { name: "Griffin", abbr: "Griffin", nameOrig: "グリフォン", title: `Aerial monster sprite "Griffin"`, titleOrig: "空天の獣精　グリフォン", tagClass: "ms griffin" },
    46: { name: "Griffin", abbr: "Griffin", nameOrig: "バハムート", title: `Overlord over the universe "Bahamūt"`, titleOrig: "天地万象の覇王　バハムート", tagClass: "ms bahamut" },
    47: { name: "Bahamūt†", abbr: "Bahamūt†", nameOrig: "バハムート†", title: `Overlord over the universe "Bahamūt†"`, titleOrig: "天地万象の覇王　バハムート　二代目", tagClass: "ms bahamut" },
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