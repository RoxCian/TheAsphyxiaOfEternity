import { getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme, u16me, u8me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb3LobbyEntryElement extends ICollection<"rb.rb3.temporary.lobbyEntry"> {
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
export const Rb3LobbyEntryElementMap: KObjectMappingRecord<IRb3LobbyEntryElement> = {
    collection: getCollectionMappingElement<IRb3LobbyEntryElement>("rb.rb3.temporary.lobbyEntry"),
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
export async function generateRb3LobbyEntryElement(readParam: IRb3LobbyEntryElement): Promise<IRb3LobbyEntryElement> {
    let entryId
    let checker: IRb3LobbyEntryElement[]
    do {
        entryId = Math.trunc(Math.random() * 99999999)
        checker = await DB.Find<IRb3LobbyEntryElement>({ collection: "rb.rb3.temporary.lobbyEntry", entryId: entryId })

    } while (checker.length > 0)
    return Object.assign<Partial<IRb3LobbyEntryElement>, IRb3LobbyEntryElement>({ name: readParam.userId.toString(), matchingGrade: 24, uattr: 0, entryId: entryId }, readParam)
}

export interface IRb3LobbyEntry {
    interval: number
    intervalP: number
    entry: IRb3LobbyEntryElement[]
}
export const Rb3LobbyEntryMap: KObjectMappingRecord<IRb3LobbyEntry> = {
    interval: s32me(),
    intervalP: s32me("interval_p"),
    entry: { 0: Rb3LobbyEntryElementMap, $targetKey: "e" }
}
export async function generateRb3LobbyEntry(readParam?: IRb3LobbyEntryElement): Promise<IRb3LobbyEntry> {
    return {
        interval: 6000,
        intervalP: 6000,
        entry: (readParam == null) ? null : [await generateRb3LobbyEntryElement(readParam)]
    }
}
