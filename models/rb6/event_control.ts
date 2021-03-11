import { KObjectMappingRecord } from "../../utility/mapping"

export interface IRb6EventControl {
    type: number
    index: number
    value: number
    value2: number
    startTime: number
    endTime: number
}
export const Rb6EventControlMap: KObjectMappingRecord<IRb6EventControl> = {
    type: { $type: "s32" },
    index: { $type: "s32" },
    value: { $type: "s32" },
    value2: { $type: "s32" },
    startTime: { $type: "s32", $targetKey: "start_time" },
    endTime: { $type: "s32", $targetKey: "end_time" }
}
export function getExampleEventControl(): IRb6EventControl[] {
    let result: IRb6EventControl[] = []
    let limit = [0, 100, 100]
    for (let i = 0; i < limit.length; i++) {
        for (let j = 0; j < limit[i]; j++) {
            result.push({
                type: i,
                index: j,
                value: ((i == 1) && (j >= 5) && (j <= 8)) ? (j + 61) : ((i == 1) && (j == 3)) ? 2 : 99,
                value2: ((i == 1) && (j >= 5) && (j <= 8)) ? 63 : ((i == 1) && (j == 3)) ? 1 : 99,
                startTime: 1533749833,
                endTime: 9924991999
            })
        }
    }
    return result
}