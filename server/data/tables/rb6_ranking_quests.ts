import { Rb6Quest } from "../../models/rb6/quest"
import { loadCsv } from "../../utils/csv"

export const rb6RankingQuests = loadCsv("rb6_ranking_quests", Rb6Quest)