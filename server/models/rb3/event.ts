import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb3VerdetDesKriegesResponse } from "./types"

export class Rb3EventControl {
    @XD.s32() type = 0
    @XD.s32() index = 0
    @XD.s32() phase = 0
    @XD.s32() value = 0
    @XD.s32() value2 = 0
    @XD.s32() startTime = 0
    @XD.s32() endTime = 0

    static get examples(): Rb3EventControl[] {
        const stampBoost: number = U.GetConfig("<colette>_daily_stamp_boost")
        if (stampBoost === this.lastStampBoostValue) return this.examplesInternal
        const stampBoostEvent = this.examplesInternal.find(ev => ev.type === this.eventTypeOfStampBoost)
        if (stampBoostEvent) stampBoostEvent.phase = stampBoost
        this.lastStampBoostValue = stampBoost
        return this.examplesInternal
    }
    private static lastStampBoostValue: number = 1
    private static readonly eventTypeOfStampBoost = 10
    private static readonly eventTypeOfTricolettePark = 9
    private static examplesInternal: Rb3EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const limit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
        for (let i = 0; i < limit.length; i++) {
            for (let j = 0; j < limit[i]; j++) {
                const e = new Rb3EventControl(i, j)
                e.phase = i === this.eventTypeOfStampBoost ? 1 : i === this.eventTypeOfTricolettePark ? 0 : 255
                e.value = 255
                e.value2 = 255
                e.startTime = 1533749833
                e.endTime = 2147483647
                this.examplesInternal.push(e)
            }
        }
        Object.freeze(this.examples)
    }
}
Rb3EventControl.init()

export class Rb3VerdetDesKrieges implements ICollection<"rb.rb3.event.verdetDesKrieges">, Rb3VerdetDesKriegesResponse {
    readonly collection = "rb.rb3.event.verdetDesKrieges"
    completed = false
    chapter = 1
    page = 0
    lastReadChapter = 1
    lastReadPage = 0
    progress: [number, number, number, number, number] = [0, 0, 0, 0, 0] // max is 15
}

export class Rb3JubeatCollaboration implements ICollection<"rb.rb3.event.jubeatCollaboration"> {
    readonly collection = "rb.rb3.event.jubeatCollaboration"
    @XD.bool("start_flg") startFlag = true
    @XD.u16("marathontype") marathonType = 0
    @XD.u32() smithStart = 0
    @XD.u32() pastelStart = 0
    @XD.u16() smithOuen = 0
    @XD.u16() pastelOuen = 0
    @XD.u16("distancetype") distanceType = 0
    @XD.bool() smithGoal = false
    @XD.bool() pastelGoal = false
    @XD.bool("run1_1_j_flg") runFlagJ1_1 = false
    @XD.bool("run1_2_j_flg") runFlagJ1_2 = false
    @XD.bool("run1_3_j_flg") runFlagJ1_3 = false
    @XD.bool("run1_1_r_flg") runFlagR1_1 = false
    @XD.bool("run1_2_r_flg") runFlagR1_2 = false
    @XD.bool("run1_3_r_flg") runFlagR1_3 = false
    @XD.bool("run1_4_flg") runFlag1_4 = false
    @XD.bool("run2_1_j_flg") runFlagJ2_1 = false
    @XD.bool("run2_2_j_flg") runFlagJ2_2 = false
    @XD.bool("run2_3_j_flg") runFlagJ2_3 = false
    @XD.bool("run2_1_r_flg") runFlagR2_1 = false
    @XD.bool("run2_2_r_flg") runFlagR2_2 = false
    @XD.bool("run2_3_r_flg") runFlagR2_3 = false
    @XD.bool("run2_4_flg") runFlag2_4 = false
    @XD.bool("run3_1_j_flg") runFlagJ3_1 = false
    @XD.bool("run3_2_j_flg") runFlagJ3_2 = false
    @XD.bool("run3_3_j_flg") runFlagJ3_3 = false
    @XD.bool("run3_1_r_flg") runFlagR3_1 = false
    @XD.bool("run3_2_r_flg") runFlagR3_2 = false
    @XD.bool("run3_3_r_flg") runFlagR3_3 = false
    @XD.bool("run3_4_flg") runFlag3_4 = false
    @XD.bool("run4_1_j_flg") runFlagJ4_1 = false
    @XD.bool("run4_1_r_flg") runFlagR4_1 = false
    @XD.bool("run4_2_flg") runFlag4_2 = false
}