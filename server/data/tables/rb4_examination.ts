import { Rb4ExaminationInfo } from "../../models/rb4/types"
import { loadCsv } from "../../utils/csv"

export const rb4Examination = loadCsv<Rb4ExaminationInfo>("rb4_examination")