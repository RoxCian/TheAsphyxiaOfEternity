import { Rb4ExaminationInfo } from "../../models/rb4/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb4Examination = loadCsvAsync<Rb4ExaminationInfo>("rb4_examination")