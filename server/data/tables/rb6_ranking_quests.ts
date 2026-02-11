import { Rb6Quest } from "../../models/rb6/quest"
import { loadCsvAsync } from "../../utils/csv"

export const rb6RankingQuests = loadCsvAsync("rb6_ranking_quests", Rb6Quest)