import { Rb6PastelLevel } from "../../models/rb6/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb6PastelLevel = loadCsvAsync<Rb6PastelLevel>("rb6_pastel_level")