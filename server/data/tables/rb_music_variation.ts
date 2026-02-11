import { RbChartType, RbMusicVariation, RbVersion } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"

export const rbMusicVariation = loadCsvAsync<RbMusicVariation<RbVersion, RbChartType<RbVersion>>>("rb_music_variation")
