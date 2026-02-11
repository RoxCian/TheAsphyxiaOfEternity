import { XD } from "../../utils/x"

export class Rb3EventControl {
    @XD.s32() type = 0
    @XD.s32() index = 0
    @XD.s32() phase = 0
    @XD.s32() value = 0
    @XD.s32() value2 = 0
    @XD.s32() startTime = 0
    @XD.s32() endTime = 0

    static readonly examples: Rb3EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const limit = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
        for (let i = 0; i < limit.length; i++) {
            for (let j = 0; j < limit[i]; j++) {
                const e = new Rb3EventControl(i, j)
                e.phase = 255
                e.value = 255
                e.value2 = 255
                e.startTime = 1533749833
                e.endTime = 2147483647
                this.examples.push(e)
            }
        }
        Object.freeze(this.examples)
    }
}
Rb3EventControl.init()
