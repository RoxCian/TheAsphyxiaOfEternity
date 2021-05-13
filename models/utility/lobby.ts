import { getCollectionMappingElement, KObjectMappingElement, KObjectMappingRecord, s16me, s32me, s8me, strme, TypeForKItem, u16me, u8me, ignoreme } from "../../utility/mapping"
import { ICollection } from "./definitions"

export interface IRbLobbyEntryElement<TVersion extends number> extends ICollection<`rb.rb${TVersion}.temporary.lobbyEntry`> {
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
    isHanging: boolean
    ticking: number
}
export function getRbLobbyEntryElementMap<TVersion extends number>(version: TVersion): KObjectMappingRecord<IRbLobbyEntryElement<TVersion>> {
    return {
        collection: <`rb.rb${TVersion}.temporary.lobbyEntry` extends TypeForKItem ? KObjectMappingElement<`rb.rb${TVersion}.temporary.lobbyEntry`, "kignore"> : KObjectMappingRecord<`rb.rb${TVersion}.temporary.lobbyEntry`>>getCollectionMappingElement<IRbLobbyEntryElement<TVersion>>(<`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${version}.temporary.lobbyEntry`),
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
        version: u8me("ver"),
        isHanging: ignoreme(),
        ticking: ignoreme()
    }
}
export async function generateRbLobbyEntryElement<TVersion extends number>(version: TVersion, readParam: IRbLobbyEntryElement<TVersion>): Promise<IRbLobbyEntryElement<TVersion>> {
    let entryId
    let checker: IRbLobbyEntryElement<TVersion>[]
    do {
        entryId = Math.trunc(Math.random() * 99999999)
        checker = await DB.Find<IRbLobbyEntryElement<TVersion>>({ collection: <`rb.rb${TVersion}.temporary.lobbyEntry`>`rb.rb${version}.temporary.lobbyEntry`, entryId: entryId })
    } while (checker.length > 0)
    return Object.assign<IRbLobbyEntryElement<TVersion>, Partial<IRbLobbyEntryElement<TVersion>>>(readParam, { entryId: entryId })
}

export interface IRbLobbyEntry<TVersion extends number> {
    interval: number
    intervalP: number
    entryId?: number
    entry: IRbLobbyEntryElement<TVersion>[]
}
export function getRbLobbyEntryMap<TVersion extends number>(version: TVersion): KObjectMappingRecord<IRbLobbyEntry<TVersion>> {
    return {
        interval: s32me(),
        intervalP: s32me("interval_p"),
        entryId: s32me("eid"),
        entry: { 0: getRbLobbyEntryElementMap(version), $targetKey: "e" }
    }
}
export async function generateRbLobbyEntry<TVersion extends number>(version: TVersion, readParam?: IRbLobbyEntryElement<TVersion>): Promise<IRbLobbyEntry<TVersion>> {
    return {
        interval: 120,
        intervalP: 120,
        entry: (readParam == null) ? null : [await generateRbLobbyEntryElement(version, readParam)]
    }
}

export interface IRbLobbySettings<TVersion extends number> extends ICollection<`rb.rb${TVersion}.player.lobbySettings#userId`> {
    userId: number
    isEnabled: boolean
}
export function generateRbLobbySettings<TVersion extends number>(version: TVersion, userId: number): IRbLobbySettings<TVersion> {
    return {
        collection: <`rb.rb${TVersion}.player.lobbySettings#userId`>`rb.rb${version}.player.lobbySettings#userId`,
        userId: userId,
        isEnabled: true,
    }
}