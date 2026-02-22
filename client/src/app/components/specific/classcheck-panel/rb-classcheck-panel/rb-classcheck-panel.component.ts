import { Component, computed, input } from "@angular/core"
import { RbClasscheckResponse, Rb4DojoIndex, Rb5ClasscheckIndex, Rb6ClasscheckIndex, RbVersionWithClasscheck } from "rbweb"

@Component({
    selector: "rb-classcheck",
    standalone: false,
    templateUrl: "./rb-classcheck-panel.component.html",
    styleUrls: ["./rb-classcheck-panel.component.sass"]
})
export class RbClasscheckPanelComponent<T extends RbVersionWithClasscheck> {
    readonly classcheck = input.required<RbClasscheckResponse<T>>()
    readonly realIndex = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class11:
                case Rb5ClasscheckIndex.class12:
                case Rb5ClasscheckIndex.class13: return classcheck.class - 12
                default: return classcheck.class + 3
            }
        }
        return classcheck.class
    })
    readonly classcheckNameSub = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            switch (classcheck.class) {
                case Rb4DojoIndex.kyu5: return "5 Kyu"
                case Rb4DojoIndex.kyu4: return "4 Kyu"
                case Rb4DojoIndex.kyu3: return "3 Kyu"
                case Rb4DojoIndex.kyu2: return "2 Kyu"
                case Rb4DojoIndex.kyu1: return "1 Kyu"
                case Rb4DojoIndex.dan1: return "1 Dan"
                case Rb4DojoIndex.dan2: return "2 Dan"
                case Rb4DojoIndex.dan3: return "3 Dan"
                case Rb4DojoIndex.dan4: return "4 Dan"
                case Rb4DojoIndex.dan5: return "5 Dan"
                case Rb4DojoIndex.dan6: return "6 Dan"
                case Rb4DojoIndex.dan7: return "7 Dan"
                case Rb4DojoIndex.dan8: return "8 Dan"
                case Rb4DojoIndex.shihandai: return "Assistant Master"
                case Rb4DojoIndex.shihan: return "Master"
                case Rb4DojoIndex.meiyoshihan: return "Honorary Master"
                case Rb4DojoIndex.saikoshihan: return "Legendary Master"
                default: return classcheck.examination?.name
            }
        } else if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class0: return "CLASS 0"
                case Rb5ClasscheckIndex.kiwami: return "EXTREME"
                default: return undefined
            }
        } else {
            switch (classcheck.class) {
                case Rb6ClasscheckIndex.class0: return "CLASS 0"
                case Rb6ClasscheckIndex.kiwami: return "EXTREME"
                default: return undefined
            }
        }
    })
    readonly classcheckNameMain = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            switch (classcheck.class) {
                case Rb4DojoIndex.kyu5: return "五級"
                case Rb4DojoIndex.kyu4: return "四級"
                case Rb4DojoIndex.kyu3: return "三級"
                case Rb4DojoIndex.kyu2: return "二級"
                case Rb4DojoIndex.kyu1: return "一級"
                case Rb4DojoIndex.dan1: return "一段"
                case Rb4DojoIndex.dan2: return "二段"
                case Rb4DojoIndex.dan3: return "三段"
                case Rb4DojoIndex.dan4: return "四段"
                case Rb4DojoIndex.dan5: return "五段"
                case Rb4DojoIndex.dan6: return "六段"
                case Rb4DojoIndex.dan7: return "七段"
                case Rb4DojoIndex.dan8: return "八段"
                case Rb4DojoIndex.shihandai: return "師範代"
                case Rb4DojoIndex.shihan: return "師範"
                case Rb4DojoIndex.meiyoshihan: return "名誉師範"
                case Rb4DojoIndex.saikoshihan: return "最高師範"
                default: return classcheck.examination?.nameOrig
            }
        } else if (isVersion(classcheck, 5)) {
            switch (classcheck.class) {
                case Rb5ClasscheckIndex.class0: return "CLASS 零"
                case Rb5ClasscheckIndex.kiwami: return "極"
                case Rb5ClasscheckIndex.class11:
                case Rb5ClasscheckIndex.class12:
                case Rb5ClasscheckIndex.class13: return `CLASS ${25 - classcheck.class}`
                default: return `CLASS ${Rb5ClasscheckIndex.class0 - classcheck.class}`
            }
        } else {
            switch (classcheck.class) {
                case Rb6ClasscheckIndex.class0: return "CLASS 零"
                case Rb6ClasscheckIndex.kiwami: return "極"
                default: return `CLASS ${Rb6ClasscheckIndex.class0 - classcheck.class}`
            }
        }
    })
    readonly clearInfoSub = computed(() => {
        const classcheck = this.classcheck()
        if (!isVersion(classcheck, 4)) return undefined
        if (classcheck.class < Rb4DojoIndex.examination) {
            if (classcheck.clearType > 1) return "Clear"
            return "Failed"
        }
        if (!classcheck.examination) return undefined
        const examination = classcheck.examination
        const score = classcheck.totalScore
        if (score >= examination.scoreBorderA) return "Rank A"
        else if (score >= examination.scoreBorderB) return "Rank B"
        else if (score >= examination.scoreBorderC) return "Rank C"
        else if (score >= examination.scoreBorderD) return "Rank D"
        return "Rank F"
    })
    readonly clearInfoMain = computed(() => {
        const classcheck = this.classcheck()
        if (isVersion(classcheck, 4)) {
            if (classcheck.class < Rb4DojoIndex.examination || !classcheck.examination) {
                if (classcheck.clearType > 1) return "合格"
                return "不合格"
            }
            const examination = classcheck.examination
            const score = classcheck.totalScore
            if (score >= examination.scoreBorderA) return "秀"
            else if (score >= examination.scoreBorderB) return "優"
            else if (score >= examination.scoreBorderC) return "良"
            else if (score >= examination.scoreBorderD) return "可"
            return "不可"
        } else {
            if (classcheck.clearType > 1) return "Clear"
            return "Failed"
        }
    })
}

function isVersion<T extends RbVersionWithClasscheck>(classcheck: RbClasscheckResponse<RbVersionWithClasscheck>, version: T): classcheck is RbClasscheckResponse<T> {
    return classcheck.version === version
}
