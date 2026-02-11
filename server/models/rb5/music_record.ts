import { ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb4ChartType, Rb4ClearType } from "../shared/rb_types"

export class Rb5MusicOldRecord {
    @XD.s16("mid") musicId: number
    @XD.s8("ntgrd") chartType: Rb4ChartType
    @XD.s32("pc") playCount = 0
    @XD.s8("ct") clearType = Rb4ClearType.none
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("scr") score = 0
    @XD.s16() combo = 0
    @XD.s16("ms") missCount = -1
    @XD.s16() param = 0
    @XD.s32("bscrt") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bart") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bctt") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmst") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.u16("ver") version?: number

    constructor(musicId: number, chartType: Rb4ChartType) {
        this.musicId = musicId
        this.chartType = chartType
    }
}
export class Rb5MusicRecord extends Rb5MusicOldRecord implements ICollection<"rb.rb5.playData.musicRecord"> {
    readonly collection = "rb.rb5.playData.musicRecord"
    @XD.s32() time = Math.trunc(Date.now() / 1000)
    @XD.s32("bst") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bct") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bat") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmt") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32() kFlag = 0
    @XD.bool("ghostr") isHasGhostRed = false
    @XD.bool("ghostb") isHasGhostBlue = false
}

class Rb5MusicRecordsData {
    @XD.aw("rec", Rb5MusicRecord) record?: ArrayWrapper<"rec", Rb5MusicRecord> = {}
    @XD.aw("rec", Rb5MusicOldRecord) recordOld?: ArrayWrapper<"rec", Rb5MusicOldRecord> = {}
}
export class Rb5MusicRecords {
    @XD.type(Rb5MusicRecordsData) pdata = new Rb5MusicRecordsData()
}