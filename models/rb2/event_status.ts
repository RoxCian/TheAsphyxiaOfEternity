import { getCollectionMappingElement, KObjectMappingRecord, s32me, s8me, strme } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb2EventStatus extends ICollection<"rb.rb2.player.event.status#userId"> {
    userId: number
    name: string
    experience: number
    customize: number
    teamId: number
    teamName: string
    lobbyId: string
    shopName: string
    prefecture: number
    time: number
    status: number
    stageId: number
    musicId: number
    chartType: number
}
export const Rb2EventStatusMap: KObjectMappingRecord<IRb2EventStatus> = {
    collection: getCollectionMappingElement<IRb2EventStatus>("rb.rb2.player.event.status#userId"),
    userId: s32me("uid"),
    name: strme("p_name"),
    experience: s32me("exp"),
    customize: s32me(),
    teamId: s32me("tid"),
    teamName: strme("t_name"),
    lobbyId: strme("lid"),
    shopName: strme("s_name"),
    prefecture: s8me("pref"),
    time: s32me(),
    status: s8me(),
    stageId: s8me("stage"),
    musicId: s32me("mid"),
    chartType: s8me("ng")
}
export function generateRb2EventStatus(userId: number, name: string): IRb2EventStatus {
    return {
        collection: "rb.rb2.player.event.status#userId",
        userId: userId,
        name: name,
        experience: 0,
        customize: 0,
        teamId: -1,
        teamName: "ASPHYXIA",
        lobbyId: "ea",
        shopName: "",
        prefecture: 53,
        time: 0,
        status: 1,
        stageId: 0,
        musicId: -1,
        chartType: -1
    }
}