import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { RbChartType, RbVersion } from "./rb_types"

export class RbLobbyEntryElement<TVersion extends RbVersion> implements ICollection<`rb.rb${TVersion}.temporary.lobbyEntry`> {
    readonly collection: `rb.rb${TVersion}.temporary.lobbyEntry`
    @XD.s32("eid") entryId: number
    @XD.u16("mid") musicId: number
    @XD.u8("ng") chartType: RbChartType<TVersion>
    @XD.s32("uid") userId: number
    @XD.s32() uattr?: number
    @XD.str("pn") name?: string
    @XD.s16("mg") matchingGrade?: number
    @XD.s32("mopt") matchingOption: number
    @XD.s32("tid") teamId: number
    @XD.str("tn") teamName: string
    @XD.str("topt") teamOption: number
    @XD.str("lid") lobbyId: string
    @XD.str("sn") shopName: string
    @XD.u8() pref: number
    @XD.s8("stg") stageIndex: number
    @XD.s8() pside: number
    @XD.s16() eatime: number
    @XD.u8("ga") gateway: number[]
    @XD.u16("gp") portal: number
    @XD.u8("la") adapter: number[]
    @XD.u8("ver") version: number
    isHanging: boolean
    ticking: number

    constructor(version: TVersion) {
        this.collection = `rb.rb${version}.temporary.lobbyEntry` as const
        do {
            this.entryId = Math.trunc(Math.random() * 99999999)
        } while (hasLobby(version, this.entryId))
    }
}
export async function generateLobbyEntryId<TVersion extends RbVersion>(version: TVersion): Promise<number> {
    let result: number
    do result = Math.trunc(Math.random() * 99999999)
    while (await hasLobby(version, result))
    return result
}
async function hasLobby<TVersion extends RbVersion>(version: TVersion, entryId: number): Promise<boolean> {
    return !!(await DB.FindOne<RbLobbyEntryElement<TVersion>>({ collection: `rb.rb${version}.temporary.lobbyEntry` as const, entryId: entryId }))
}

export class RbLobbyEntry<TVersion extends RbVersion> {
    @XD.s32() interval = 120
    @XD.s32() intervalP = 120
    @XD.s32("eid") entryId: number
    @XD.a(RbLobbyEntryElement, "e") entries: RbLobbyEntryElement<TVersion>[] = []

    constructor(entryId: number)
    constructor(entry: RbLobbyEntryElement<TVersion>)
    constructor(entryOrId?: number | RbLobbyEntryElement<TVersion>) {
        if (typeof entryOrId === "number") {
            this.entryId = entryOrId
        } else {
            this.entryId = entryOrId?.entryId ?? 0
            this.entries.push(entryOrId)
        }
    }
    static async create<TVersion extends RbVersion>(version: TVersion, entry: RbLobbyEntryElement<TVersion>): Promise<RbLobbyEntry<TVersion>> {
        const entryId = await generateLobbyEntryId(version)
        entry.entryId = entryId
        return new RbLobbyEntry(entry)
    }
}

export class RbLobbySettings<TVersion extends number> implements ICollection<`rb.rb${TVersion}.player.lobbySettings#userId`> {
    readonly collection: `rb.rb${TVersion}.player.lobbySettings#userId`
    userId: number
    isEnabled = true

    constructor(version: TVersion, userId: number) {
        this.collection = `rb.rb${version}.player.lobbySettings#userId` as const
        this.userId = userId
    }
}

export class ReadLobbyParams {
    @XD.s32("uid") userId = 0
    @XD.u8("m_grade") matchingGrade = 0
    @XD.str("lid") lobbyId = "ea"
    @XD.s32("max") maxRivalCount = 0
    @XD.s32() friend: number[] = []
    @XD.u8("var") version = 0 // TODO: check the tag name
}