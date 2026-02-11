import { Rb6EquipmentInfo } from "../../models/rb6/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb6Equips = loadCsvAsync<Rb6EquipmentInfo>("rb6_equips")