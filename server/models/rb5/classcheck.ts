import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb5ClasscheckIndex, RbClasscheckClearType } from "../shared/rb_types"

export class Rb5Classcheck implements ICollection<"rb.rb5.playData.classcheck"> {
    readonly collection = "rb.rb5.playData.classcheck"
    @XD.s32() class: Rb5ClasscheckIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    @XD.ToO.s32("s_ar") seperateAchievementRateTimes100: number[] = [0, 0, 0]
    @XD.ToO.s32("s_score") seperateScore: number[] = [0, 0, 0]
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageAchievementRateTimes100 = 0
    @XD.ToX.s32() @XD.ToO.s32("t_score") totalScore = 0
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classIndex: Rb5ClasscheckIndex = Rb5ClasscheckIndex.none) {
        this.class = classIndex
    }
}