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
export function getExampleEventControl(): IRb6EventControl {
    return {
        type: 1,
        index: 1,
        value: 25,
        value2: 1,
        startTime: 1533749833,
        endTime: 1924991999
    }
}