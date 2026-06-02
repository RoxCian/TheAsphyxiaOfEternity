import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb4DojoIndex, RbClasscheckClearType } from "../shared/rb_types"
import { Rb4PlayerStageLog } from "./profile"

export class Rb4Classcheck implements ICollection<"rb.rb4.playData.classcheck"> {
    readonly collection = "rb.rb4.playData.classcheck"
    @XD.s32() class: Rb4DojoIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.ToX.s32() @XD.ToO.s32("t_score") totalScore = 0
    @XD.ToO.s32("s_score") get seperateScore() {
        return [0, 0, 0].map((_, i) => this.stageLogs?.[i]?.score ?? 0)
    }
    @XD.ToO.s32("s_ar") get seperateAchievementRateTimes100() {
        return [0, 0, 0].map((_, i) => this.stageLogs?.[i]?.achievementRateTimes100 ?? 0)
    }
    stageLogs?: Rb4PlayerStageLog[]
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classId: Rb4DojoIndex = -1) {
        this.class = classId
    }
}
