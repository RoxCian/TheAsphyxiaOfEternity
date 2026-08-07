import { Rb2GlassInfo } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"

export const rb2Glasses = loadCsv<Rb2GlassInfo>("rb2_glasses")
