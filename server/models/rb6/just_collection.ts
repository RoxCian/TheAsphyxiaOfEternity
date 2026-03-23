import { ICollection } from "../../utils/db/db_types"
import { DBH } from "../../utils/db/dbh"
import { base64ToBuffer, bufferToBase64 } from "../../utils/utility_functions"
import { XD } from "../../utils/x"
import { Rb6ChartType } from "../shared/rb_types"

const JCBinSize = 10240

export class Rb6JustCollection implements ICollection<"rb.rb6.playData.justCollection#userId"> {
    readonly collection: "rb.rb6.playData.justCollection#userId"
    @XD.s32() userId?: number = 0
    @XD.s32() musicId = 0
    @XD.s32("note_grade") chartType = Rb6ChartType.basic
    @XD.bin("item_red_data_bin") get redData(): Buffer | undefined {
        if (this.redDataBase64) return base64ToBuffer(this.redDataBase64, JCBinSize)
    }
    set redData(data: Buffer | undefined) {
        if (!data) delete this.redDataBase64
        else this.redDataBase64 = bufferToBase64(data)
    }
    @XD.bin("item_blue_data_bin") get blueData(): Buffer | undefined {
        if (this.blueDataBase64) return base64ToBuffer(this.blueDataBase64, JCBinSize)
    }
    set blueData(data: Buffer | undefined) {
        if (!data) delete this.blueDataBase64
        else this.blueDataBase64 = bufferToBase64(data)
    }
    redDataBase64?: string
    blueDataBase64?: string
}

class Rb6ReadJustCollectionMusicInfo {
    @XD.s32() musicId = 0
    @XD.s32("note_grade") chartType = Rb6ChartType.basic
}

class Rb6ReadJustCollectionData {
    @XD.bin("item_blue_data_bin") blueData?: Buffer
    @XD.bin("item_red_data_bin") redData?: Buffer
    @XD.type(Rb6ReadJustCollectionMusicInfo) list?: Rb6ReadJustCollectionMusicInfo

    asEmptyData() {
        this.list = new Rb6ReadJustCollectionMusicInfo()
        this.list.musicId = 1
        this.list.chartType = Rb6ChartType.hard
    }
}

export class Rb6ReadJustCollection {
    @XD.type(Rb6ReadJustCollectionData) justcollection = new Rb6ReadJustCollectionData()
}

export class Rb6ReadJustCollectionParameters {
    @XD.s32() userId = 0
    @XD.s32() musicId = 0
    @XD.s8("note_grade") chartType = Rb6ChartType.basic
}