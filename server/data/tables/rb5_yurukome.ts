import { Rb5YurukomeInfo } from "../../models/rb5/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb5Yurukome = loadCsvAsync<Rb5YurukomeInfo>("rb5_yurukome")