import { getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme, u16me, u8me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb6LobbyEntryElement extends ICollection<"rb.rb6.temporary.lobbyEntry"> {
    entryId: number
    musicId: number
    chartType: number
    userId: number
    uattr?: number
    name?: string
    matchingGrade?: number
    matchingOption: number
    teamId: number
    teamName: string
    teamOption: number
    lobbyId: string
    shopName: string
    pref: number
    stageIndex: number
    pside: number
    eatime: number
    gateway: number[]
    portal: number
    adapter: number[]
    version: number
}
export const Rb6LobbyEntryElementMap: KObjectMappingRecord<IRb6LobbyEntryElement> = {
    collection: getCollectionMappingElement<IRb6LobbyEntryElement>("rb.rb6.temporary.lobbyEntry"),
    entryId: s32me("eid"),
    musicId: u16me("mid"),
    chartType: u8me("ng"),
    userId: s32me("uid"),
    uattr: s32me(),
    name: strme("pn"),
    matchingGrade: s16me("mg"),
    matchingOption: s32me("mopt"),
    teamId: s32me("tid"),
    teamName: strme("tn"),
    teamOption: s32me("topt"),
    lobbyId: strme("lid"),
    shopName: strme("sn"),
    pref: u8me(),
    stageIndex: s8me("stg"),
    pside: s8me(),
    eatime: s16me(),
    gateway: u8me("ga"),
    portal: u16me("gp"),
    adapter: u8me("la"),
    version: u8me("ver")
}
export async function generateRb6LobbyEntryElement(readParam: IRb6LobbyEntryElement): Promise<IRb6LobbyEntryElement> {
    let entryId
    let checker: IRb6LobbyEntryElement[]
    do {
        entryId = Math.trunc(Math.random() * 99999999)
        checker = await DB.Find<IRb6LobbyEntryElement>({ collection: "rb.rb6.temporary.lobbyEntry", entryId: entryId })

    } while (checker.length > 0)
    return Object.assign<Partial<IRb6LobbyEntryElement>, IRb6LobbyEntryElement>({ name: readParam.userId.toString(), matchingGrade: 24, uattr: 0, entryId: entryId }, readParam)
}

export interface IRb6LobbyEntry {
    interval: number
    intervalP: number
    entry: IRb6LobbyEntryElement[]
}
export const Rb6LobbyEntryMap: KObjectMappingRecord<IRb6LobbyEntry> = {
    interval: s32me(),
    intervalP: s32me("interval_p"),
    entry: { 0: Rb6LobbyEntryElementMap, $targetKey: "e" }
}
export async function generateRb6LobbyEntry(readParam?: IRb6LobbyEntryElement): Promise<IRb6LobbyEntry> {
    return {
        interval: 24000,
        intervalP: 24000,
        entry: (readParam == null) ? null : [await generateRb6LobbyEntryElement(readParam)]
    }
}
