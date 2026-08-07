import { RbChartType, RbMusicVariation, RbVersion } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"

export const rbMusicVariation = loadCsv<RbMusicVariation<RbVersion, RbChartType<RbVersion>>>("rb_music_variation")
