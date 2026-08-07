import { Rb6PastelLevel } from "../../models/rb6/types"
import { loadCsv } from "../../utils/csv"

export const rb6PastelLevel = loadCsv<Rb6PastelLevel>("rb6_pastel_level")