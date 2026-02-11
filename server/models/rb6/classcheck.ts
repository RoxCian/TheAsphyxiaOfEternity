import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb6ClasscheckIndex, RbClasscheckClearType } from "../shared/rb_types"

export class Rb6Classcheck implements ICollection<"rb.rb6.playData.classcheck"> {
    readonly collection = "rb.rb6.playData.classcheck"
    @XD.s32() class: Rb6ClasscheckIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.ToX.s32() @XD.ToO.s32("t_score") totalScore = 0
    @XD.ToO.s32("s_ar") separateAchievementRateTimes100: number[] = [0, 0, 0]
    @XD.ToO.s32("s_score") separateScore: number[] = [0, 0, 0]
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classIndex: Rb6ClasscheckIndex = Rb6ClasscheckIndex.none) {
        this.class = classIndex
    }
}