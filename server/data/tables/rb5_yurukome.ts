import { Rb5YurukomeInfo } from "../../models/rb5/types"
import { loadCsv } from "../../utils/csv"

export const rb5Yurukome = loadCsv<Rb5YurukomeInfo>("rb5_yurukome")