import { KITEM2, KObjectMappingRecord, mapKObject } from "../../utility/mapping";

export interface IRb5LobbyController {
    interval: number
    intervalP: number
    eid: number
}
export const Rb5LobbyControllerMap: KObjectMappingRecord<IRb5LobbyController> = {
    interval: { $type: "s32" },
    intervalP: { $type: "s32", $targetKey: "interval_p" },
    eid: { $type: "s32" }
}
export function generateKRb5LobbyController(): KITEM2<IRb5LobbyController> {
    return mapKObject<IRb5LobbyController>({ interval: 6000, intervalP: 6000, eid: 0 }, Rb5LobbyControllerMap)
}