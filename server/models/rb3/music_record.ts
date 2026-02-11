import { ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb1ChartType } from "../shared/rb_types"

export class Rb3MusicOldRecord implements ICollection<"rb.rb3.playData.musicRecord"> {
    readonly collection = "rb.rb3.playData.musicRecord"
    @XD.s16("mid") musicId: number
    @XD.s8("ntgrd") chartType: Rb1ChartType
    @XD.s32("pc") playCount = 0
    @XD.s8("ct") clearType = 0
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("scr") score = 0
    @XD.s16("cmb") combo = 0
    @XD.s16("ms") missCount = -1
    @XD.s32() time = Math.trunc(Date.now() / 1000)
    @XD.s32("bscrt") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bart") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bctt") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmst") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.u16("ver") version?: number

    constructor(musicId: number, chartType: Rb1ChartType) {
        this.musicId = musicId
        this.chartType = chartType
    }
}
export class Rb3MusicRecord extends Rb3MusicOldRecord {
    @XD.s32("bst") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bat") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bct") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmt") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32() kFlag = 0
    @XD.bool("ghostb") isHasGhostRed = false
    @XD.bool("ghostr") isHasGhostBlue = false
}

export class Rb3ReadPlayerMusicRecordData {
    @XD.aw("rec", Rb3MusicRecord) record: ArrayWrapper<"rec", Rb3MusicRecord> = {}
}
export class Rb3ReadPlayerMusicRecord {
    @XD.type(Rb3ReadPlayerMusicRecordData) pdata = new Rb3ReadPlayerMusicRecordData()
}