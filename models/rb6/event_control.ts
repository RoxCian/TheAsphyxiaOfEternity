import { KObjectMappingRecord, s32me } from "../../utility/mapping"

export interface IRb6EventControl {
    type: number
    index: number
    value: number
    value2: number
    startTime: number
    endTime: number
}
export const Rb6EventControlMap: KObjectMappingRecord<IRb6EventControl> = {
    type: s32me(),
    index: s32me(),
    value: s32me(),
    value2: s32me(),
    startTime: s32me("start_time"),
    endTime: s32me("end_time")
}
export function getExampleEventControl(): IRb6EventControl[] {
    let result: IRb6EventControl[] = []
    let limit = [0, 100, 100, 31]
    for (let i = 0; i < limit.length; i++) {
        for (let j = 0; j < limit[i]; j++) {
            result.push({
                type: i,
                index: j,
                value: ((i == 1) && (j >= 5) && (j <= 8)) ? (j + 65) : ((i == 1) && (j == 3)) ? 1 : 127,
                value2: ((i == 1) && (j >= 5) && (j <= 8)) ? 63 : ((i == 1) && (j == 3)) ? 1 : 127,
                startTime: 1533749833,
                endTime: 2147483647
            })
        }
    }
    return result
}