import { ICollection } from "../../utils/db/db_types"
import { ArrayWrapper } from "../../utils/types"
import { XD } from "../../utils/x"
import { Rb6ChartType, Rb6ClearType } from "../shared/rb_types"

export class Rb6MusicRecord implements ICollection<"rb.rb6.playData.musicRecord"> {
    readonly collection = "rb.rb6.playData.musicRecord"
    @XD.s16("mid") musicId: number
    @XD.s8("ntgrd") chartType: Rb6ChartType
    @XD.s32("pc") playCount = 0
    @XD.s8("ct") clearType = Rb6ClearType.none
    @XD.s16("ar") achievementRateTimes100 = 0
    @XD.s16("scr") score = 0
    @XD.s16() combo = 0
    @XD.s16("ms") missCount = 0
    @XD.s16() param = 0
    @XD.s32() time = Math.trunc(Date.now() / 1000)
    @XD.s32("bscrt") bestScoreUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bart") bestAchievementRateUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bctt") bestComboUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32("bmst") bestMissCountUpdateTime = Math.trunc(Date.now() / 1000)
    @XD.s32() kFlag = 0
    @XD.s32("jcolr") justCollectionRateTimes100Red = 0
    @XD.s32("jcolb") justCollectionRateTimes100Blue = 0
    @XD.bool("ghostr") isHasGhostRed = false
    @XD.bool("ghostb") isHasGhostBlue = false

    constructor(musicId: number, chartType: Rb6ChartType) {
        this.musicId = musicId
        this.chartType = chartType
    }
}

class Rb6MusicRecordsData {
    @XD.aw("rec", Rb6MusicRecord) record: ArrayWrapper<"rec", Rb6MusicRecord> = {}
}
export class Rb6MusicRecords {
    @XD.type(Rb6MusicRecordsData) pdata = new Rb6MusicRecordsData()
}
