import { XD } from "../../utils/x"

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
    private static examplesInternal: Rb3EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const limit = [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 1, 300, 300, 300, 300, 300]
        for (let i = 0; i < limit.length; i++) {
            for (let j = 0; j < limit[i]; j++) {
                const e = new Rb3EventControl(i, j)
                e.phase = i === this.eventTypeOfStampBoost ? 1 : 255
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
