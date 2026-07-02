import { Rb2GlassInfo } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"

export const rb2Glasses = loadCsvAsync<Rb2GlassInfo>("rb2_glasses")
