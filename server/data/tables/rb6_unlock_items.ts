import { Rb6ItemControl } from "../../models/rb6/item"
import { loadCsv } from "../../utils/csv"

export const rb6UnlockItems = loadCsv("rb6_unlock_items", Rb6ItemControl)