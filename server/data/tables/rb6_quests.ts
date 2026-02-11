import { Rb6Quest } from "../../models/rb6/quest"
import { loadCsvAsync } from "../../utils/csv"

export const rb6Quests = loadCsvAsync("rb6_quests", Rb6Quest)