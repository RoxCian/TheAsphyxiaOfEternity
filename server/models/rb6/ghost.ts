import { ICollection } from "../../utils/db/db_types"
import { base64ToBuffer, bufferToBase64 } from "../../utils/utility_functions"
import { XD } from "../../utils/x"
import { Rb6ChartType } from "../shared/rb_types"

export class Rb6Ghost implements ICollection<"rb.rb6.playData.ghost#userId"> {
    readonly collection = "rb.rb6.playData.ghost#userId"
    userId?: number
    @XD.s32("chara_card_id") characterCardId = 0
    @XD.s32() matchingGrade = 0
    @XD.s32() musicId: number
    @XD.s8("note_grade") chartType: Rb6ChartType
    @XD.bin("item_red_data_bin") get redData(): Buffer | undefined {
        if (this.redDataBase64) return base64ToBuffer(this.redDataBase64, 10240)
    }
    set redData(data: Buffer | undefined) {
        if (!data) delete this.redDataBase64
        else this.redDataBase64 = bufferToBase64(data)
    }
    @XD.bin("item_blue_data_bin") get blueData(): Buffer | undefined {
        if (this.blueDataBase64) return base64ToBuffer(this.blueDataBase64, 10240)
    }
    set blueData(data: Buffer | undefined) {
        if (!data) delete this.blueDataBase64
        else this.blueDataBase64 = bufferToBase64(data)
    }
    redDataBase64?: string
    blueDataBase64?: string

    constructor(musicId: number = 0, chartType: Rb6ChartType = Rb6ChartType.basic) {
        this.musicId = musicId
        this.chartType = chartType
    }
}

export class Rb6ReadGhost {
    @XD.type(Rb6Ghost) ghost: Rb6Ghost
}

export class Rb6GhostWinCount {
    @XD.s32() info = 0
}

export class Rb6ReadGhostParam {
    @XD.s32() redUserId = 0
    @XD.s32() blueUserId = 0
    @XD.s32() musicId = 0
    @XD.s8("note_grade") chartType = Rb6ChartType.basic
    @XD.s32("matching_greade") matchingGrade = 0 // greade!
    @XD.s32() composerType = 0
}