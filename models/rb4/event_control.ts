import { KObjectMappingRecord, s32me } from "../../utility/mapping"

export interface IRb4EventControl {
    type: number
    index: number
    value: number
    value2: number
    startTime: number
    endTime: number
}
export const Rb4EventControlMap: KObjectMappingRecord<IRb4EventControl> = {
    type: s32me(),
    index: s32me(),
    value: s32me(),
    value2: s32me(),
    startTime: s32me("start_time"),
    endTime: s32me("end_time")
}
export function getExampleEventControl(): IRb4EventControl[] {
    let result: IRb4EventControl[] = []
    let limit = [100, 100, 100, 30, 30]
    for (let i = 0; i < limit.length; i++) {
        for (let j = 0; j < limit[i]; j++) {
            result.push({
                type: i,
                index: j,
                value: 3,
                value2: 3,
                startTime: 1533749833,
                endTime: 2147483647
            })
        }
    }
    return result
}