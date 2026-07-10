import { Rb6Quest } from "../../models/rb6/quest"
import { Rb6DungeonInfo, Rb6QuestInfo } from "../../models/rb6/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb6Quests = loadCsvAsync("rb6_quests", Rb6Quest)
export const rb6QuestsInfo = loadCsvAsync<Rb6QuestInfo>("rb6_quests_info")
export const rb6DungeonsInfo = loadCsvAsync<Rb6DungeonInfo>("rb6_dungeons_info")