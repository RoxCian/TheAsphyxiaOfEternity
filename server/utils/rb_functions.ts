import { Rb1ClearType, Rb1ClearTypeLiteral, Rb2ClearType, Rb3ClearType, Rb3ClearTypeLiteral, Rb4ClearType, Rb4ClearTypeLiteral, Rb6ClearType, Rb6ClearTypeLiteral, RbClearType, RbClearTypeLiteral, RbVersion } from "../models/shared/rb_types"

export function toLiteralClearType<TVersion extends RbVersion>(version: TVersion, clearType: RbClearType<TVersion>, miss: number | "RIVAL", ar100: number | undefined): RbClearTypeLiteral<TVersion> {
    switch (version) {
        case 1:
            switch (clearType) {
                case Rb1ClearType.failed: return Rb1ClearTypeLiteral.failed as RbClearTypeLiteral<TVersion>
                case Rb1ClearType.clear: return (miss === 0 ? Rb1ClearTypeLiteral.fullCombo : Rb1ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                case Rb1ClearType.fullCombo: return (miss === 0 || miss === "RIVAL" ? Rb1ClearTypeLiteral.fullCombo : Rb1ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                default: return Rb1ClearTypeLiteral.none as RbClearTypeLiteral<TVersion>
            }
        case 2:
            switch (clearType) {
                case Rb2ClearType.failed: return Rb1ClearTypeLiteral.failed as RbClearTypeLiteral<TVersion>
                case Rb2ClearType.clear: return (miss === 0 ? Rb1ClearTypeLiteral.fullCombo : Rb1ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                case Rb2ClearType.fullCombo: return (miss === 0 || miss === "RIVAL" ? Rb1ClearTypeLiteral.fullCombo : Rb1ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                default: return Rb1ClearTypeLiteral.none as RbClearTypeLiteral<TVersion>
            }
        case 3:
            switch (clearType) {
                case Rb3ClearType.failed:
                case Rb3ClearType.battleFailed: return Rb3ClearTypeLiteral.failed as RbClearTypeLiteral<TVersion>
                case Rb3ClearType.fullCombo:
                    if (miss === "RIVAL") return Rb3ClearTypeLiteral.fullCombo as RbClearTypeLiteral<TVersion>
                    // else pass through case tag
                case Rb3ClearType.clear:
                    switch (miss) {
                        case 0: return Rb3ClearTypeLiteral.fullCombo as RbClearTypeLiteral<TVersion>
                        case 1: return Rb3ClearTypeLiteral.miss1 as RbClearTypeLiteral<TVersion>
                        case 2: return Rb3ClearTypeLiteral.miss2 as RbClearTypeLiteral<TVersion>
                        default: return Rb3ClearTypeLiteral.clear as RbClearTypeLiteral<TVersion>
                    }
                default: return Rb3ClearTypeLiteral.none as RbClearTypeLiteral<TVersion>
            }
        case 4:
        case 5:
            switch (clearType) {
                case Rb4ClearType.failed:
                case Rb4ClearType.hardFailed:
                case Rb4ClearType.sHardFailed: return Rb4ClearTypeLiteral.failed as RbClearTypeLiteral<TVersion>
                case Rb4ClearType.clear: return (miss === 0 ? Rb4ClearTypeLiteral.fullCombo : Rb4ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                case Rb4ClearType.hardClear: return (miss === 0 ? Rb4ClearTypeLiteral.fullCombo : Rb4ClearTypeLiteral.hardClear) as RbClearTypeLiteral<TVersion>
                case Rb4ClearType.sHardClear: return (miss === 0 ? Rb4ClearTypeLiteral.fullCombo : Rb4ClearTypeLiteral.sHardClear) as RbClearTypeLiteral<TVersion>
                default: return Rb4ClearTypeLiteral.none as RbClearTypeLiteral<TVersion>
            }
        case 6:
            switch (clearType) {
                case Rb6ClearType.failed:
                case Rb6ClearType.hardFailed: return Rb6ClearTypeLiteral.failed as RbClearTypeLiteral<TVersion>
                case Rb6ClearType.clear: return (ar100 === 10000 ? Rb6ClearTypeLiteral.excellent : miss === 0 ? Rb6ClearTypeLiteral.fullCombo : Rb6ClearTypeLiteral.clear) as RbClearTypeLiteral<TVersion>
                case Rb6ClearType.hardClear: return (ar100 === 10000 ? Rb6ClearTypeLiteral.excellent : miss === 0 ? Rb6ClearTypeLiteral.fullCombo : Rb6ClearTypeLiteral.hardClear) as RbClearTypeLiteral<TVersion>
                default: return Rb6ClearTypeLiteral.none as RbClearTypeLiteral<TVersion>
            }
    }
}