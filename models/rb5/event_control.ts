import { KObjectMappingRecord } from "../../utility/mapping"

export interface IRb5EventControl {
    type: number
    index: number
    value: number
    value2: number
    startTime: number
    endTime: number
}
export const Rb5EventControlMap: KObjectMappingRecord<IRb5EventControl> = {
    type: { $type: "s32" },
    index: { $type: "s32" },
    value: { $type: "s32" },
    value2: { $type: "s32" },
    startTime: { $type: "s32", $targetKey: "start_time" },
    endTime: { $type: "s32", $targetKey: "end_time" }
}
export function getExampleEventControl(): IRb5EventControl[] {
    let result: IRb5EventControl[] = []
    let limit = [100, 100, 100]
    for (let i = 0; i < limit.length; i++) {
        for (let j = 0; j < limit[i]; j++) {
            result.push({
                type: i,
                index: j,
                value: 99,
                value2: 99,
                startTime: 1533749833,
                endTime: 2147483647
            })
        }
    }
    return result
}