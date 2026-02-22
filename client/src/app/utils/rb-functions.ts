import { Rb4DojoIndex, Rb5ClasscheckIndex, Rb6ClasscheckIndex, RbChartType, RbClasscheckIndex, RbVersion, RbVersionLiteral, RbVersionWithClasscheck } from "rbweb"
import { RbClasscheckResponse } from "rbweb"

export function toRbTitleLiteral(version: RbVersion): RbVersionLiteral {
    switch (version) {
        case 1: return "rb"
        case 2: return "limelight"
        case 3: return "colette"
        case 4: return "groovin"
        case 5: return "volzza"
        case 6: return "reflesia"
        default: throw new Error("unknown version")
    }
}
export function toRbChartTypeLiteral<TVersion extends RbVersion>(value: RbChartType<TVersion> | `${RbChartType<TVersion>}`, version: TVersion): "BASIC" | "MEDIUM" | "HARD" | "SPECIAL" | "WHITEHARD" | undefined {
    switch (value) {
        case 0: case "0": return "BASIC"
        case 1: case "1": return "MEDIUM"
        case 2: case "2": return "HARD"
        case 3: case "3":
            if (version === 4 || version === 5) return "SPECIAL"
            if (version === 6) return "WHITEHARD"
            return undefined
        default: return undefined
    }
}
export function getRbRank(achievementRate: number, version: RbVersion) {
    if (version === 6 && (achievementRate >= 98)) return "S"
    else if (version !== 1 && (achievementRate >= 95)) return "AAA⁺"
    else if (achievementRate >= 90) return "AAA"
    else if (achievementRate >= 80) return "AA"
    else if (achievementRate >= (version == 6 ? 70 : 65)) return "A"
    else if (achievementRate >= 55) return "B"
    else return "C"
}
export function toRbClasscheckSub<TVersion extends RbVersionWithClasscheck>(classcheck: RbClasscheckResponse<TVersion>) {
    if (classcheck.version === 4) {
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
    } else if (classcheck.version === 5) {
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
}

export function toRbClasscheckNameMain<TVersion extends RbVersionWithClasscheck>(classcheck: RbClasscheckResponse<TVersion>) {
    if (classcheck.version === 4) {
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
    } else if (classcheck.version === 5) {
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
}
export function getRbDefaultComment(version: RbVersion): string {
    switch (version) {
        case 1: return "Welcome to REFLEC BEAT!"
        case 2: return "Enjoy limelight world!"
        case 3: return "Welcome to REFLEC BEAT colette!"
        case 4: return "Welcome to REFLEC BEAT groovin'!!"
        case 5: return "Welcome to REFLEC BEAT VOLZZA!"
        case 6: return "Welcome to the land of Reflesia!"
    }
}