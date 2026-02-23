import { ICollection } from "../../utils/db/db_types"
import { ArrayWrapper, Type, TypeToken } from "../../utils/types"
import { XD, XM } from "../../utils/x"
import { Rb2EventStatus } from "../rb2/event"
import { RbVersion } from "./rb_types"

export class RbComment<TVersion extends RbVersion> implements ICollection<"rb.info.comment">, RbComment<TVersion> {
    readonly collection = "rb.info.comment"
    version: TVersion
    @XD.s32("eid") entryId = 0
    @XD.s32("uid") userId: number
    @XD.str() name: string
    @XD.s8("bln") balloon = 0
    @XD.s8("pref") prefecture = 53
    @XD.s32() time = 0
    @XD.str() comment = ""
    @XD.bool() isTweet = false
    constructor(version: TVersion, userId: number, name: string) {
        this.version = version
        this.userId = userId
        this.name = name
    }
}
export class Rb2Comment extends RbComment<2> {
    @XD.str("p_name") name = ""
    @XD.s32("exp") experience = 0
    @XD.s32("customize") iconId = 0
    @XD.s32("tid") teamId = 0
    @XD.str("t_name") teamName = "Asphyxia"
    @XD.str("lid") lobbyId = "ea"
    @XD.str("s_name") shopName = ""
}
export class Rb3Comment extends RbComment<3> {
    @XD.s16("icon") iconId = 0
    @XD.s32("tid") teamId = 0
    @XD.str("t_name") teamName = "Asphyxia"
}
export class Rb4Comment extends RbComment<4> {
    @XD.s16("icon") iconId = 0
    @XD.s32("tid") teamId = 0
    @XD.str("t_name") teamName = "Asphyxia"
    @XD.str("lid") lobbyId = "ea"
}
export class Rb6Comment extends RbComment<6> {
    @XD.s16("chara") characterId = 0
    @XD.str("lid") lobbyId = "ea"
}

export const rbCommentTypeToken: TypeToken<RbComment<RbVersion>> = Symbol()

export function getRbCommentType<TVersion extends RbVersion>(version: TVersion): Type<RbComment<TVersion>> {
    switch (version) {
        case 2: return Rb2Comment as unknown as Type<RbComment<TVersion>>
        case 3: return Rb3Comment as unknown as Type<RbComment<TVersion>>
        case 4:
        case 5: return Rb4Comment as unknown as Type<RbComment<TVersion>>
        case 6: return Rb6Comment as unknown as Type<RbComment<TVersion>>
        default: throw new Error(`Comment feature not implemented for RB version ${version}`)
    }
}

export class RbReadCommentParam {
    @XD.s32("uid") userId = 0
    @XD.s32("tid") teamId?: number
    @XD.s32() time = 0
    @XD.s32() limit = 0
}
class RbCommentsInfo {
    @XD.s32() time = Date.now()
}
export class RbComments<TVersion extends RbVersion> {
    @XD.type("comment", RbCommentsInfo) info = new RbCommentsInfo()
    @XD.a(rbCommentTypeToken) c?: RbComment<TVersion>[]
    @XD.a(rbCommentTypeToken) cf?: RbComment<TVersion>[]
    @XD.a(rbCommentTypeToken) cs?: RbComment<TVersion>[]
    @XD.a(rbCommentTypeToken) ct?: RbComment<TVersion>[]
}
export class Rb2Comments {
    @XD.s32() time = Date.now()
    @XD.obj({ c: XM.a(Rb2Comment), cf: XM.a(Rb2Comment) }) comment = {
        c: undefined as Rb2Comment[] | undefined,
        cf: undefined as Rb2Comment[] | undefined
    }
    @XD.aw("s", Rb2EventStatus) status: ArrayWrapper<"s", Rb2EventStatus> = {}
}