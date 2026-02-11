import { XD } from "../../utils/x"

export class Rb1EventControl {
    // @XD.s32() nm = 0
    @XD.s32() type: number
    @XD.s32() index: number
    @XD.s32() value = 0
    @XD.s32() value2 = 0
    @XD.s32() startTime = 0
    @XD.s32() endTime = 0

    static readonly examples: Rb1EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const ctrl = [100, 100, 100]
        for (let i = 0; i < ctrl.length; i++) {
            for (let j = 0; j < ctrl[i]; j++) {
                const el = new Rb1EventControl(i, j)
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
Rb1EventControl.init()