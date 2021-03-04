import { KObjectMappingRecord } from "../../utility/mapping"

export interface IRb3EventControl {
    type: number
    index: number
    phase: number
    value: number
    value2: number
    startTime: number
    endTime: number
}
export const Rb3EventControlMap: KObjectMappingRecord<IRb3EventControl> = {
    type: { $type: "s32" },
    index: { $type: "s32" },
    phase: { $type: "s32" },
    value: { $type: "s32" },
    value2: { $type: "s32" },
    startTime: { $type: "s32", $targetKey: "start_time" },
    endTime: { $type: "s32", $targetKey: "end_time" }
}
export function getExampleEventControl(): IRb3EventControl {
    return {
        type: 1,
        index: 1,
        phase: 0,
        value: 25,
        value2: 1,
        startTime: 1533749833,
        endTime: 1924991999
    }
}