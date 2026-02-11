import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb4DojoIndex, RbClasscheckClearType } from "../shared/rb_types"

export class Rb4Classcheck implements ICollection<"rb.rb4.playData.classcheck"> {
    readonly collection = "rb.rb4.playData.classcheck"
    @XD.s32() class: Rb4DojoIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.ToX.s32() @XD.ToO.s32("t_score") totalScore = 0
    @XD.ToO.s32("s_score") seperateScore = [0, 0, 0]
    @XD.ToO.s32("s_ar") seperateAchievementRateTimes100 = [0, 0, 0]
    musicsId = [-1, -1, -1]
    chartsType = [-1, -1, -1]
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classId: Rb4DojoIndex = -1) {
        this.class = classId
    }
}
