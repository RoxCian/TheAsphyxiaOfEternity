import { XD } from "../../utils/x"
import { ICollection } from "../../utils/db/db_types"
import { Rb4DojoIndex, RbClasscheckClearType } from "../shared/rb_types"
import { Rb4PlayerStageLog } from "./profile"

export class Rb4Classcheck implements ICollection<"rb.rb4.playData.classcheck"> {
    readonly collection = "rb.rb4.playData.classcheck"
    @XD.s32() class: Rb4DojoIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    // score is weighted by some multiplier mechanics in game and is not real score
    @XD.ToX.s32("total_score") @XD.ToO.s32("t_score") totalCompletionScore = 0
    // AR is not real AR, it's a gauge of completion like clear rate of dan courses in IIDX
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.ToO.s32("s_score") separateCompletionScore: [number, number, number] = [0, 0, 0]
    @XD.ToO.s32("s_ar") separateAchievementRateTimes100: [number, number, number] = [0, 0, 0]
    stageLogs?: Rb4PlayerStageLog[]
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classId: Rb4DojoIndex = -1) {
        this.class = classId
    }
}
