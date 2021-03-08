import { getCollectionMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme, u16me, u8me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRbLobbyEntryElement<T extends number> extends ICollection<`rb.rb${T}.temporary.lobbyEntry`> {
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
export function getRbLobbyEntryElementMap<T extends number>(forVersion: T): KObjectMappingRecord<IRbLobbyEntryElement<T>> {
    return {
        collection: <any>getCollectionMappingElement<IRbLobbyEntryElement<T>>(<`rb.rb${T}.temporary.lobbyEntry`>`rb.rb${forVersion}.temporary.lobbyEntry`),
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
}
export async function generateRbLobbyEntryElement<T extends number>(forVersion: T, readParam: IRbLobbyEntryElement<T>): Promise<IRbLobbyEntryElement<T>> {
    let entryId
    let checker: IRbLobbyEntryElement<T>[]
    do {
        entryId = Math.trunc(Math.random() * 99999999)
        checker = await DB.Find<IRbLobbyEntryElement<T>>({ collection: <`rb.rb${T}.temporary.lobbyEntry`>`rb.rb${forVersion}.temporary.lobbyEntry`, entryId: entryId })

    } while (checker.length > 0)
    return Object.assign<Partial<IRbLobbyEntryElement<T>>, IRbLobbyEntryElement<T>>({ name: readParam.userId.toString(), matchingGrade: 24, uattr: 0, entryId: entryId }, readParam)
}

export interface IRbLobbyEntry<T extends number> {
    interval: number
    intervalP: number
    entry: IRbLobbyEntryElement<T>[]
}
export function getRbLobbyEntryMap<T extends number>(forVersion: T): KObjectMappingRecord<IRbLobbyEntry<T>> {
    return {
        interval: s32me(),
        intervalP: s32me("interval_p"),
        entry: { 0: getRbLobbyEntryElementMap(forVersion), $targetKey: "e" }
    }
}
export async function generateRb5LobbyEntry<T extends number>(forVersion: T, readParam?: IRbLobbyEntryElement<T>): Promise<IRbLobbyEntry<T>> {
    return {
        interval: 6000,
        intervalP: 6000,
        entry: (readParam == null) ? null : [await generateRbLobbyEntryElement<T>(forVersion, readParam)]
    }
}
