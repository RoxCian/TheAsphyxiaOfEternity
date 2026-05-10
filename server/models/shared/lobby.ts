import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { RbChartType, RbColor, RbVersion } from "./rb_types"

export class RbLobbyEntryElement<TVersion extends RbVersion> implements ICollection<`rb.rb${TVersion}.temporary.lobbyEntry`> {
    collection: `rb.rb${TVersion}.temporary.lobbyEntry`
    @XD.s32("eid") entryId = 0
    @XD.u16("mid") musicId = 0
    @XD.u8("ng") chartType = 0 as RbChartType<TVersion>
    @XD.s32("uid") userId = 0
    @XD.s32() uattr?: number
    @XD.str("pn") name?: string
    @XD.s16("mg") matchingGrade?: number
    @XD.s32("mopt") matchingOption = 0
    @XD.s32("tid") teamId = 0
    @XD.str("tn") teamName = 0
    @XD.str("topt") teamOption = 0
    @XD.str("lid") lobbyId = 0
    @XD.str("sn") shopName = 0
    @XD.u8() pref = 0
    @XD.s8("stg") stageIndex = 0
    @XD.s8() pside = RbColor.red
    @XD.s16() eatime = 0
    @XD.u8("ga") gateway = [0, 0, 0, 0]
    @XD.u16("gp") portal = 0
    @XD.u8("la") adapter = [0, 0, 0, 0]
    @XD.u8("ver") version = 0
    isHanging = false
    ticking = 0

    constructor(version: TVersion) {
        this.collection = `rb.rb${version}.temporary.lobbyEntry` as const
    }

    async initialize(version: TVersion) {
        this.collection = `rb.rb${version}.temporary.lobbyEntry` as const
        this.entryId = await generateLobbyEntryId(version)
    }
}
export async function generateLobbyEntryId<TVersion extends RbVersion>(version: TVersion): Promise<number> {
    let result: number
    do result = Math.trunc(Math.random() * 99999999)
    while (await hasLobby(version, result))
    return result
}
async function hasLobby<TVersion extends RbVersion>(version: TVersion, entryId: number): Promise<boolean> {
    return !!(await DB.FindOne<RbLobbyEntryElement<TVersion>>({ collection: `rb.rb${version}.temporary.lobbyEntry` as const, entryId }))
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
        } else if (entryOrId) {
            this.entryId = entryOrId.entryId
            this.entries.push(entryOrId)
        } else this.entryId = 0
    }
    static async create<TVersion extends RbVersion>(version: TVersion, entry: RbLobbyEntryElement<TVersion>): Promise<RbLobbyEntry<TVersion>> {
        await entry.initialize(version) // MUST INITIALIZE
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
    @XD.u8("var") version = 0 // yeah it's *var*, maybe not a version field
}