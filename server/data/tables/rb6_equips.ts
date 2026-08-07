import { Rb6EquipmentInfo } from "../../models/rb6/types"
import { loadCsv } from "../../utils/csv"

export const rb6Equips = loadCsv<Rb6EquipmentInfo>("rb6_equips")