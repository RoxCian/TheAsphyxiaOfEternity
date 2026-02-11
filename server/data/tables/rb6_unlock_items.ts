import { Rb6ItemControl } from "../../models/rb6/item"
import { loadCsvAsync } from "../../utils/csv"

export const rb6UnlockItems = loadCsvAsync("rb6_ranking_quests", Rb6ItemControl)