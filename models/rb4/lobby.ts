import { getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme, u16me, u8me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb4LobbyEntryElement extends ICollection<"rb.rb4.temporary.lobbyEntry"> {
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
export const Rb4LobbyEntryElementMap: KObjectMappingRecord<IRb4LobbyEntryElement> = {
    collection: getCollectionMappingElement<IRb4LobbyEntryElement>("rb.rb4.temporary.lobbyEntry"),
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
export async function generateRb4LobbyEntryElement(readParam: IRb4LobbyEntryElement): Promise<IRb4LobbyEntryElement> {
    let entryId
    let checker: IRb4LobbyEntryElement[]
    do {
        entryId = Math.trunc(Math.random() * 99999999)
        checker = await DB.Find<IRb4LobbyEntryElement>({ collection: "rb.rb4.temporary.lobbyEntry", entryId: entryId })

    } while (checker.length > 0)
    return Object.assign<Partial<IRb4LobbyEntryElement>, IRb4LobbyEntryElement>({ name: readParam.userId.toString(), matchingGrade: 24, uattr: 0, entryId: entryId }, readParam)
}

export interface IRb4LobbyEntry {
    interval: number
    intervalP: number
    entry: IRb4LobbyEntryElement[]
}
export const Rb4LobbyEntryMap: KObjectMappingRecord<IRb4LobbyEntry> = {
    interval: s32me(),
    intervalP: s32me("interval_p"),
    entry: { 0: Rb4LobbyEntryElementMap, $targetKey: "e" }
}
export async function generateRb4LobbyEntry(readParam?: IRb4LobbyEntryElement): Promise<IRb4LobbyEntry> {
    return {
        interval: 6000,
        intervalP: 6000,
        entry: (readParam == null) ? null : [await generateRb4LobbyEntryElement(readParam)]
    }
}
