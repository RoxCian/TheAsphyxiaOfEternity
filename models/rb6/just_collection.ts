import { binme, getCollectionMappingElement, ignoreme, KObjectMappingRecord, s32me, s8me } from "../../utility/mapping"
import { ICollection } from "../utility/definitions"

export interface IRb6JustCollection extends ICollection<"rb.rb6.playData.justCollection#userId"> {
    userId?: number
    musicId: number
    chartType: number
    blueData?: Buffer
    redData?: Buffer
    blueDataArray?: number[]
    redDataArray?: number[]
    blueDataBase64?: string
    redDataBase64?: string
}
export const Rb6JustCollectionMap: KObjectMappingRecord<IRb6JustCollection> = {
    collection: getCollectionMappingElement<IRb6JustCollection>("rb.rb6.playData.justCollection#userId"),
    userId: s32me("user_id"),
    musicId: s32me("music_id"),
    chartType: s8me("note_grade"),
    blueData: binme("item_blue_data_bin"),
    redData: binme("item_red_data_bin"),
    blueDataArray: ignoreme(),
    redDataArray: ignoreme(),
    blueDataBase64: ignoreme(),
    redDataBase64: ignoreme()
}

export interface IRb6ReadJustCollection {
    blueData?: Buffer
    redData?: Buffer
    list: {
        musicId: number
        chartType: number
    }
}
export const Rb6ReadJustCollectionMap: KObjectMappingRecord<IRb6ReadJustCollection> = {
    list: {
        musicId: s32me("music_id"),
        chartType: s8me("note_grade"),
    },
    blueData: binme("item_blue_data_bin"),
    redData: binme("item_red_data_bin")
}