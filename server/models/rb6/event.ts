import { XD } from "../../utils/x"

export class Rb6EventControl {
    @XD.s32() type: number
    @XD.s32() index: number
    @XD.s32() value = 0
    @XD.s32() value2 = 0
    @XD.s32() startTime = 0
    @XD.s32() endTime = 0

    static readonly examples: Rb6EventControl[] = []
    private static initialized = false

    constructor(type: number, index: number) {
        this.type = type
        this.index = index
    }

    static init() {
        if (this.initialized) return
        this.initialized = true
        const limit = [0, 100, 100, 31]
        for (let i = 0; i < limit.length; i++) {
            for (let j = 0; j < limit[i]; j++) {
                const e = new Rb6EventControl(i, j)
                if (i === 1 && j >= 5 && j <= 8) {
                    // Graduate costume unlocking / Pastel-kun
                    e.value = j + 65
                    e.value2 = 63
                } else if (i === 1 && j === 3) {
                    e.value = 1
                    e.value2 = 1
                } else {
                    e.value = 127
                    e.value2 = 127
                }
                e.startTime = 1533749833
                e.endTime = 2147483647
                this.examples.push(e)
            }
        }
        Object.freeze(this.examples)
    }
}
Rb6EventControl.init()
