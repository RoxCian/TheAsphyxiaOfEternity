import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"
import { Rb4DojoIndex, RbClasscheckClearType } from "../shared/rb_types"
import { Rb4PlayerStageLog } from "./profile"

export class Rb4Classcheck implements ICollection<"rb.rb4.playData.classcheck"> {
    readonly collection = "rb.rb4.playData.classcheck"
    @XD.s32() class: Rb4DojoIndex
    @XD.s32() clearType = RbClasscheckClearType.none
    // score is not real score and ar is not real AR, they are some parameters of completion like clear rate of dan courses in IIDX
    @XD.ToX.s32("total_ar") @XD.ToO.s32("t_ar") averageCompletionRateTimes100 = 0
    @XD.ToX.s32("total_score") @XD.ToO.s32("t_score") totalCompletionScore = 0
    @XD.ToO.s32("s_score") separateCompletionScore: [number, number, number] = [0, 0, 0]
    @XD.ToO.s32("s_ar") separateCompletionRateTimes100: [number, number, number] = [0, 0, 0]
    stageLogs?: Rb4PlayerStageLog[]
    @XD.ToX.s32() playCount = 0
    @XD.ToX.s32() lastPlayTime = 0
    @XD.ToX.s32() recordUpdateTime = 0
    @XD.ToX.s32() @XD.ToO.s32("score_rank") rank = 0

    constructor(classId: Rb4DojoIndex = -1) {
        this.class = classId
    }
}
