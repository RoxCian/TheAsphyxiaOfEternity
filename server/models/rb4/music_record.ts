import { XD } from "../../utils/x"
import { Rb4ChartType, Rb4ClearType } from "../shared/rb_types"
import { ArrayWrapper } from "../../utils/types"
import { ICollection } from "../../utils/db/db_types"

export class Rb4MusicOldRecord {
    @XD.s16("mid") musicId: number
    @XD.s8("ntgrd") chartType: Rb4ChartType
    @XD.s32("pc") playCount = 0
    @XD.s8("ct") clearType = Rb4ClearType.none // 1: hard failed, 10: hard cleared, 11: s-hard cleared
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("scr") score = 0
    @XD.s16() combo = 0
    @XD.s16("ms") missCount = -1
    @XD.s16() param = 0
    @XD.s32("bst") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bat") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bct") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmt") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.u16("ver") version?: number

    constructor(musicId: number = 0, chartType: Rb4ChartType = 0) {
        this.musicId = musicId
        this.chartType = chartType
    }
}
export class Rb4MusicRecord extends Rb4MusicOldRecord implements ICollection<"rb.rb4.playData.musicRecord"> {
    readonly collection = "rb.rb4.playData.musicRecord"
    @XD.s32("bscrt") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bart") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bctt") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmst") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32() time = Math.trunc(Date.now() / 1000)
    @XD.s32() kFlag = 0
    @XD.bool("ghostr") isHasGhostRed = false
    @XD.bool("ghostb") isHasGhostBlue = false

    constructor(musicId: number = 0, chartType: Rb4ChartType = 0) {
        super(musicId, chartType)
    }
}

class Rb4MusicRecordsData {
    @XD.aw("rec", Rb4MusicRecord) record: ArrayWrapper<"rec", Rb4MusicRecord> = {}
    @XD.aw("rec", Rb4MusicOldRecord) recordOld: ArrayWrapper<"rec", Rb4MusicOldRecord> = {}
}
export class Rb4MusicRecords {
    @XD.type(Rb4MusicRecordsData) pdata = new Rb4MusicRecordsData()
}