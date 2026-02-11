import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb1ChartType } from "../shared/rb_types"

export class Rb2EventControl {
    @XD.s32() type: number
    @XD.s32() index: number
    @XD.s32() phase = 0
    @XD.s32() value = 0
    @XD.s32() value2 = 0
    @XD.s32() startTime = 0
    @XD.s32() endTime = 0

    static readonly examples: Rb2EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const ctrl = [100, 100, 100, 100, 100]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j < ctrl[i]; j++) {
                const el = new Rb2EventControl(i, j)
                el.phase = 255
                el.value = 255
                el.value2 = 255
                el.startTime = 1533749833
                el.endTime = 2147483647
                this.examples.push(el)
            }
        }
        Object.freeze(this.examples)
    }
}
Rb2EventControl.init()
export class Rb2EventStatus implements ICollection<"rb.rb2.player.event.status#userId"> {
    readonly collection = "rb.rb2.player.event.status#userId"
    @XD.s32("uid") userId: number
    @XD.str("p_name") name: string
    @XD.s32("exp") experience = 0
    @XD.s32() customize = 0
    @XD.s32("tid") teamId = -1
    @XD.s32("t_name") teamName = "ASPHYXIA"
    @XD.str("lid") lobbyId = "ea"
    @XD.str("s_name") shopName = ""
    @XD.s8("pref") prefecture = 53
    @XD.s32() time = 0
    @XD.s8() status = 1
    @XD.s8("stage") stageId = 0
    @XD.s32("mid") musicId = -1
    @XD.s8("ng") chartType = -1 as Rb1ChartType

    constructor(userId: number = 0, name: string = "") {
        this.userId = userId
        this.name = name
    }
}